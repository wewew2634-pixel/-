"""
Creator API Routes
Handle creator content, profile, and feed functionality
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from typing import List, Optional
from datetime import datetime, timezone

from db import get_db, Creator, Content, Assignment, Payment

router = APIRouter()

@router.post("/content/publish")
async def publish_content(
    creator_id: int,
    media_url: str,
    caption: Optional[str] = None,
    hashtags: Optional[List[str]] = None,
    db: Session = Depends(get_db)
):
    """
    Publish creator content (after successful upload + QA)
    """
    try:
        # Create content record
        content = Content(
            creator_id=creator_id,
            media_url=media_url,
            caption=caption or "",
            hashtags=hashtags or [],
            is_published=True,
            moderation_status="approved"  # Would integrate with moderation system
        )
        
        db.add(content)
        db.commit()
        db.refresh(content)
        
        return {
            "message": "Content published successfully",
            "content_id": content.id,
            "creator_id": creator_id,
            "media_url": media_url,
            "published_at": content.created_at
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to publish content: {str(e)}")

@router.get("/content/feed")
async def get_content_feed(
    limit: int = 20,
    offset: int = 0,
    featured_only: bool = False,
    db: Session = Depends(get_db)
):
    """
    Get content feed for SwipeFeed component
    """
    try:
        query = db.query(Content).filter(Content.is_published == True)
        
        if featured_only:
            query = query.filter(Content.is_featured == True)
        
        contents = query.order_by(desc(Content.created_at)).offset(offset).limit(limit).all()
        
        # Format for SwipeFeed
        feed_items = []
        for content in contents:
            creator = db.query(Creator).filter(Creator.id == content.creator_id).first()
            
            feed_item = {
                "id": content.id,
                "media_url": content.media_url,
                "media_type": content.media_type,
                "caption": content.caption,
                "hashtags": content.hashtags,
                "likes_count": content.likes_count,
                "views_count": content.views_count,
                "created_at": content.created_at,
                "creator": {
                    "id": creator.id if creator else None,
                    "username": creator.username if creator else "Unknown",
                    "profile_url": creator.profile_url if creator else None
                } if creator else None
            }
            feed_items.append(feed_item)
        
        return {
            "feed": feed_items,
            "pagination": {
                "limit": limit,
                "offset": offset,
                "has_more": len(feed_items) == limit
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get content feed: {str(e)}")

@router.get("/profile/{creator_id}")
async def get_creator_profile(creator_id: int, db: Session = Depends(get_db)):
    """
    Get creator profile with stats and recent content
    """
    try:
        creator = db.query(Creator).filter(Creator.id == creator_id).first()
        if not creator:
            raise HTTPException(status_code=404, detail="Creator not found")
        
        # Get creator stats
        total_content = db.query(Content).filter(Content.creator_id == creator_id).count()
        total_likes = db.query(func.sum(Content.likes_count)).filter(Content.creator_id == creator_id).scalar() or 0
        total_views = db.query(func.sum(Content.views_count)).filter(Content.creator_id == creator_id).scalar() or 0
        
        # Assignment stats
        completed_assignments = db.query(Assignment).filter(
            Assignment.creator_id == creator_id,
            Assignment.state == "paid"
        ).count()
        
        # Recent content
        recent_content = db.query(Content).filter(
            Content.creator_id == creator_id,
            Content.is_published == True
        ).order_by(desc(Content.created_at)).limit(9).all()
        
        return {
            "creator": {
                "id": creator.id,
                "username": creator.username,
                "email": creator.email,
                "profile_url": creator.profile_url,
                "bio": creator.bio,
                "location": creator.location,
                "is_active": creator.is_active,
                "created_at": creator.created_at
            },
            "stats": {
                "total_missions": creator.total_missions,
                "success_rate": creator.success_rate,
                "total_earnings_krw": creator.total_earnings_krw,
                "total_content": total_content,
                "total_likes": total_likes,
                "total_views": total_views,
                "completed_assignments": completed_assignments
            },
            "recent_content": [
                {
                    "id": content.id,
                    "media_url": content.media_url,
                    "caption": content.caption[:100] + "..." if len(content.caption) > 100 else content.caption,
                    "likes_count": content.likes_count,
                    "created_at": content.created_at
                }
                for content in recent_content
            ]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get creator profile: {str(e)}")

@router.put("/profile/{creator_id}")
async def update_creator_profile(
    creator_id: int,
    username: Optional[str] = None,
    bio: Optional[str] = None,
    profile_url: Optional[str] = None,
    location: Optional[dict] = None,
    db: Session = Depends(get_db)
):
    """
    Update creator profile
    """
    try:
        creator = db.query(Creator).filter(Creator.id == creator_id).first()
        if not creator:
            raise HTTPException(status_code=404, detail="Creator not found")
        
        # Update fields if provided
        if username is not None:
            # Check username uniqueness
            existing = db.query(Creator).filter(
                Creator.username == username,
                Creator.id != creator_id
            ).first()
            if existing:
                raise HTTPException(status_code=400, detail="Username already taken")
            creator.username = username
        
        if bio is not None:
            creator.bio = bio
        
        if profile_url is not None:
            creator.profile_url = profile_url
        
        if location is not None:
            creator.location = location
        
        creator.updated_at = datetime.now(timezone.utc)
        
        db.commit()
        db.refresh(creator)
        
        return {
            "message": "Profile updated successfully",
            "creator": {
                "id": creator.id,
                "username": creator.username,
                "bio": creator.bio,
                "profile_url": creator.profile_url,
                "location": creator.location,
                "updated_at": creator.updated_at
            }
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")

@router.post("/content/{content_id}/like")
async def like_content(content_id: int, creator_id: int, db: Session = Depends(get_db)):
    """
    Like/unlike content (toggle)
    """
    try:
        content = db.query(Content).filter(Content.id == content_id).first()
        if not content:
            raise HTTPException(status_code=404, detail="Content not found")
        
        # Simple like increment (would implement proper like tracking in production)
        content.likes_count += 1
        db.commit()
        
        return {
            "message": "Content liked",
            "content_id": content_id,
            "new_likes_count": content.likes_count
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to like content: {str(e)}")

@router.post("/content/{content_id}/view")
async def record_content_view(content_id: int, db: Session = Depends(get_db)):
    """
    Record content view for analytics
    """
    try:
        content = db.query(Content).filter(Content.id == content_id).first()
        if not content:
            raise HTTPException(status_code=404, detail="Content not found")
        
        content.views_count += 1
        db.commit()
        
        return {
            "message": "View recorded",
            "content_id": content_id,
            "new_views_count": content.views_count
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to record view: {str(e)}")

@router.get("/leaderboard")
async def get_creator_leaderboard(
    period: str = "week",  # week, month, all
    metric: str = "earnings",  # earnings, missions, likes
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    Get creator leaderboard
    """
    try:
        if metric == "earnings":
            creators = db.query(Creator).order_by(
                desc(Creator.total_earnings_krw)
            ).limit(limit).all()
        elif metric == "missions":
            creators = db.query(Creator).order_by(
                desc(Creator.total_missions)
            ).limit(limit).all()
        else:  # likes or other content metrics
            creators = db.query(Creator).order_by(
                desc(Creator.total_earnings_krw)  # Fallback to earnings
            ).limit(limit).all()
        
        leaderboard = []
        for idx, creator in enumerate(creators, 1):
            # Get additional stats
            total_likes = db.query(func.sum(Content.likes_count)).filter(
                Content.creator_id == creator.id
            ).scalar() or 0
            
            leaderboard_entry = {
                "rank": idx,
                "creator": {
                    "id": creator.id,
                    "username": creator.username,
                    "profile_url": creator.profile_url
                },
                "stats": {
                    "total_earnings_krw": creator.total_earnings_krw,
                    "total_missions": creator.total_missions,
                    "success_rate": creator.success_rate,
                    "total_likes": total_likes
                },
                "metric_value": getattr(creator, f"total_{metric}_krw" if metric == "earnings" else f"total_{metric}", 0)
            }
            leaderboard.append(leaderboard_entry)
        
        return {
            "leaderboard": leaderboard,
            "metadata": {
                "period": period,
                "metric": metric,
                "limit": limit,
                "generated_at": datetime.now(timezone.utc).isoformat()
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get leaderboard: {str(e)}")

@router.get("/dashboard/{creator_id}")
async def get_creator_dashboard(creator_id: int, db: Session = Depends(get_db)):
    """
    Get creator dashboard data (for /creator/me page)
    """
    try:
        creator = db.query(Creator).filter(Creator.id == creator_id).first()
        if not creator:
            raise HTTPException(status_code=404, detail="Creator not found")
        
        # Recent assignments
        recent_assignments = db.query(Assignment).filter(
            Assignment.creator_id == creator_id
        ).order_by(desc(Assignment.created_at)).limit(5).all()
        
        # Recent payments
        recent_payments = db.query(Payment).join(Assignment).filter(
            Assignment.creator_id == creator_id
        ).order_by(desc(Payment.created_at)).limit(5).all()
        
        # This month's stats
        from datetime import date
        this_month_start = date.today().replace(day=1)
        
        monthly_earnings = db.query(func.sum(Payment.amount_krw)).join(Assignment).filter(
            Assignment.creator_id == creator_id,
            Payment.created_at >= this_month_start,
            Payment.status.in_(["t0_success", "completed"])
        ).scalar() or 0
        
        monthly_missions = db.query(Assignment).filter(
            Assignment.creator_id == creator_id,
            Assignment.created_at >= this_month_start
        ).count()
        
        return {
            "creator_summary": {
                "id": creator.id,
                "username": creator.username,
                "total_earnings_krw": creator.total_earnings_krw,
                "success_rate": creator.success_rate,
                "total_missions": creator.total_missions
            },
            "monthly_stats": {
                "earnings_krw": monthly_earnings,
                "missions_completed": monthly_missions,
                "month": this_month_start.strftime("%Y-%m")
            },
            "recent_activity": {
                "assignments": [
                    {
                        "id": assignment.id,
                        "state": assignment.state,
                        "created_at": assignment.created_at,
                        "mission_merchant": assignment.mission.merchant_name if assignment.mission else None
                    }
                    for assignment in recent_assignments
                ],
                "payments": [
                    {
                        "amount_krw": payment.amount_krw,
                        "status": payment.status,
                        "created_at": payment.created_at
                    }
                    for payment in recent_payments
                ]
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get creator dashboard: {str(e)}")