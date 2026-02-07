from fastapi import APIRouter, HTTPException, Query
from app.services.strategy_service import StrategyService

router = APIRouter()
strategy_service = StrategyService()

@router.get("/tyre-life")
def get_tyre_life(compound: str, track_temp: float = 30.0, aggression: float = 1.0):
    """
    Get estimated tyre life for a specific compound and condition.
    """
    life = strategy_service.calculate_tyre_life(compound, track_temp, aggression)
    return {
        "compound": compound,
        "track_temp": track_temp,
        "aggression": aggression,
        "estimated_life_laps": life
    }

@router.get("/undercut")
def analyze_undercut(
    gap_to_ahead: float, 
    my_lap_time: float, 
    ahead_lap_time: float,
    fresh_tyre_gain: float = 1.5
):
    """
    Analyze if an undercut is viable against a driver ahead.
    """
    analysis = strategy_service.analyze_undercut(
        gap_to_ahead=gap_to_ahead,
        my_lap_time=my_lap_time,
        ahead_lap_time=ahead_lap_time,
        fresh_tyre_pace_gain=fresh_tyre_gain
    )
    return analysis
