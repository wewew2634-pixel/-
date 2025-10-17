"""
Payout API Routes - T+0/T+1 Payment Processing
Handle idempotent payments with retry logic and failure recovery
"""

from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import and_, desc
from typing import List, Optional
from datetime import datetime, timezone, timedelta
import uuid
import logging

from db import (
    get_db, Payment, Assignment, Creator, AssignmentState, PaymentStatus,
    PaymentCreate, PaymentResponse, generate_idempotency_key, can_transition
)

router = APIRouter()
logger = logging.getLogger(__name__)

def simulate_payment_processing(amount_krw: int, payment_method: str = "wallet") -> dict:
    """
    Simulate payment processing (T+0 attempt)
    In production, this would integrate with actual payment providers
    """
    try:
        # Simulate different success rates based on amount
        if amount_krw <= 50000:  # Small amounts - high T+0 success rate
            success_rate = 0.85
        elif amount_krw <= 100000:  # Medium amounts - moderate T+0 success rate
            success_rate = 0.70
        else:  # Large amounts - lower T+0 success rate, usually go to T+1
            success_rate = 0.45
        
        # Simulate processing
        import random
        is_success = random.random() < success_rate
        
        if is_success:
            return {
                "success": True,
                "transaction_id": f"TX_{uuid.uuid4().hex[:12].upper()}",
                "processing_time_ms": random.randint(800, 2500),
                "method": "instant_wallet"
            }
        else:
            return {
                "success": False,
                "error_code": "T0_PROCESSING_FAILED",
                "error_message": "Instant payment unavailable, will schedule T+1",
                "retry_t1": True
            }
    
    except Exception as e:
        return {
            "success": False,
            "error_code": "PAYMENT_ERROR",
            "error_message": str(e),
            "retry_t1": True
        }

@router.post("/pay")
async def process_payment(
    assignment_id: int,
    x_idempotency_key: str = Header(..., description="Unique idempotency key to prevent duplicate payments"),
    db: Session = Depends(get_db)
):
    """
    Process payment for completed assignment (idempotent with T+0/T+1 logic)
    """
    try:
        # Check for existing payment with same idempotency key
        existing_payment = db.query(Payment).filter(
            Payment.idempotency_key == x_idempotency_key
        ).first()
        
        if existing_payment:
            # Return existing payment result (idempotent behavior)
            return {
                "message": "Payment already processed",
                "payment_id": existing_payment.id,
                "status": existing_payment.status,
                "amount_krw": existing_payment.amount_krw,
                "t0_success": existing_payment.t0_success,
                "created_at": existing_payment.created_at,
                "idempotency_key": existing_payment.idempotency_key
            }
        
        # Get assignment and validate state
        assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
        if not assignment:
            raise HTTPException(status_code=404, detail="Assignment not found")
        
        if assignment.state != AssignmentState.PROOF_PASS.value:
            raise HTTPException(
                status_code=400, 
                detail=f"Assignment must be in PROOF_PASS state for payment (current: {assignment.state})"
            )
        
        # Get mission budget
        mission = assignment.mission
        if not mission:
            raise HTTPException(status_code=400, detail="Mission not found")
        
        payment_amount = mission.budget_krw
        
        # Create payment record
        payment = Payment(
            assignment_id=assignment_id,
            amount_krw=payment_amount,
            idempotency_key=x_idempotency_key,
            status=PaymentStatus.PENDING.value
        )
        
        db.add(payment)
        db.commit()  # Commit to get payment ID before processing
        db.refresh(payment)
        
        # Attempt T+0 payment
        payment.t0_attempted = True
        t0_result = simulate_payment_processing(payment_amount)
        
        if t0_result.get("success", False):
            # T+0 Success
            payment.status = PaymentStatus.T0_SUCCESS.value
            payment.t0_success = True
            payment.external_transaction_id = t0_result.get("transaction_id")
            
            # Update assignment state to PAID
            if can_transition(AssignmentState(assignment.state), AssignmentState.PAID):
                assignment.state = AssignmentState.PAID.value
                assignment.completed_at = datetime.now(timezone.utc)
            
            # Update mission status if needed
            mission.status = "completed"  # Assuming single assignment per mission for now
            
            # Update creator stats
            creator = assignment.creator
            if creator:
                creator.total_earnings_krw += payment_amount
                creator.total_missions += 1
                # Recalculate success rate would go here
            
            result = {
                "message": "Payment processed successfully (T+0)",
                "payment_id": payment.id,
                "status": payment.status,
                "amount_krw": payment.amount_krw,
                "t0_success": True,
                "transaction_id": payment.external_transaction_id,
                "assignment_state": assignment.state,
                "processing_time": "instant"
            }
        
        else:
            # T+0 Failed - Schedule T+1
            payment.status = PaymentStatus.T1_SCHEDULED.value
            payment.t0_success = False
            payment.t1_scheduled_at = datetime.now(timezone.utc) + timedelta(days=1)
            payment.error_message = t0_result.get("error_message", "T+0 processing failed")
            
            # Update assignment state to T1_SCHEDULED
            if can_transition(AssignmentState(assignment.state), AssignmentState.T1_SCHEDULED):
                assignment.state = AssignmentState.T1_SCHEDULED.value
            
            result = {
                "message": "Payment scheduled for T+1 processing",
                "payment_id": payment.id,
                "status": payment.status,
                "amount_krw": payment.amount_krw,
                "t0_success": False,
                "t1_scheduled_at": payment.t1_scheduled_at,
                "assignment_state": assignment.state,
                "reason": payment.error_message
            }
        
        db.commit()
        
        return result
    
    except Exception as e:
        db.rollback()
        logger.error(f"Payment processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Payment processing failed: {str(e)}")

