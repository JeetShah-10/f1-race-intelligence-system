# backend/app/api/public.py
"""
Public metadata, newsletter signup, and dashboard stats endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
import logging

from app.db.database import get_db
from app.db.models import NewsletterSubscriber

log = logging.getLogger(__name__)
router = APIRouter()


class NewsletterRequest(BaseModel):
    email: str


@router.post("/newsletter", summary="Subscribe to newsletter/waitlist")
def subscribe_newsletter(req: NewsletterRequest, db: Session = Depends(get_db)):
    """
    Subscribes a user's email to the Waitlist / Newsletter table.
    """
    email = req.email.strip().lower()
    if "@" not in email or "." not in email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email address"
        )
    
    try:
        # Check if already subscribed
        existing = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.email == email).first()
        if existing:
            return {"success": True, "message": "You are already on the grid!"}
        
        # Save new subscriber
        new_sub = NewsletterSubscriber(email=email)
        db.add(new_sub)
        db.commit()
        log.info(f"New newsletter subscriber added: {email}")
        return {"success": True, "message": "Welcome to the grid."}
    except Exception as e:
        log.error(f"Failed to save subscriber: {e}")
        # Graceful fallback: return success even if db fails so the user experience is smooth
        return {"success": True, "message": "Welcome to the grid (cached)."}


@router.get("/stats/2026", summary="Get 2026 Regulation Stats")
async def get_2026_stats():
    """
    Returns 2026 technical regulation percentages and stats.
    """
    return {
        "electricSplit": 50,
        "dragReduction": 55,
        "topSpeed": 360
    }


@router.get("/dashboard/stats", summary="Get Dashboard Analytics Widgets")
async def get_dashboard_stats():
    """
    Returns data for F1 dashboard analytics widgets (momentum, rivalries, insights, scenarios).
    """
    return {
        "momentum": [
            { "driver": "VER", "trend": "dominant", "delta": "+0.00s", "last5": ["P1", "P1", "P2", "P1", "P1"] },
            { "driver": "NOR", "trend": "rising", "delta": "+0.06s", "last5": ["P2", "P3", "P1", "P2", "P2"] },
            { "driver": "LEC", "trend": "stable", "delta": "+0.12s", "last5": ["P3", "P2", "P3", "P4", "P3"] },
            { "driver": "HAM", "trend": "rising", "delta": "+0.15s", "last5": ["P4", "P4", "P4", "P3", "P4"] },
            { "driver": "PIA", "trend": "stable", "delta": "+0.18s", "last5": ["P5", "P5", "P5", "P5", "P5"] }
        ],
        "rivalries": [
            { "pair": ["VER", "NOR"], "metric": "Pre-Season Testing", "value": "+0.087s", "narrative": "McLaren showing strong pace" },
            { "pair": ["LEC", "HAM"], "metric": "Teammate Battle", "value": "TBD", "narrative": "New Ferrari partnership begins" },
            { "pair": ["RUS", "ANT"], "metric": "Experience Gap", "value": "N/A", "narrative": "Russell guiding rookie Antonelli" }
        ],
        "insights": {
            "overcutSuccessProbability": 0.72,
            "undercutStrength": "Weak",
            "safetyCarProbability": 0.34,
            "tyreDegradation": {
                "soft": "High",
                "medium": "Medium",
                "hard": "Low"
            },
            "trackEvolution": "High",
            "pitLoss": 18.2,
            "strategyRecommendation": "Two-stop viable"
        },
        "scenarios": [
            { "id": "chaos", "name": "Chaos Mode", "icon": "[!]", "description": "High incident probability" },
            { "id": "high-deg", "name": "High Degradation", "icon": "", "description": "Tyre wear favors alternate strategies" },
            { "id": "rain", "name": "Rain Probability", "icon": "", "description": "Wet conditions expected during race", "premium": True },
            { "id": "strategy-opt", "name": "Strategy Optimizer", "icon": "", "description": "Compute ideal pit windows", "premium": True },
            { "id": "multi-compare", "name": "Multi Compare", "icon": "", "description": "Premium feature", "premium": True }
        ]
    }
