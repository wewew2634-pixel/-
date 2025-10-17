"""
Upload API Routes
Handle direct file uploads and presigned URL generation
"""

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import os
import uuid
import mimetypes
from typing import Optional
import aiofiles
import logging

from db import get_db

router = APIRouter()
logger = logging.getLogger(__name__)

# Upload configuration
UPLOAD_DIR = "uploads"
MAX_FILE_SIZE = 25 * 1024 * 1024  # 25MB
ALLOWED_VIDEO_TYPES = ["video/webm", "video/mp4", "video/quicktime"]
ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

def validate_file_upload(file: UploadFile) -> dict:
    """
    Validate uploaded file against security and size requirements
    """
    validation_result = {
        "valid": True,
        "errors": [],
        "warnings": []
    }
    
    # Check file size
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()
    file.file.seek(0)  # Reset to beginning
    
    if file_size > MAX_FILE_SIZE:
        validation_result["valid"] = False
        validation_result["errors"].append(f"File size {file_size} exceeds maximum {MAX_FILE_SIZE} bytes")
    
    # Check MIME type
    detected_type = mimetypes.guess_type(file.filename)[0]
    
    if file.content_type not in ALLOWED_VIDEO_TYPES + ALLOWED_IMAGE_TYPES:
        validation_result["valid"] = False
        validation_result["errors"].append(f"File type {file.content_type} not allowed")
    
    # Additional security checks
    if not file.filename or ".." in file.filename:
        validation_result["valid"] = False
        validation_result["errors"].append("Invalid filename")
    
    # Check file extension matches content type
    file_ext = os.path.splitext(file.filename)[1].lower()
    expected_extensions = {
        "video/webm": [".webm"],
        "video/mp4": [".mp4"],
        "video/quicktime": [".mov"],
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "image/webp": [".webp"]
    }
    
    if file.content_type in expected_extensions:
        if file_ext not in expected_extensions[file.content_type]:
            validation_result["warnings"].append(f"File extension {file_ext} may not match content type {file.content_type}")
    
    return validation_result

