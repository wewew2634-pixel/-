"""
JJIKMEOK Database Models with State Machine
SQLite-based OLTP with PostgreSQL compatibility
"""

from datetime import datetime, timezone
from enum import Enum
from typing import Optional, List
import json

from sqlalchemy import (
    create_engine, Column, Integer, String, Float, DateTime, Boolean, 
    Text, JSON, ForeignKey, Index, UniqueConstraint
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from pydantic import BaseModel, Field
import uuid

# Database setup
DATABASE_URL = "sqlite:///./jjikmeok.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Enums for state machine
class AssignmentState(str, Enum):
    ASSIGNED = "assigned"
    ACCEPTED = "accepted"
    CAPTURING = "capturing"
    SUBMITTED = "submitted"
    PROOF_PASS = "proof_pass"
    PROOF_REWORK = "proof_rework"
    PAID = "paid"
    T1_SCHEDULED = "t1_scheduled"
    CANCELED = "canceled"
    EXPIRED = "expired"

class MissionStatus(str, Enum):
    OPEN = "open"
    ASSIGNED = "assigned"
    COMPLETED = "completed"
    CANCELED = "canceled"
    EXPIRED = "expired"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    T0_SUCCESS = "t0_success"
    T1_SCHEDULED = "t1_scheduled"
    COMPLETED = "completed"
    FAILED = "failed"

class ProofDecision(str, Enum):
    PENDING = "pending"
    PASS = "pass"
    REWORK = "rework"
    REJECT = "reject"

# Database Models
class Mission(Base):
    __tablename__ = "missions"
    
    id = Column(Integer, primary_key=True, index=True)
    merchant_name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)
    budget_krw = Column(Integer, nullable=False)  # 예산 (원)
    description = Column(Text)
    requirements = Column(JSON)  # 미션 요구사항
    
    # Geofence data
    geofence = Column(JSON)  # {"lat": 37.5, "lng": 127.0, "radius_km": 1.0}
    address = Column(String(200))
    
    # Timing
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    
    # Status
    status = Column(String(20), nullable=False, default=MissionStatus.OPEN.value)
    
    # Relationships
    assignments = relationship("Assignment", back_populates="mission")
    
    __table_args__ = (
        Index('idx_mission_status_expires', 'status', 'expires_at'),
        Index('idx_mission_geo', 'status'),  # For geospatial queries
    )

class Creator(Base):
    __tablename__ = "creators"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(20))
    
    # Profile
    profile_url = Column(String(500))
    bio = Column(Text)
    location = Column(JSON)  # Current location cache
    
    # Stats
    total_missions = Column(Integer, default=0)
    success_rate = Column(Float, default=0.0)
    total_earnings_krw = Column(Integer, default=0)
    
    # Status
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    
    # Relationships
    assignments = relationship("Assignment", back_populates="creator")
    contents = relationship("Content", back_populates="creator")