@router.post("/diagnose")
async def diagnose_payments(
    status: Optional[str] = None,
    hours_back: int = 24,
    db: Session = Depends(get_db)
):
    """
    Diagnose payment issues and retry failed payments
    """
    try:
        # Calculate time threshold
        time_threshold = datetime.now(timezone.utc) - timedelta(hours=hours_back)
        
        # Query payments based on criteria
        query = db.query(Payment).filter(Payment.created_at >= time_threshold)
        
        if status:
            query = query.filter(Payment.status == status)
        
        payments = query.order_by(desc(Payment.created_at)).all()
        
        diagnosis = {
            "summary": {
                "total_payments": len(payments),
                "by_status": {},
                "t0_success_rate": 0.0,
                "failed_payments": 0,
                "retry_candidates": []
            },
            "payments": []
        }
        
        # Analyze payments
        status_counts = {}
        t0_successes = 0
        total_with_t0_attempt = 0
        
        for payment in payments:
            # Count by status
            status_counts[payment.status] = status_counts.get(payment.status, 0) + 1
            
            # T+0 success rate calculation
            if payment.t0_attempted:
                total_with_t0_attempt += 1
                if payment.t0_success:
                    t0_successes += 1
            
            # Check for retry candidates
            if (payment.status == PaymentStatus.FAILED.value and 
                payment.retry_count < payment.max_retries):
                diagnosis["summary"]["retry_candidates"].append({
                    "payment_id": payment.id,
                    "assignment_id": payment.assignment_id,
                    "amount_krw": payment.amount_krw,
                    "retry_count": payment.retry_count,
                    "last_error": payment.error_message
                })
            
            # Add payment details
            diagnosis["payments"].append({
                "id": payment.id,
                "assignment_id": payment.assignment_id,
                "amount_krw": payment.amount_krw,
                "status": payment.status,
                "t0_success": payment.t0_success,
                "created_at": payment.created_at,
                "error_message": payment.error_message
            })
        
        # Calculate metrics
        diagnosis["summary"]["by_status"] = status_counts
        diagnosis["summary"]["failed_payments"] = status_counts.get(PaymentStatus.FAILED.value, 0)
        
        if total_with_t0_attempt > 0:
            diagnosis["summary"]["t0_success_rate"] = round(
                (t0_successes / total_with_t0_attempt) * 100, 2
            )
        
        return diagnosis
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Payment diagnosis failed: {str(e)}")

