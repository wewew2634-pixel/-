"""
Proofs API Routes - QA and Vision Processing
Handle proof submission, QA automation, and vision-based verification
"""

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
import json
import os
import logging

from db import (
    get_db, Proof, Assignment, AssignmentState, ProofDecision,
    ProofCreate, ProofResponse, can_transition
)

router = APIRouter()
logger = logging.getLogger(__name__)

def validate_video_requirements(qa_json: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate video against basic requirements
    Returns QA result with pass/fail decisions
    """
    qa_result = {
        "checks": {},
        "overall_score": 0.0,
        "decision": ProofDecision.PENDING.value,
        "issues": [],
        "recommendations": []
    }
    
    try:
        # Check 1: Duration (≤15 seconds)
        duration = qa_json.get("duration_sec", 0)
        if duration <= 15:
            qa_result["checks"]["duration"] = {"pass": True, "value": duration, "max": 15}
        else:
            qa_result["checks"]["duration"] = {"pass": False, "value": duration, "max": 15}
            qa_result["issues"].append(f"Video too long: {duration}s (max 15s)")
        
        # Check 2: File size (≤25MB)
        file_size_mb = qa_json.get("file_size_mb", 0)
        if file_size_mb <= 25:
            qa_result["checks"]["file_size"] = {"pass": True, "value": file_size_mb, "max": 25}
        else:
            qa_result["checks"]["file_size"] = {"pass": False, "value": file_size_mb, "max": 25}
            qa_result["issues"].append(f"File too large: {file_size_mb}MB (max 25MB)")
        
        # Check 3: Resolution (minimum 720p)
        resolution = qa_json.get("resolution", "")
        width, height = 0, 0
        if "x" in resolution:
            try:
                width, height = map(int, resolution.split("x"))
            except:
                pass
        
        if min(width, height) >= 720:
            qa_result["checks"]["resolution"] = {"pass": True, "value": resolution}
        else:
            qa_result["checks"]["resolution"] = {"pass": False, "value": resolution}
            qa_result["issues"].append(f"Resolution too low: {resolution} (min 720p)")
        
        # Check 4: Ad disclosure (basic text check - placeholder)
        has_ad_disclosure = qa_json.get("has_ad_disclosure", False)
        qa_result["checks"]["ad_disclosure"] = {"pass": has_ad_disclosure}
        if not has_ad_disclosure:
            qa_result["issues"].append("Missing #광고 disclosure")
            qa_result["recommendations"].append("Add #광고 to video title or description")
        
        # Calculate overall score
        passed_checks = sum(1 for check in qa_result["checks"].values() if check.get("pass", False))
        total_checks = len(qa_result["checks"])
        qa_result["overall_score"] = passed_checks / total_checks if total_checks > 0 else 0
        
        # Determine decision
        if qa_result["overall_score"] >= 0.8:  # 80% pass rate
            qa_result["decision"] = ProofDecision.PASS.value
        elif qa_result["overall_score"] >= 0.5:  # 50% - needs rework
            qa_result["decision"] = ProofDecision.REWORK.value
            qa_result["recommendations"].append("Fix the issues listed and resubmit")
        else:
            qa_result["decision"] = ProofDecision.REJECT.value
            qa_result["recommendations"].append("Multiple critical issues found")
        
    except Exception as e:
        logger.error(f"QA validation error: {str(e)}")
        qa_result["decision"] = ProofDecision.REWORK.value
        qa_result["issues"].append("QA system error - please try again")
    
    return qa_result

@router.post("/qa")
async def proof_qa_basic(
    assignment_id: int,
    video_url: str,
    duration_sec: Optional[float] = None,
    file_size_mb: Optional[float] = None,
    resolution: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Basic Proof-QA with simple rule validation
    Checks duration, file size, resolution, and basic ad disclosure
    """
    try:
        # Get assignment
        assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
        if not assignment:
            raise HTTPException(status_code=404, detail="Assignment not found")
        
        # Check if assignment is in correct state
        if assignment.state != AssignmentState.SUBMITTED.value:
            raise HTTPException(
                status_code=400, 
                detail=f"Assignment must be in SUBMITTED state for QA (current: {assignment.state})"
            )
        
        # Prepare QA input
        qa_input = {
            "duration_sec": duration_sec,
            "file_size_mb": file_size_mb,
            "resolution": resolution,
            "has_ad_disclosure": False,  # Placeholder - would need actual text analysis
            "video_url": video_url
        }
        
        # Run QA validation
        qa_result = validate_video_requirements(qa_input)
        
        # Create or update proof record
        existing_proof = db.query(Proof).filter(Proof.assignment_id == assignment_id).first()
        if existing_proof:
            # Update existing proof
            existing_proof.qa_json = qa_result
            existing_proof.final_decision = qa_result["decision"]
            proof = existing_proof
        else:
            # Create new proof
            proof = Proof(
                assignment_id=assignment_id,
                video_url=video_url,
                qa_json=qa_result,
                final_decision=qa_result["decision"],
                file_size_mb=file_size_mb,
                duration_sec=duration_sec,
                resolution=resolution
            )
            db.add(proof)
        
        # Update assignment state based on QA decision
        if qa_result["decision"] == ProofDecision.PASS.value:
            if can_transition(AssignmentState(assignment.state), AssignmentState.PROOF_PASS):
                assignment.state = AssignmentState.PROOF_PASS.value
        elif qa_result["decision"] == ProofDecision.REWORK.value:
            if can_transition(AssignmentState(assignment.state), AssignmentState.PROOF_REWORK):
                assignment.state = AssignmentState.PROOF_REWORK.value
        
        db.commit()
        db.refresh(proof)
        
        return {
            "proof_id": proof.id,
            "assignment_id": assignment_id,
            "qa_result": qa_result,
            "assignment_state": assignment.state,
            "next_step": "Payment processing" if qa_result["decision"] == ProofDecision.PASS.value else "Fix issues and resubmit"
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"QA processing failed: {str(e)}")

@router.post("/qa/vision/tuned")
async def proof_qa_vision_tuned(
    assignment_id: int,
    video_url: str,
    enable_ocr: bool = True,
    enable_logo_match: bool = True,
    enable_geofence_check: bool = True,
    db: Session = Depends(get_db)
):
    """
    Advanced Proof-QA with Vision processing
    OCR + Logo matching + Geofence verification + Frame sampling
    """
    try:
        # Get assignment and mission
        assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
        if not assignment:
            raise HTTPException(status_code=404, detail="Assignment not found")
        
        mission = assignment.mission
        if not mission:
            raise HTTPException(status_code=400, detail="Mission not found for assignment")
        
        # Initialize vision QA result
        qa_result = {
            "checks": {},
            "vision_analysis": {},
            "overall_score": 0.0,
            "decision": ProofDecision.PENDING.value,
            "issues": [],
            "recommendations": []
        }
        
        # Simulate advanced vision processing (placeholder implementation)
        # In production, this would integrate with actual CV/ML models
        
        if enable_ocr:
            # OCR Text Detection (placeholder)
            qa_result["vision_analysis"]["ocr"] = {
                "detected_text": ["Sample text", "#광고", mission.merchant_name],
                "confidence_scores": [0.95, 0.88, 0.92],
                "has_ad_disclosure": True,  # Would check for #광고 in detected text
                "has_merchant_mention": True  # Would check for merchant name
            }
            
            qa_result["checks"]["ad_disclosure_ocr"] = {"pass": True, "confidence": 0.88}
            qa_result["checks"]["merchant_mention"] = {"pass": True, "confidence": 0.92}
        
        if enable_logo_match:
            # Logo/Brand Detection (placeholder)
            qa_result["vision_analysis"]["logo_detection"] = {
                "detected_logos": [{"name": mission.merchant_name, "confidence": 0.87, "bbox": [100, 100, 200, 150]}],
                "brand_consistency": True
            }
            
            qa_result["checks"]["logo_presence"] = {"pass": True, "confidence": 0.87}
        
        if enable_geofence_check and assignment.actual_location and mission.geofence:
            # Geofence Verification (would use actual location comparison)
            geofence_lat = mission.geofence.get("lat", 0)
            geofence_lng = mission.geofence.get("lng", 0)
            actual_lat = assignment.actual_location.get("lat", 0)
            actual_lng = assignment.actual_location.get("lng", 0)
            
            # Simplified distance check (would use proper geospatial calculation)
            distance_ok = abs(geofence_lat - actual_lat) < 0.01 and abs(geofence_lng - actual_lng) < 0.01
            
            qa_result["vision_analysis"]["geofence"] = {
                "within_boundary": distance_ok,
                "distance_km": 0.5 if distance_ok else 2.1  # Mock distance
            }
            
            qa_result["checks"]["geofence"] = {"pass": distance_ok}
            if not distance_ok:
                qa_result["issues"].append("Content appears to be filmed outside the designated area")
        
        # Frame Quality Analysis (placeholder)
        qa_result["vision_analysis"]["quality"] = {
            "brightness": 0.75,
            "contrast": 0.68,
            "sharpness": 0.82,
            "overall_quality": 0.75
        }
        
        qa_result["checks"]["video_quality"] = {"pass": True, "score": 0.75}
        
        # Calculate overall score
        passed_checks = sum(1 for check in qa_result["checks"].values() if check.get("pass", False))
        total_checks = len(qa_result["checks"])
        qa_result["overall_score"] = passed_checks / total_checks if total_checks > 0 else 0
        
        # Determine decision with vision-enhanced criteria
        if qa_result["overall_score"] >= 0.9:  # Higher standard for vision QA
            qa_result["decision"] = ProofDecision.PASS.value
        elif qa_result["overall_score"] >= 0.6:
            qa_result["decision"] = ProofDecision.REWORK.value
            qa_result["recommendations"].append("Address vision QA feedback and resubmit")
        else:
            qa_result["decision"] = ProofDecision.REJECT.value
        
        # Create or update proof record
        existing_proof = db.query(Proof).filter(Proof.assignment_id == assignment_id).first()
        if existing_proof:
            existing_proof.qa_json = qa_result
            existing_proof.final_decision = qa_result["decision"]
            proof = existing_proof
        else:
            proof = Proof(
                assignment_id=assignment_id,
                video_url=video_url,
                qa_json=qa_result,
                final_decision=qa_result["decision"]
            )
            db.add(proof)
        
        # Update assignment state
        if qa_result["decision"] == ProofDecision.PASS.value:
            if can_transition(AssignmentState(assignment.state), AssignmentState.PROOF_PASS):
                assignment.state = AssignmentState.PROOF_PASS.value
        elif qa_result["decision"] == ProofDecision.REWORK.value:
            if can_transition(AssignmentState(assignment.state), AssignmentState.PROOF_REWORK):
                assignment.state = AssignmentState.PROOF_REWORK.value
        
        db.commit()
        db.refresh(proof)
        
        return {
            "proof_id": proof.id,
            "assignment_id": assignment_id,
            "qa_result": qa_result,
            "vision_enabled": {
                "ocr": enable_ocr,
                "logo_match": enable_logo_match,
                "geofence_check": enable_geofence_check
            },
            "assignment_state": assignment.state
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Vision QA failed: {str(e)}")

@router.get("/{proof_id}", response_model=ProofResponse)
async def get_proof(
    proof_id: int,
    db: Session = Depends(get_db)
):
    """Get proof by ID"""
    proof = db.query(Proof).filter(Proof.id == proof_id).first()
    if not proof:
        raise HTTPException(status_code=404, detail="Proof not found")
    
    return proof

@router.get("/assignment/{assignment_id}")
async def get_assignment_proofs(
    assignment_id: int,
    db: Session = Depends(get_db)
):
    """Get all proofs for an assignment"""
    proofs = db.query(Proof).filter(Proof.assignment_id == assignment_id).all()
    
    return {
        "proofs": proofs,
        "count": len(proofs),
        "assignment_id": assignment_id
    }

@router.post("/manual_review")
async def manual_review_proof(
    proof_id: int,
    decision: str,
    reviewer_notes: Optional[str] = None,
    review_score: Optional[float] = None,
    db: Session = Depends(get_db)
):
    """Manual review override for proof decision"""
    try:
        # Validate decision
        if decision not in [ProofDecision.PASS.value, ProofDecision.REWORK.value, ProofDecision.REJECT.value]:
            raise HTTPException(status_code=400, detail="Invalid decision value")
        
        proof = db.query(Proof).filter(Proof.id == proof_id).first()
        if not proof:
            raise HTTPException(status_code=404, detail="Proof not found")
        
        # Update proof with manual review
        proof.final_decision = decision
        proof.reviewer_notes = reviewer_notes
        proof.review_score = review_score
        
        # Update QA JSON with manual review info
        if proof.qa_json:
            proof.qa_json["manual_review"] = {
                "decision": decision,
                "notes": reviewer_notes,
                "score": review_score,
                "reviewed_at": datetime.now(timezone.utc).isoformat()
            }
        
        # Update assignment state
        assignment = proof.assignment
        if assignment:
            if decision == ProofDecision.PASS.value:
                if can_transition(AssignmentState(assignment.state), AssignmentState.PROOF_PASS):
                    assignment.state = AssignmentState.PROOF_PASS.value
            elif decision == ProofDecision.REWORK.value:
                if can_transition(AssignmentState(assignment.state), AssignmentState.PROOF_REWORK):
                    assignment.state = AssignmentState.PROOF_REWORK.value
        
        db.commit()
        db.refresh(proof)
        
        return {
            "message": "Manual review completed",
            "proof_id": proof_id,
            "decision": decision,
            "assignment_state": assignment.state if assignment else None
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Manual review failed: {str(e)}")

@router.get("/stats")
async def get_proof_stats(db: Session = Depends(get_db)):
    """Get proof processing statistics"""
    try:
        from sqlalchemy import func
        
        stats = db.query(
            Proof.final_decision,
            func.count(Proof.id).label('count')
        ).group_by(Proof.final_decision).all()
        
        total_proofs = db.query(Proof).count()
        avg_score = db.query(func.avg(Proof.review_score)).scalar() or 0
        
        decision_stats = {decision: count for decision, count in stats}
        
        return {
            "total_proofs": total_proofs,
            "decisions": decision_stats,
            "average_review_score": round(avg_score, 2),
            "pass_rate": round((decision_stats.get(ProofDecision.PASS.value, 0) / total_proofs * 100), 2) if total_proofs > 0 else 0
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get proof stats: {str(e)}")