@router.post("/direct_upload")
async def direct_upload(
    file: UploadFile = File(...),
    assignment_id: Optional[int] = Form(default=None),
    db: Session = Depends(get_db)
):
    """
    Direct file upload for development/testing
    In production, this should be replaced with presigned S3/MinIO URLs
    """
    try:
        # Validate file
        validation = validate_file_upload(file)
        if not validation["valid"]:
            raise HTTPException(status_code=400, detail={
                "message": "File validation failed",
                "errors": validation["errors"]
            })
        
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4().hex}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Save file
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        # Calculate file info
        file_size_mb = len(content) / (1024 * 1024)
        
        # For video files, would normally extract additional metadata here
        # (duration, resolution, etc.) using ffmpeg or similar
        metadata = {
            "filename": file.filename,
            "size_bytes": len(content),
            "size_mb": round(file_size_mb, 2),
            "content_type": file.content_type,
            "file_path": file_path
        }
        
        # If this is for an assignment, could validate against mission requirements
        if assignment_id:
            # Additional validation logic would go here
            metadata["assignment_id"] = assignment_id
        
        file_url = f"/uploads/{unique_filename}"  # Relative URL for serving
        
        logger.info(f"File uploaded successfully: {unique_filename} ({file_size_mb:.2f}MB)")
        
        return {
            "message": "File uploaded successfully",
            "file_url": file_url,
            "file_id": unique_filename,
            "metadata": metadata,
            "validation": validation
        }
    
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.post("/presign")
async def generate_presign_url(
    filename: str,
    content_type: str,
    file_size: int,
    assignment_id: Optional[int] = None
):
    """
    Generate presigned URL for S3/MinIO upload (production use)
    Currently returns a mock response - would integrate with actual storage service
    """
    try:
        # Validate request
        if content_type not in ALLOWED_VIDEO_TYPES + ALLOWED_IMAGE_TYPES:
            raise HTTPException(status_code=400, detail=f"Content type {content_type} not allowed")
        
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail=f"File size {file_size} exceeds maximum {MAX_FILE_SIZE}")
        
        # Generate unique key
        file_extension = os.path.splitext(filename)[1]
        unique_key = f"uploads/{uuid.uuid4().hex}{file_extension}"
        
        # In production, generate actual presigned URL
        # Example with boto3/MinIO:
        # presigned_url = s3_client.generate_presigned_url(
        #     'put_object',
        #     Params={'Bucket': bucket_name, 'Key': unique_key, 'ContentType': content_type},
        #     ExpiresIn=3600
        # )
        
        # Mock response for development
        mock_presigned_url = f"https://storage.example.com/{unique_key}?signature=mock_signature&expires=3600"
        
        return {
            "presigned_url": mock_presigned_url,
            "file_key": unique_key,
            "expires_in": 3600,  # 1 hour
            "upload_instructions": {
                "method": "PUT",
                "headers": {
                    "Content-Type": content_type,
                    "Content-Length": str(file_size)
                },
                "max_size": MAX_FILE_SIZE
            },
            "callback_url": f"/api/upload_callback?key={unique_key}&assignment_id={assignment_id}" if assignment_id else None
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Presign generation failed: {str(e)}")

@router.post("/upload_callback")
async def upload_callback(
    key: str,
    assignment_id: Optional[int] = None,
    success: bool = True,
    db: Session = Depends(get_db)
):
    """
    Callback endpoint for presigned upload completion
    """
    try:
        if not success:
            return {"message": "Upload failed", "key": key}
        
        # Generate final URL
        file_url = f"https://storage.example.com/{key}"  # Would be actual CDN URL
        
        # If assignment_id provided, could trigger automatic QA processing
        if assignment_id:
            # This would typically trigger proof QA processing
            logger.info(f"Upload completed for assignment {assignment_id}: {key}")
            
            # Could automatically call proof QA here
            return {
                "message": "Upload completed, QA processing started",
                "file_url": file_url,
                "assignment_id": assignment_id,
                "next_step": "proof_qa_processing"
            }
        
        return {
            "message": "Upload completed",
            "file_url": file_url,
            "key": key
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload callback failed: {str(e)}")

@router.get("/upload_status/{file_id}")
async def get_upload_status(file_id: str):
    """
    Check upload status (for offline queue polling)
    """
    try:
        file_path = os.path.join(UPLOAD_DIR, file_id)
        
        if os.path.exists(file_path):
            file_stats = os.stat(file_path)
            return {
                "status": "completed",
                "file_id": file_id,
                "file_size": file_stats.st_size,
                "uploaded_at": file_stats.st_mtime,
                "file_url": f"/uploads/{file_id}"
            }
        else:
            return {
                "status": "not_found",
                "file_id": file_id
            }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Status check failed: {str(e)}")

@router.delete("/delete/{file_id}")
async def delete_uploaded_file(file_id: str):
    """
    Delete uploaded file (cleanup)
    """
    try:
        file_path = os.path.join(UPLOAD_DIR, file_id)
        
        if os.path.exists(file_path):
            os.remove(file_path)
            return {"message": f"File {file_id} deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="File not found")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File deletion failed: {str(e)}")

@router.get("/quota/{creator_id}")
async def get_upload_quota(creator_id: int, db: Session = Depends(get_db)):
    """
    Get upload quota/limits for creator
    """
    try:
        # Mock quota system - would integrate with actual usage tracking
        daily_limit_mb = 500  # 500MB per day
        monthly_limit_mb = 5000  # 5GB per month
        
        # Would query actual usage from database/storage service
        daily_used_mb = 45.6  # Mock usage
        monthly_used_mb = 234.7
        
        return {
            "creator_id": creator_id,
            "quotas": {
                "daily_limit_mb": daily_limit_mb,
                "daily_used_mb": daily_used_mb,
                "daily_remaining_mb": daily_limit_mb - daily_used_mb,
                "monthly_limit_mb": monthly_limit_mb,
                "monthly_used_mb": monthly_used_mb,
                "monthly_remaining_mb": monthly_limit_mb - monthly_used_mb
            },
            "file_limits": {
                "max_file_size_mb": MAX_FILE_SIZE / (1024 * 1024),
                "allowed_types": ALLOWED_VIDEO_TYPES + ALLOWED_IMAGE_TYPES,
                "max_duration_sec": 15
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quota check failed: {str(e)}")

@router.get("/health")
async def upload_service_health():
    """
    Health check for upload service
    """
    try:
        # Check upload directory
        upload_dir_ok = os.path.exists(UPLOAD_DIR) and os.access(UPLOAD_DIR, os.W_OK)
        
        # Check disk space (simplified)
        disk_usage = os.statvfs(UPLOAD_DIR)
        free_space_gb = (disk_usage.f_frsize * disk_usage.f_bavail) / (1024**3)
        
        return {
            "status": "healthy" if upload_dir_ok and free_space_gb > 1 else "warning",
            "upload_dir_writable": upload_dir_ok,
            "free_space_gb": round(free_space_gb, 2),
            "max_file_size_mb": MAX_FILE_SIZE / (1024 * 1024),
            "allowed_types": len(ALLOWED_VIDEO_TYPES + ALLOWED_IMAGE_TYPES)
        }
    
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }