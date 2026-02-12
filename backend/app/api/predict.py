from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Dict, Any, List
from pathlib import Path
import os

from app.services.race_predictor_service import RacePredictorService

router = APIRouter()
predictor = RacePredictorService()

class PredictionRequest(BaseModel):
    circuit_id: str
    weather: str = "dry"
    lap_count: int = 57
    year: int = 2026

@router.post("/event")
def predict_event(request: PredictionRequest):
    """
    Run a full 2026 Prediction (Qualifying -> Race -> Analysis).
    """
    try:
        # Run prediction
        result = predictor.predict_event_2026(
            circuit_id=request.circuit_id,
            weather=request.weather,
            lap_count=request.lap_count
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/season/report")
def get_season_report():
    """
    Get the pre-computed 2026 Season Analysis Report.
    """
    # Path where we saved the report in the script
    report_path = Path("backend/2026_season_results.md")
    
    # Try finding it relative to current working dir (usually project root)
    if not report_path.exists():
        # Fallback for Docker/different CWD
        report_path = Path("2026_season_results.md")
    
    if not report_path.exists():
         return {"content": "# Report Not Found\n\nPlease run the season simulation script first."}
         
    try:
        with open(report_path, "r", encoding="utf-8") as f:
            content = f.read()
        return {"content": content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read report: {str(e)}")
