# backend/app/api/standings.py
"""
Driver and Constructor standings endpoints.
Reads from Supabase `standings` table via DatabaseService.
"""

from fastapi import APIRouter, Query
from app.services.database_service import DatabaseService

router = APIRouter()
db_service = DatabaseService()


@router.get("/drivers", summary="Get Driver Standings")
async def get_driver_standings(year: int = Query(default=2026)):
    """Get driver championship standings for a given year."""
    standings = db_service.get_standings(year)
    if not standings:
        return {"standings": [], "year": year}

    # Map to frontend-friendly format
    result = []
    for i, s in enumerate(standings, 1):
        result.append({
            "position": s.get("position", i),
            "driverCode": (s.get("driver_id", "")[:3]).upper(),
            "driverName": s.get("driver_name", "Unknown"),
            "driverNumber": s.get("driver_number", 0),
            "teamId": s.get("team_name", "").lower().replace(" ", "_"),
            "teamName": s.get("team_name", "Unknown"),
            "points": s.get("points", 0) or 0,
            "wins": s.get("wins", 0) or 0,
            "podiums": s.get("podiums", 0) or 0,
        })

    return {"standings": result, "year": year}


@router.get("/constructors", summary="Get Constructor Standings")
async def get_constructor_standings(year: int = Query(default=2026)):
    """Get constructor championship standings for a given year."""
    constructors = db_service.get_constructors_standings(year)
    return {"standings": constructors, "year": year}
