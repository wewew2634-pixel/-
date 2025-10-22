"""
Missions API Routes
Handle mission CRUD and listing with geospatial filtering
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from typing import List, Optional
from datetime import datetime, timezone
import math

from db import get_db, Mission, MissionCreate, MissionResponse, MissionStatus

router = APIRouter()

def calculate_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Calculate distance between two coordinates using Haversine formula (in km)"""
    R = 6371  # Earth's radius in kilometers
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lng = math.radians(lng2 - lng1)
    
    a = (math.sin(delta_lat / 2) * math.sin(delta_lat / 2) +
         math.cos(lat1_rad) * math.cos(lat2_rad) *
         math.sin(delta_lng / 2) * math.sin(delta_lng / 2))
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c

@router.get("/list", response_model=List[MissionResponse])
async def list_missions(
    status: Optional[str] = Query(default="open", description="Mission status filter"),
    lat: Optional[float] = Query(default=None, description="User latitude"),
    lng: Optional[float] = Query(default=None, description="User longitude"),
    radius_km: Optional[float] = Query(default=5.0, description="Search radius in km"),
    sort: Optional[str] = Query(default="near", description="Sort by: near, urgent, pay"),
    limit: int = Query(default=20, le=100, description="Maximum number of results"),
    db: Session = Depends(get_db)
):
    """
    List missions with geospatial and status filtering
    Sort options: near (distance), urgent (expires_at), pay (budget_krw)
    """
    try:
        query = db.query(Mission)
        
        # Filter by status
        if status:
            query = query.filter(Mission.status == status)
        
        # Filter by expiration (only non-expired missions)
        query = query.filter(Mission.expires_at > datetime.now(timezone.utc))
        
        missions = query.all()
        
        # Apply geospatial filtering if coordinates provided
        if lat is not None and lng is not None:
            filtered_missions = []
            for mission in missions:
                if mission.geofence:
                    mission_lat = mission.geofence.get("lat")
                    mission_lng = mission.geofence.get("lng")
                    if mission_lat and mission_lng:
                        distance = calculate_distance(lat, lng, mission_lat, mission_lng)
                        if distance <= radius_km:
                            # Add distance for sorting
                            mission.distance = distance
                            filtered_missions.append(mission)
            missions = filtered_missions
        
        # Sort missions
        if sort == "near" and hasattr(missions[0] if missions else None, 'distance'):
            missions.sort(key=lambda m: m.distance)
        elif sort == "urgent":
            missions.sort(key=lambda m: m.expires_at)
        elif sort == "pay":
            missions.sort(key=lambda m: m.budget_krw, reverse=True)
        
        # Apply limit
        missions = missions[:limit]
        
        return missions
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list missions: {str(e)}")

@router.post("/create", response_model=MissionResponse)
async def create_mission(
    mission_data: MissionCreate,
    db: Session = Depends(get_db)
):
    """Create a new mission"""
    try:
        # Validate geofence data
        if not mission_data.geofence or "lat" not in mission_data.geofence or "lng" not in mission_data.geofence:
            raise HTTPException(status_code=400, detail="Geofence must include lat and lng")
        
        # Create mission
        mission = Mission(
            merchant_name=mission_data.merchant_name,
            category=mission_data.category,
            budget_krw=mission_data.budget_krw,
            description=mission_data.description,
            requirements=mission_data.requirements,
            geofence=mission_data.geofence,
            address=mission_data.address,
            expires_at=mission_data.expires_at,
            status=MissionStatus.OPEN.value
        )
        
        db.add(mission)
        db.commit()
        db.refresh(mission)
        
        return mission
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create mission: {str(e)}")

@router.get("/{mission_id}", response_model=MissionResponse)
async def get_mission(
    mission_id: int,
    db: Session = Depends(get_db)
):
    """Get mission by ID"""
    mission = db.query(Mission).filter(Mission.id == mission_id).first()
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    
    return mission

@router.post("/assign")
async def assign_mission(
    mission_id: int,
    creator_id: int,
    db: Session = Depends(get_db)
):
    """Assign a mission to a creator (creates assignment)"""
    try:
        # Check if mission exists and is available
        mission = db.query(Mission).filter(Mission.id == mission_id).first()
        if not mission:
            raise HTTPException(status_code=404, detail="Mission not found")
        
        if mission.status != MissionStatus.OPEN.value:
            raise HTTPException(status_code=400, detail="Mission is not available for assignment")
        
        if mission.expires_at <= datetime.now(timezone.utc):
            raise HTTPException(status_code=400, detail="Mission has expired")
        
        # This will be handled by the assignments router
        # Return success for now
        return {
            "message": "Assignment request received",
            "mission_id": mission_id,
            "creator_id": creator_id,
            "next_step": "POST /v1/assignments/accept"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to assign mission: {str(e)}")

@router.get("/nearby")
async def get_nearby_missions(
    lat: float = Query(..., description="User latitude"),
    lng: float = Query(..., description="User longitude"),
    radius_km: float = Query(default=2.0, description="Search radius in km"),
    category: Optional[str] = Query(default=None, description="Category filter"),
    min_budget: Optional[int] = Query(default=None, description="Minimum budget filter"),
    db: Session = Depends(get_db)
):
    """Get missions near user location with filters"""
    try:
        query = db.query(Mission).filter(
            Mission.status == MissionStatus.OPEN.value,
            Mission.expires_at > datetime.now(timezone.utc)
        )
        
        if category:
            query = query.filter(Mission.category == category)
        
        if min_budget:
            query = query.filter(Mission.budget_krw >= min_budget)
        
        missions = query.all()
        
        # Filter by distance and add distance info
        nearby_missions = []
        for mission in missions:
            if mission.geofence:
                mission_lat = mission.geofence.get("lat")
                mission_lng = mission.geofence.get("lng")
                if mission_lat and mission_lng:
                    distance = calculate_distance(lat, lng, mission_lat, mission_lng)
                    if distance <= radius_km:
                        mission_dict = {
                            "id": mission.id,
                            "merchant_name": mission.merchant_name,
                            "category": mission.category,
                            "budget_krw": mission.budget_krw,
                            "description": mission.description,
                            "address": mission.address,
                            "expires_at": mission.expires_at,
                            "distance_km": round(distance, 2),
                            "geofence": mission.geofence
                        }
                        nearby_missions.append(mission_dict)
        
        # Sort by distance
        nearby_missions.sort(key=lambda m: m["distance_km"])
        
        return {
            "missions": nearby_missions,
            "total_count": len(nearby_missions),
            "search_radius_km": radius_km
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get nearby missions: {str(e)}")

@router.get("/categories")
async def get_mission_categories(db: Session = Depends(get_db)):
    """Get available mission categories"""
    try:
        categories = db.query(Mission.category).distinct().all()
        return [cat[0] for cat in categories if cat[0]]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get categories: {str(e)}")

@router.get("/stats")
async def get_mission_stats(db: Session = Depends(get_db)):
    """Get mission statistics"""
    try:
        total_missions = db.query(Mission).count()
        open_missions = db.query(Mission).filter(Mission.status == MissionStatus.OPEN.value).count()
        completed_missions = db.query(Mission).filter(Mission.status == MissionStatus.COMPLETED.value).count()
        
        # Calculate average budget
        avg_budget = db.query(func.avg(Mission.budget_krw)).scalar() or 0
        
        return {
            "total_missions": total_missions,
            "open_missions": open_missions,
            "completed_missions": completed_missions,
            "avg_budget_krw": round(avg_budget, 0),
            "completion_rate": round((completed_missions / total_missions * 100), 2) if total_missions > 0 else 0
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")