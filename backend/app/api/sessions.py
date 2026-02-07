from fastapi import APIRouter, HTTPException, Query
from app.services.fastf1_service import FastF1Service

router = APIRouter()
fastf1_service = FastF1Service()

@router.get("/{year}", summary="Get Race Schedule for a Year")
async def get_sessions(year: int):
    """
    Get the F1 race schedule for a specific year.
    """
    schedule = fastf1_service.get_schedule(year)
    if not schedule:
        raise HTTPException(status_code=404, detail=f"No schedule found for year {year}")
    
    return {"sessions": schedule}