@router.get("/recent")
async def get_recent_payments(
    creator_id: Optional[int] = None,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    Get recent payment history (for wallet UI)
    """
    try:
        query = db.query(Payment)
        
        if creator_id:
            # Join with assignments to filter by creator
            query = query.join(Assignment).filter(Assignment.creator_id == creator_id)
        
        payments = query.order_by(desc(Payment.created_at)).limit(limit).all()
        
        # Format for wallet UI
        payment_history = []
        for payment in payments:
            assignment = payment.assignment
            mission = assignment.mission if assignment else None
            
            payment_info = {
                "id": payment.id,
                "amount_krw": payment.amount_krw,
                "status": payment.status,
                "t0_success": payment.t0_success,
                "created_at": payment.created_at,
                "mission_info": {
                    "merchant_name": mission.merchant_name if mission else "Unknown",
                    "category": mission.category if mission else "Unknown"
                } if mission else None,
                "transaction_id": payment.external_transaction_id,
                "processing_type": "Instant" if payment.t0_success else "Next Day"
            }
            payment_history.append(payment_info)
        
        # Calculate totals for wallet summary
        total_earned = sum(p.amount_krw for p in payments if p.status in [
            PaymentStatus.T0_SUCCESS.value, PaymentStatus.COMPLETED.value
        ])
        
        pending_amount = sum(p.amount_krw for p in payments if p.status in [
            PaymentStatus.T1_SCHEDULED.value, PaymentStatus.PENDING.value
        ])
        
        return {
            "payments": payment_history,
            "summary": {
                "total_earned_krw": total_earned,
                "pending_amount_krw": pending_amount,
                "payment_count": len(payment_history),
                "instant_payment_rate": round(
                    (sum(1 for p in payments if p.t0_success) / len(payments) * 100), 2
                ) if payments else 0
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get recent payments: {str(e)}")

@router.post("/retry/{payment_id}")
async def retry_payment(
    payment_id: int,
    db: Session = Depends(get_db)
):
    """
    Retry a failed payment
    """
    try:
        payment = db.query(Payment).filter(Payment.id == payment_id).first()
        if not payment:
            raise HTTPException(status_code=404, detail="Payment not found")
        
        if payment.status not in [PaymentStatus.FAILED.value, PaymentStatus.T1_SCHEDULED.value]:
            raise HTTPException(
                status_code=400, 
                detail=f"Cannot retry payment in status: {payment.status}"
            )
        
        if payment.retry_count >= payment.max_retries:
            raise HTTPException(
                status_code=400, 
                detail=f"Max retries ({payment.max_retries}) exceeded"
            )
        
        # Increment retry count
        payment.retry_count += 1
        
        # Attempt payment again
        retry_result = simulate_payment_processing(payment.amount_krw)
        
        if retry_result.get("success", False):
            payment.status = PaymentStatus.COMPLETED.value
            payment.external_transaction_id = retry_result.get("transaction_id")
            payment.error_message = None
            
            # Update assignment state
            assignment = payment.assignment
            if assignment and can_transition(AssignmentState(assignment.state), AssignmentState.PAID):
                assignment.state = AssignmentState.PAID.value
                assignment.completed_at = datetime.now(timezone.utc)
            
            result_message = "Payment retry successful"
        else:
            if payment.retry_count >= payment.max_retries:
                payment.status = PaymentStatus.FAILED.value
                result_message = "Payment retry failed - max retries exceeded"
            else:
                payment.status = PaymentStatus.FAILED.value
                result_message = f"Payment retry failed - {payment.max_retries - payment.retry_count} retries remaining"
            
            payment.error_message = retry_result.get("error_message", "Retry failed")
        
        db.commit()
        db.refresh(payment)
        
        return {
            "message": result_message,
            "payment_id": payment.id,
            "status": payment.status,
            "retry_count": payment.retry_count,
            "max_retries": payment.max_retries
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Payment retry failed: {str(e)}")

@router.get("/status/{assignment_id}")
async def get_payment_status(
    assignment_id: int,
    db: Session = Depends(get_db)
):
    """
    Get payment status for an assignment (for wallet status bar)
    """
    try:
        payment = db.query(Payment).filter(Payment.assignment_id == assignment_id).first()
        
        if not payment:
            return {
                "assignment_id": assignment_id,
                "payment_status": "no_payment",
                "message": "No payment record found"
            }
        
        assignment = payment.assignment
        
        # Determine user-friendly status
        if payment.t0_success:
            status_display = "paid_instantly"
            status_message = "Payment completed instantly"
        elif payment.status == PaymentStatus.T1_SCHEDULED.value:
            status_display = "scheduled_next_day"
            status_message = f"Payment scheduled for {payment.t1_scheduled_at.strftime('%Y-%m-%d')}"
        elif payment.status == PaymentStatus.COMPLETED.value:
            status_display = "paid_completed"
            status_message = "Payment completed"
        elif payment.status == PaymentStatus.FAILED.value:
            status_display = "payment_failed"
            status_message = f"Payment failed: {payment.error_message}"
        else:
            status_display = "processing"
            status_message = "Payment processing..."
        
        return {
            "assignment_id": assignment_id,
            "payment_id": payment.id,
            "amount_krw": payment.amount_krw,
            "payment_status": status_display,
            "status_message": status_message,
            "t0_success": payment.t0_success,
            "created_at": payment.created_at,
            "assignment_state": assignment.state if assignment else None
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get payment status: {str(e)}")

@router.get("/wallet_summary/{creator_id}")
async def get_wallet_summary(
    creator_id: int,
    db: Session = Depends(get_db)
):
    """
    Get wallet summary for creator (T+0/T+1 status bar data)
    """
    try:
        # Get all payments for creator
        payments = db.query(Payment).join(Assignment).filter(
            Assignment.creator_id == creator_id
        ).all()
        
        # Calculate wallet metrics
        total_earned = sum(p.amount_krw for p in payments if p.status in [
            PaymentStatus.T0_SUCCESS.value, PaymentStatus.COMPLETED.value
        ])
        
        pending_t1 = sum(p.amount_krw for p in payments if p.status == PaymentStatus.T1_SCHEDULED.value)
        
        failed_amount = sum(p.amount_krw for p in payments if p.status == PaymentStatus.FAILED.value)
        
        # Recent activity
        recent_payments = sorted(payments, key=lambda p: p.created_at, reverse=True)[:5]
        
        # T+0 success rate
        t0_attempts = [p for p in payments if p.t0_attempted]
        t0_success_rate = (
            sum(1 for p in t0_attempts if p.t0_success) / len(t0_attempts) * 100
        ) if t0_attempts else 0
        
        return {
            "creator_id": creator_id,
            "wallet_balance": {
                "total_earned_krw": total_earned,
                "pending_t1_krw": pending_t1,
                "failed_amount_krw": failed_amount,
                "available_balance_krw": total_earned  # Simplified - would subtract pending withdrawals
            },
            "payment_stats": {
                "total_payments": len(payments),
                "t0_success_rate": round(t0_success_rate, 1),
                "avg_payment_krw": round(total_earned / len(payments), 0) if payments else 0
            },
            "recent_activity": [
                {
                    "amount_krw": p.amount_krw,
                    "status": "instant" if p.t0_success else "next_day",
                    "date": p.created_at.strftime("%m/%d")
                }
                for p in recent_payments
            ]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get wallet summary: {str(e)}")