class Assignment(Base):
    __tablename__ = "assignments"
    
    id = Column(Integer, primary_key=True, index=True)
    mission_id = Column(Integer, ForeignKey("missions.id"), nullable=False)
    creator_id = Column(Integer, ForeignKey("creators.id"), nullable=False)
    
    # State Machine Core
    state = Column(String(20), nullable=False, default=AssignmentState.ASSIGNED.value)
    
    # Timing for state transitions
    assigned_at = Column(DateTime(timezone=True), default=datetime.now(timezone.utc))
    accepted_at = Column(DateTime(timezone=True))
    expires_at = Column(DateTime(timezone=True))  # Dynamic based on accepted_at + ASSIGN_EXPIRE_MIN
    submitted_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    
    # Cancellation/Expiration
    canceled_at = Column(DateTime(timezone=True))
    expired_at = Column(DateTime(timezone=True))
    cancel_reason = Column(String(200))
    expire_reason = Column(String(200))
    
    # Assignment data
    estimated_duration_min = Column(Integer, default=20)
    actual_location = Column(JSON)  # Where creator actually performed
    
    created_at = Column(DateTime(timezone=True), default=datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    
    # Relationships
    mission = relationship("Mission", back_populates="assignments")
    creator = relationship("Creator", back_populates="assignments")
    proofs = relationship("Proof", back_populates="assignment")
    payments = relationship("Payment", back_populates="assignment")
    
    __table_args__ = (
        Index('idx_assignment_state_expires', 'state', 'expires_at'),
        Index('idx_assignment_creator_state', 'creator_id', 'state'),
        UniqueConstraint('mission_id', 'creator_id', name='uix_mission_creator'),
    )

class Proof(Base):
    __tablename__ = "proofs"
    
    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"), nullable=False)
    
    # Media files
    video_url = Column(String(500), nullable=False)
    thumbnail_url = Column(String(500))
    
    # QA Results
    qa_json = Column(JSON)  # Detailed QA results
    final_decision = Column(String(20), nullable=False, default=ProofDecision.PENDING.value)
    
    # Manual review
    reviewer_notes = Column(Text)
    review_score = Column(Float)  # 0.0-1.0
    
    # Metadata
    file_size_mb = Column(Float)
    duration_sec = Column(Float)
    resolution = Column(String(20))  # e.g., "1920x1080"
    
    created_at = Column(DateTime(timezone=True), default=datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    
    # Relationships
    assignment = relationship("Assignment", back_populates="proofs")
    
    __table_args__ = (
        Index('idx_proof_assignment_decision', 'assignment_id', 'final_decision'),
    )

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"), nullable=False)
    
    # Payment details
    amount_krw = Column(Integer, nullable=False)
    currency = Column(String(3), default="KRW")
    
    # Idempotency & Status
    idempotency_key = Column(String(100), unique=True, nullable=False)
    status = Column(String(20), nullable=False, default=PaymentStatus.PENDING.value)
    
    # T+0/T+1 flags
    t0_attempted = Column(Boolean, default=False)
    t0_success = Column(Boolean, default=False)
    t1_scheduled_at = Column(DateTime(timezone=True))
    
    # External references
    external_transaction_id = Column(String(100))
    payment_method = Column(String(50), default="wallet")
    
    # Error handling
    error_message = Column(Text)
    retry_count = Column(Integer, default=0)
    max_retries = Column(Integer, default=3)
    
    created_at = Column(DateTime(timezone=True), default=datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    
    # Relationships
    assignment = relationship("Assignment", back_populates="payments")
    
    __table_args__ = (
        Index('idx_payment_status_created', 'status', 'created_at'),
        Index('idx_payment_idempotency', 'idempotency_key'),
    )

class Content(Base):
    __tablename__ = "contents"
    
    id = Column(Integer, primary_key=True, index=True)
    creator_id = Column(Integer, ForeignKey("creators.id"), nullable=False)
    
    # Content data
    media_url = Column(String(500), nullable=False)
    media_type = Column(String(20), default="video")  # video, image
    caption = Column(Text)
    hashtags = Column(JSON)  # List of hashtags
    
    # Engagement
    likes_count = Column(Integer, default=0)
    views_count = Column(Integer, default=0)
    shares_count = Column(Integer, default=0)
    
    # Moderation
    is_published = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    moderation_status = Column(String(20), default="pending")
    
    created_at = Column(DateTime(timezone=True), default=datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    
    # Relationships
    creator = relationship("Creator", back_populates="contents")
    
    __table_args__ = (
        Index('idx_content_creator_published', 'creator_id', 'is_published'),
        Index('idx_content_featured_created', 'is_featured', 'created_at'),
    )

class Pulse(Base):
    """Daily metrics for monitoring"""
    __tablename__ = "pulse_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime(timezone=True), nullable=False)
    
    # Core metrics
    missions_created = Column(Integer, default=0)
    assignments_created = Column(Integer, default=0)
    assignments_completed = Column(Integer, default=0)
    proofs_submitted = Column(Integer, default=0)
    proofs_passed = Column(Integer, default=0)
    payments_completed = Column(Integer, default=0)
    
    # Financial
    total_budget_krw = Column(Integer, default=0)
    total_paid_krw = Column(Integer, default=0)
    
    # Quality
    avg_qa_score = Column(Float, default=0.0)
    success_rate = Column(Float, default=0.0)
    
    # Performance
    avg_upload_time_sec = Column(Float, default=0.0)
    avg_qa_time_sec = Column(Float, default=0.0)
    
    created_at = Column(DateTime(timezone=True), default=datetime.now(timezone.utc))
    
    __table_args__ = (
        Index('idx_pulse_date', 'date'),
        UniqueConstraint('date', name='uix_pulse_date'),
    )

# Pydantic schemas for API
class MissionCreate(BaseModel):
    merchant_name: str = Field(..., max_length=100)
    category: str = Field(..., max_length=50)
    budget_krw: int = Field(..., gt=0)
    description: Optional[str] = None
    requirements: Optional[dict] = None
    geofence: dict  # {"lat": float, "lng": float, "radius_km": float}
    address: Optional[str] = None
    expires_at: datetime

class MissionResponse(BaseModel):
    id: int
    merchant_name: str
    category: str
    budget_krw: int
    description: Optional[str]
    geofence: dict
    address: Optional[str]
    status: str
    expires_at: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True

class AssignmentCreate(BaseModel):
    mission_id: int
    creator_id: int

class AssignmentResponse(BaseModel):
    id: int
    mission_id: int
    creator_id: int
    state: str
    assigned_at: datetime
    accepted_at: Optional[datetime]
    expires_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class ProofCreate(BaseModel):
    assignment_id: int
    video_url: str
    thumbnail_url: Optional[str] = None
    file_size_mb: Optional[float] = None
    duration_sec: Optional[float] = None
    resolution: Optional[str] = None

class ProofResponse(BaseModel):
    id: int
    assignment_id: int
    video_url: str
    qa_json: Optional[dict]
    final_decision: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class PaymentCreate(BaseModel):
    assignment_id: int
    amount_krw: int
    idempotency_key: str = Field(..., min_length=1, max_length=100)

class PaymentResponse(BaseModel):
    id: int
    assignment_id: int
    amount_krw: int
    status: str
    t0_success: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Database utility functions
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)

def generate_idempotency_key() -> str:
    """Generate a unique idempotency key"""
    return str(uuid.uuid4())

# State machine transitions
VALID_STATE_TRANSITIONS = {
    AssignmentState.ASSIGNED: [AssignmentState.ACCEPTED, AssignmentState.CANCELED, AssignmentState.EXPIRED],
    AssignmentState.ACCEPTED: [AssignmentState.CAPTURING, AssignmentState.CANCELED, AssignmentState.EXPIRED],
    AssignmentState.CAPTURING: [AssignmentState.SUBMITTED, AssignmentState.CANCELED],
    AssignmentState.SUBMITTED: [AssignmentState.PROOF_PASS, AssignmentState.PROOF_REWORK],
    AssignmentState.PROOF_PASS: [AssignmentState.PAID, AssignmentState.T1_SCHEDULED],
    AssignmentState.PROOF_REWORK: [AssignmentState.CAPTURING, AssignmentState.CANCELED],
    AssignmentState.PAID: [],  # Terminal state
    AssignmentState.T1_SCHEDULED: [AssignmentState.PAID],
    AssignmentState.CANCELED: [],  # Terminal state
    AssignmentState.EXPIRED: [],  # Terminal state
}

def can_transition(from_state: AssignmentState, to_state: AssignmentState) -> bool:
    """Check if state transition is valid"""
    return to_state in VALID_STATE_TRANSITIONS.get(from_state, [])