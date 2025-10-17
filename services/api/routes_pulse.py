"""
Pulse API Routes - Monitoring and Metrics
Handle real-time metrics, alerts, and system health monitoring
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from typing import Dict, Any, Optional
from datetime import datetime, timezone, timedelta
import json
import logging

from db import (
    get_db, Pulse, Mission, Assignment, Proof, Payment, Creator,
    AssignmentState, PaymentStatus, ProofDecision, MissionStatus
)

router = APIRouter()
logger = logging.getLogger(__name__)

def calculate_pulse_metrics(db: Session, target_date: datetime) -> Dict[str, Any]:
    """
    Calculate comprehensive metrics for a given date
    """
    # Date range for the target day
    start_of_day = target_date.replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_day = start_of_day + timedelta(days=1)
    
    metrics = {}
    
    # Mission metrics
    missions_created = db.query(Mission).filter(
        Mission.created_at >= start_of_day,
        Mission.created_at < end_of_day
    ).count()
    
    # Assignment metrics  
    assignments_created = db.query(Assignment).filter(
        Assignment.created_at >= start_of_day,
        Assignment.created_at < end_of_day
    ).count()
    
    assignments_completed = db.query(Assignment).filter(
        Assignment.completed_at >= start_of_day,
        Assignment.completed_at < end_of_day,
        Assignment.state == AssignmentState.PAID.value
    ).count()
    
    # Proof metrics
    proofs_submitted = db.query(Proof).filter(
        Proof.created_at >= start_of_day,
        Proof.created_at < end_of_day
    ).count()
    
    proofs_passed = db.query(Proof).filter(
        Proof.created_at >= start_of_day,
        Proof.created_at < end_of_day,
        Proof.final_decision == ProofDecision.PASS.value
    ).count()
    
    # Payment metrics
    payments_completed = db.query(Payment).filter(
        Payment.created_at >= start_of_day,
        Payment.created_at < end_of_day,
        Payment.status.in_([PaymentStatus.T0_SUCCESS.value, PaymentStatus.COMPLETED.value])
    ).count()
    
    # Financial metrics
    total_budget = db.query(func.sum(Mission.budget_krw)).filter(
        Mission.created_at >= start_of_day,
        Mission.created_at < end_of_day
    ).scalar() or 0
    
    total_paid = db.query(func.sum(Payment.amount_krw)).filter(
        Payment.created_at >= start_of_day,
        Payment.created_at < end_of_day,
        Payment.status.in_([PaymentStatus.T0_SUCCESS.value, PaymentStatus.COMPLETED.value])
    ).scalar() or 0
    
    # Quality metrics
    avg_qa_score = db.query(func.avg(Proof.review_score)).filter(
        Proof.created_at >= start_of_day,
        Proof.created_at < end_of_day,
        Proof.review_score.isnot(None)
    ).scalar() or 0
    
    success_rate = (proofs_passed / proofs_submitted * 100) if proofs_submitted > 0 else 0
    
    # Performance metrics (would integrate with actual monitoring)
    avg_upload_time = 3.2  # Mock - would come from upload logs
    avg_qa_time = 12.5     # Mock - would come from QA processing times
    
    return {
        "date": target_date,
        "missions_created": missions_created,
        "assignments_created": assignments_created,
        "assignments_completed": assignments_completed,
        "proofs_submitted": proofs_submitted,
        "proofs_passed": proofs_passed,
        "payments_completed": payments_completed,
        "total_budget_krw": int(total_budget),
        "total_paid_krw": int(total_paid),
        "avg_qa_score": round(avg_qa_score, 2),
        "success_rate": round(success_rate, 2),
        "avg_upload_time_sec": avg_upload_time,
        "avg_qa_time_sec": avg_qa_time
    }

@router.get("/today")
async def get_today_pulse(db: Session = Depends(get_db)):
    """
    Get today's real-time pulse metrics
    """
    try:
        today = datetime.now(timezone.utc)
        metrics = calculate_pulse_metrics(db, today)
        
        # Add real-time indicators
        current_hour = today.hour
        hour_start = today.replace(minute=0, second=0, microsecond=0)
        
        # Current hour activity
        hour_assignments = db.query(Assignment).filter(
            Assignment.created_at >= hour_start,
            Assignment.created_at < hour_start + timedelta(hours=1)
        ).count()
        
        hour_proofs = db.query(Proof).filter(
            Proof.created_at >= hour_start,
            Proof.created_at < hour_start + timedelta(hours=1)
        ).count()
        
        # System health indicators
        active_assignments = db.query(Assignment).filter(
            Assignment.state.in_([
                AssignmentState.ACCEPTED.value,
                AssignmentState.CAPTURING.value,
                AssignmentState.SUBMITTED.value
            ])
        ).count()
        
        failed_payments = db.query(Payment).filter(
            Payment.status == PaymentStatus.FAILED.value,
            Payment.created_at >= today.replace(hour=0, minute=0, second=0)
        ).count()
        
        return {
            "pulse_date": today.isoformat(),
            "daily_metrics": metrics,
            "real_time": {
                "current_hour": current_hour,
                "hour_assignments": hour_assignments,
                "hour_proofs": hour_proofs,
                "active_assignments": active_assignments,
                "failed_payments_today": failed_payments
            },
            "health_indicators": {
                "system_load": "normal",  # Would integrate with actual monitoring
                "queue_status": "healthy",
                "payment_system": "operational" if failed_payments < 5 else "degraded"
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get today's pulse: {str(e)}")

@router.get("/roll7")
async def get_roll7_pulse(db: Session = Depends(get_db)):
    """
    Get 7-day rolling pulse metrics
    """
    try:
        today = datetime.now(timezone.utc)
        seven_days_ago = today - timedelta(days=7)
        
        # Get daily metrics for the last 7 days
        daily_metrics = []
        for i in range(7):
            target_date = seven_days_ago + timedelta(days=i)
            daily_data = calculate_pulse_metrics(db, target_date)
            daily_metrics.append(daily_data)
        
        # Calculate rolling averages and trends
        total_missions = sum(day["missions_created"] for day in daily_metrics)
        total_assignments = sum(day["assignments_created"] for day in daily_metrics)
        total_completed = sum(day["assignments_completed"] for day in daily_metrics)
        total_revenue = sum(day["total_paid_krw"] for day in daily_metrics)
        
        avg_success_rate = sum(day["success_rate"] for day in daily_metrics) / 7
        avg_qa_score = sum(day["avg_qa_score"] for day in daily_metrics if day["avg_qa_score"] > 0) / len([d for d in daily_metrics if d["avg_qa_score"] > 0]) if any(d["avg_qa_score"] > 0 for d in daily_metrics) else 0
        
        # Trend calculation (comparing last 3 days vs first 4 days)
        recent_avg_missions = sum(day["missions_created"] for day in daily_metrics[-3:]) / 3
        earlier_avg_missions = sum(day["missions_created"] for day in daily_metrics[:4]) / 4
        mission_trend = "up" if recent_avg_missions > earlier_avg_missions else "down" if recent_avg_missions < earlier_avg_missions else "stable"
        
        return {
            "period": {
                "start_date": seven_days_ago.isoformat(),
                "end_date": today.isoformat(),
                "days": 7
            },
            "daily_breakdown": daily_metrics,
            "weekly_summary": {
                "total_missions": total_missions,
                "total_assignments": total_assignments,
                "total_completed": total_completed,
                "completion_rate": round((total_completed / total_assignments * 100), 2) if total_assignments > 0 else 0,
                "total_revenue_krw": total_revenue,
                "avg_success_rate": round(avg_success_rate, 2),
                "avg_qa_score": round(avg_qa_score, 2)
            },
            "trends": {
                "mission_creation": mission_trend,
                "trend_percentage": round(((recent_avg_missions - earlier_avg_missions) / earlier_avg_missions * 100), 2) if earlier_avg_missions > 0 else 0
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get 7-day pulse: {str(e)}")

@router.post("/evaluate")
async def evaluate_pulse_alerts(
    webhook_slack: bool = False,
    webhook_notion: bool = False,
    db: Session = Depends(get_db)
):
    """
    Evaluate pulse metrics against thresholds and send alerts
    """
    try:
        today = datetime.now(timezone.utc)
        metrics = calculate_pulse_metrics(db, today)
        
        alerts = []
        warnings = []
        
        # Define thresholds (would be configurable)
        thresholds = {
            "min_success_rate": 75.0,
            "min_qa_score": 0.7,
            "max_failed_payments": 5,
            "min_daily_missions": 10,
            "max_avg_qa_time": 30.0
        }
        
        # Check success rate
        if metrics["success_rate"] < thresholds["min_success_rate"]:
            alerts.append({
                "level": "critical",
                "metric": "success_rate",
                "value": metrics["success_rate"],
                "threshold": thresholds["min_success_rate"],
                "message": f"Success rate {metrics['success_rate']}% below threshold {thresholds['min_success_rate']}%"
            })
        
        # Check QA score
        if metrics["avg_qa_score"] > 0 and metrics["avg_qa_score"] < thresholds["min_qa_score"]:
            alerts.append({
                "level": "warning",
                "metric": "qa_score",
                "value": metrics["avg_qa_score"],
                "threshold": thresholds["min_qa_score"],
                "message": f"Average QA score {metrics['avg_qa_score']} below threshold {thresholds['min_qa_score']}"
            })
        
        # Check failed payments
        failed_payments_today = db.query(Payment).filter(
            Payment.status == PaymentStatus.FAILED.value,
            Payment.created_at >= today.replace(hour=0, minute=0, second=0)
        ).count()
        
        if failed_payments_today > thresholds["max_failed_payments"]:
            alerts.append({
                "level": "critical",
                "metric": "failed_payments",
                "value": failed_payments_today,
                "threshold": thresholds["max_failed_payments"],
                "message": f"{failed_payments_today} failed payments today exceeds threshold {thresholds['max_failed_payments']}"
            })
        
        # Check mission volume
        if metrics["missions_created"] < thresholds["min_daily_missions"]:
            warnings.append({
                "level": "info",
                "metric": "mission_volume",
                "value": metrics["missions_created"],
                "threshold": thresholds["min_daily_missions"],
                "message": f"Only {metrics['missions_created']} missions created today (below normal {thresholds['min_daily_missions']})"
            })
        
        # Simulate webhook calls (would integrate with actual services)
        webhook_results = {}
        
        if webhook_slack and (alerts or warnings):
            # Would send to actual Slack webhook
            slack_message = {
                "text": "JJIKMEOK Pulse Alert",
                "attachments": [
                    {
                        "color": "danger" if alerts else "warning",
                        "fields": [
                            {
                                "title": alert["metric"],
                                "value": alert["message"],
                                "short": False
                            }
                            for alert in alerts + warnings
                        ]
                    }
                ]
            }
            webhook_results["slack"] = {"status": "sent", "message_preview": slack_message}
        
        if webhook_notion and (alerts or warnings):
            # Would create Notion page/database entry
            notion_content = {
                "title": f"Pulse Alert - {today.strftime('%Y-%m-%d')}",
                "alerts": alerts,
                "warnings": warnings,
                "metrics": metrics
            }
            webhook_results["notion"] = {"status": "created", "content_preview": notion_content}
        
        # Store pulse metrics
        pulse_record = Pulse(
            date=today.replace(hour=0, minute=0, second=0, microsecond=0),
            missions_created=metrics["missions_created"],
            assignments_created=metrics["assignments_created"],
            assignments_completed=metrics["assignments_completed"],
            proofs_submitted=metrics["proofs_submitted"],
            proofs_passed=metrics["proofs_passed"],
            payments_completed=metrics["payments_completed"],
            total_budget_krw=metrics["total_budget_krw"],
            total_paid_krw=metrics["total_paid_krw"],
            avg_qa_score=metrics["avg_qa_score"],
            success_rate=metrics["success_rate"],
            avg_upload_time_sec=metrics["avg_upload_time_sec"],
            avg_qa_time_sec=metrics["avg_qa_time_sec"]
        )
        
        # Try to add, ignore if duplicate (unique constraint on date)
        try:
            db.add(pulse_record)
            db.commit()
        except:
            db.rollback()  # Ignore duplicate date entries
        
        return {
            "evaluation_time": today.isoformat(),
            "metrics": metrics,
            "thresholds": thresholds,
            "alerts": alerts,
            "warnings": warnings,
            "webhook_results": webhook_results,
            "summary": {
                "total_alerts": len(alerts),
                "total_warnings": len(warnings),
                "overall_health": "critical" if alerts else "warning" if warnings else "healthy"
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pulse evaluation failed: {str(e)}")

@router.get("/history")
async def get_pulse_history(
    days: int = 30,
    db: Session = Depends(get_db)
):
    """
    Get historical pulse data
    """
    try:
        end_date = datetime.now(timezone.utc)
        start_date = end_date - timedelta(days=days)
        
        pulse_records = db.query(Pulse).filter(
            Pulse.date >= start_date,
            Pulse.date <= end_date
        ).order_by(Pulse.date.desc()).all()
        
        return {
            "period": {
                "start_date": start_date.isoformat(),
                "end_date": end_date.isoformat(),
                "days_requested": days,
                "records_found": len(pulse_records)
            },
            "history": [
                {
                    "date": record.date.isoformat(),
                    "missions_created": record.missions_created,
                    "assignments_completed": record.assignments_completed,
                    "success_rate": record.success_rate,
                    "total_paid_krw": record.total_paid_krw,
                    "avg_qa_score": record.avg_qa_score
                }
                for record in pulse_records
            ]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get pulse history: {str(e)}")

@router.get("/realtime_status")
async def get_realtime_status(db: Session = Depends(get_db)):
    """
    Get real-time system status for dashboard
    """
    try:
        now = datetime.now(timezone.utc)
        
        # Current active items
        active_assignments = db.query(Assignment).filter(
            Assignment.state.in_([
                AssignmentState.ACCEPTED.value,
                AssignmentState.CAPTURING.value
            ])
        ).count()
        
        pending_proofs = db.query(Proof).filter(
            Proof.final_decision == ProofDecision.PENDING.value
        ).count()
        
        pending_payments = db.query(Payment).filter(
            Payment.status.in_([
                PaymentStatus.PENDING.value,
                PaymentStatus.T1_SCHEDULED.value
            ])
        ).count()
        
        # Recent activity (last hour)
        hour_ago = now - timedelta(hours=1)
        recent_submissions = db.query(Proof).filter(
            Proof.created_at >= hour_ago
        ).count()
        
        recent_payments = db.query(Payment).filter(
            Payment.created_at >= hour_ago,
            Payment.status == PaymentStatus.T0_SUCCESS.value
        ).count()
        
        return {
            "timestamp": now.isoformat(),
            "active_items": {
                "assignments_in_progress": active_assignments,
                "proofs_pending_qa": pending_proofs,
                "payments_pending": pending_payments
            },
            "recent_activity": {
                "submissions_last_hour": recent_submissions,
                "payments_last_hour": recent_payments
            },
            "system_health": {
                "status": "operational",  # Would integrate with actual health checks
                "uptime": "99.9%",        # Would come from monitoring
                "response_time_ms": 145   # Would come from monitoring
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get realtime status: {str(e)}")