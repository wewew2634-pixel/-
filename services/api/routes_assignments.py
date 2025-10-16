"""
Assignments API Routes - State Machine Implementation
Handle assignment lifecycle: accept, cancel, expire, state transitions
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from datetime import datetime, timezone, timedelta
import os

from db import (
    get_db, Assignment, Mission, Creator, AssignmentState, MissionStatus,
    AssignmentCreate, AssignmentResponse, can_transition
)

router = APIRouter()

# Environment variables
ASSIGN_EXPIRE_MIN = int(os.getenv("ASSIGN_EXPIRE_MIN", "20"))  # 20 minutes default

@router.post("/accept")
async def accept_assignment(
    assignment_id: int,
    db: Session = Depends(get_db)
):
    """Accept an assignment and start the timer"""
    try:
        assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
        if not assignment:
            raise HTTPException(status_code=404, detail="Assignment not found")
        
        # Check if can transition from current state to ACCEPTED
        current_state = AssignmentState(assignment.state)
        if not can_transition(current_state, AssignmentState.ACCEPTED):
            raise HTTPException(
                status_code=400, 
                detail=f"Cannot accept assignment from state {current_state.value}"
            )
        
        # Check if assignment hasn't expired already
        if assignment.expires_at and assignment.expires_at <= datetime.now(timezone.utc):
            raise HTTPException(status_code=400, detail="Assignment has already expired")
        
        # Update assignment state
        assignment.state = AssignmentState.ACCEPTED.value
        assignment.accepted_at = datetime.now(timezone.utc)
        assignment.expires_at = assignment.accepted_at + timedelta(minutes=ASSIGN_EXPIRE_MIN)
        
        # Update mission status
        mission = db.query(Mission).filter(Mission.id == assignment.mission_id).first()
        if mission:
            mission.status = MissionStatus.ASSIGNED.value
        
        db.commit()
        db.refresh(assignment)
        
        return {
            "message": "Assignment accepted",
            "assignment_id": assignment.id,
            "state": assignment.state,
            "accepted_at": assignment.accepted_at,
            "expires_at": assignment.expires_at,
            "time_remaining_min": ASSIGN_EXPIRE_MIN
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to accept assignment: {str(e)}")

@router.post("/cancel")
async def cancel_assignment(
    assignment_id: int,
    reason: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Cancel an assignment"""
    try:
        assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
        if not assignment:
            raise HTTPException(status_code=404, detail="Assignment not found")
        
        # Check if can transition to CANCELED
        current_state = AssignmentState(assignment.state)
        if not can_transition(current_state, AssignmentState.CANCELED):
            raise HTTPException(
                status_code=400, 
                detail=f"Cannot cancel assignment from state {current_state.value}"
            )
        
        # Update assignment state
        assignment.state = AssignmentState.CANCELED.value
        assignment.canceled_at = datetime.now(timezone.utc)
        assignment.cancel_reason = reason or "User canceled"
        
        # Update mission status back to OPEN if no other active assignments
        other_active = db.query(Assignment).filter(
            Assignment.mission_id == assignment.mission_id,
            Assignment.id != assignment.id,
            Assignment.state.in_([
                AssignmentState.ACCEPTED.value,
                AssignmentState.CAPTURING.value,
                AssignmentState.SUBMITTED.value
            ])
        ).first()
        
        if not other_active:
            mission = db.query(Mission).filter(Mission.id == assignment.mission_id).first()
            if mission:
                mission.status = MissionStatus.OPEN.value
        
        db.commit()
        db.refresh(assignment)
        
        return {
            "message": "Assignment canceled",
            "assignment_id": assignment.id,
            "state": assignment.state,
            "canceled_at": assignment.canceled_at,
            "reason": assignment.cancel_reason
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to cancel assignment: {str(e)}")

@router.post("/expire")
async def expire_assignments(db: Session = Depends(get_db)):
    """Expire assignments that have passed their deadline"""
    try:
        now = datetime.now(timezone.utc)
        
        # Find expired assignments
        expired_assignments = db.query(Assignment).filter(
            Assignment.expires_at <= now,
            Assignment.state.in_([
                AssignmentState.ACCEPTED.value,
                AssignmentState.CAPTURING.value
            ])
        ).all()
        
        expired_count = 0
        for assignment in expired_assignments:
            if can_transition(AssignmentState(assignment.state), AssignmentState.EXPIRED):
                assignment.state = AssignmentState.EXPIRED.value
                assignment.expired_at = now
                assignment.expire_reason = "Time limit exceeded"
                
                # Update mission status back to OPEN
                mission = db.query(Mission).filter(Mission.id == assignment.mission_id).first()
                if mission:
                    mission.status = MissionStatus.OPEN.value
                
                expired_count += 1
        
        if expired_count > 0:
            db.commit()
        
        return {
            "message": f"Expired {expired_count} assignments",
            "expired_count": expired_count,
            "checked_at": now
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to expire assignments: {str(e)}")

@router.get("/{assignment_id}", response_model=AssignmentResponse)
async def get_assignment(
    assignment_id: int,
    db: Session = Depends(get_db)
):
    """Get assignment by ID"""
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    return assignment

@router.post("/start_capture")
async def start_capture(
    assignment_id: int,
    location: Optional[dict] = None,
    db: Session = Depends(get_db)
):
    """Start capturing content for assignment"""
    try:
        assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
        if not assignment:
            raise HTTPException(status_code=404, detail="Assignment not found")
        
        # Check if can transition to CAPTURING
        current_state = AssignmentState(assignment.state)
        if not can_transition(current_state, AssignmentState.CAPTURING):
            raise HTTPException(
                status_code=400, 
                detail=f"Cannot start capture from state {current_state.value}"
            )
        
        # Update assignment state
        assignment.state = AssignmentState.CAPTURING.value
        if location:
            assignment.actual_location = location
        
        db.commit()
        db.refresh(assignment)
        
        return {
            "message": "Capture started",
            "assignment_id": assignment.id,
            "state": assignment.state,
            "location_recorded": bool(location)
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to start capture: {str(e)}")

@router.post("/submit")
async def submit_assignment(
    assignment_id: int,
    db: Session = Depends(get_db)
):
    """Submit assignment for proof QA"""
    try:
        assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
        if not assignment:
            raise HTTPException(status_code=404, detail="Assignment not found")
        
        # Check if can transition to SUBMITTED
        current_state = AssignmentState(assignment.state)
        if not can_transition(current_state, AssignmentState.SUBMITTED):
            raise HTTPException(
                status_code=400, 
                detail=f"Cannot submit assignment from state {current_state.value}"
            )
        
        # Update assignment state
        assignment.state = AssignmentState.SUBMITTED.value
        assignment.submitted_at = datetime.now(timezone.utc)
        
        db.commit()
        db.refresh(assignment)
        
        return {
            "message": "Assignment submitted for QA",
            "assignment_id": assignment.id,
            "state": assignment.state,
            "submitted_at": assignment.submitted_at,
            "next_step": "Waiting for Proof-QA results"
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to submit assignment: {str(e)}")

@router.get("/creator/{creator_id}")
async def get_creator_assignments(
    creator_id: int,
    status: Optional[str] = None,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Get assignments for a specific creator"""
    try:
        query = db.query(Assignment).filter(Assignment.creator_id == creator_id)
        
        if status:
            query = query.filter(Assignment.state == status)
        
        assignments = query.order_by(Assignment.created_at.desc()).limit(limit).all()
        
        # Include mission details
        result = []
        for assignment in assignments:
            mission = db.query(Mission).filter(Mission.id == assignment.mission_id).first()
            assignment_data = {
                "id": assignment.id,
                "state": assignment.state,
                "accepted_at": assignment.accepted_at,
                "expires_at": assignment.expires_at,
                "submitted_at": assignment.submitted_at,
                "created_at": assignment.created_at,
                "mission": {
                    "id": mission.id if mission else None,
                    "merchant_name": mission.merchant_name if mission else None,
                    "budget_krw": mission.budget_krw if mission else None,
                    "category": mission.category if mission else None,
                    "address": mission.address if mission else None
                } if mission else None
            }
            result.append(assignment_data)
        
        return {
            "assignments": result,
            "total_count": len(result),
            "creator_id": creator_id
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get creator assignments: {str(e)}")

@router.get("/active")
async def get_active_assignments(
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Get all active assignments (not terminal states)"""
    try:
        active_states = [
            AssignmentState.ASSIGNED.value,
            AssignmentState.ACCEPTED.value,
            AssignmentState.CAPTURING.value,
            AssignmentState.SUBMITTED.value,
            AssignmentState.PROOF_REWORK.value
        ]
        
        assignments = db.query(Assignment).filter(
            Assignment.state.in_(active_states)
        ).order_by(Assignment.created_at.desc()).limit(limit).all()
        
        return {
            "assignments": assignments,
            "total_count": len(assignments),
            "active_states": active_states
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get active assignments: {str(e)}")

@router.post("/create", response_model=AssignmentResponse)
async def create_assignment(
    assignment_data: AssignmentCreate,
    db: Session = Depends(get_db)
):
    """Create a new assignment"""
    try:
        # Validate mission exists and is available
        mission = db.query(Mission).filter(Mission.id == assignment_data.mission_id).first()
        if not mission:
            raise HTTPException(status_code=404, detail="Mission not found")
        
        if mission.status != MissionStatus.OPEN.value:
            raise HTTPException(status_code=400, detail="Mission is not available")
        
        # Validate creator exists
        creator = db.query(Creator).filter(Creator.id == assignment_data.creator_id).first()
        if not creator:
            raise HTTPException(status_code=404, detail="Creator not found")
        
        # Check for existing assignment
        existing = db.query(Assignment).filter(
            Assignment.mission_id == assignment_data.mission_id,
            Assignment.creator_id == assignment_data.creator_id
        ).first()
        
        if existing:
            raise HTTPException(status_code=400, detail="Assignment already exists for this mission and creator")
        
        # Create assignment
        assignment = Assignment(
            mission_id=assignment_data.mission_id,
            creator_id=assignment_data.creator_id,
            state=AssignmentState.ASSIGNED.value
        )
        
        db.add(assignment)
        db.commit()
        db.refresh(assignment)
        
        return assignment
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create assignment: {str(e)}")