from fastapi import APIRouter, HTTPException, Query
from app.services.ergast_service import ErgastService

router = APIRouter()
ergast_service = ErgastService()

@router.get("/drivers", summary="Get Driver Standings")
async def get_driver_standings(year: int = 2025):
    """
    Get driver standings for a specific year.
    """
    standings = ergast_service.get_driver_standings(year)
    if not standings:
        # Default to empty list instead of 404 if it's just early in the season?
        # But if year is invalid, it returns empty list usually.
        # Let's return empty list if no data to be safe for frontend.
        return {"standings": []}
    
    return {"standings": standings}

@router.get("/constructors", summary="Get Constructor Standings")
async def get_constructor_standings(year: int = 2025):
    """
    Get constructor standings for a specific year.
    """
    standings = ergast_service.get_constructor_standings(year)
    if not standings:
        return {"standings": []}
    
    return {"standings": standings}
