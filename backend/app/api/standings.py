# backend/app/api/standings.py
"""
Driver and Constructor standings endpoints.
Reads from Supabase `standings` table via DatabaseService.
"""

from fastapi import APIRouter, Query
from app.services.database_service import DatabaseService

from app.services.season_config_service import SeasonConfigService

router = APIRouter()
db_service = DatabaseService()
season_config = SeasonConfigService()


@router.get("/drivers", summary="Get Driver Standings")
async def get_driver_standings(year: int = Query(default=2026)):
    """Get driver championship standings for a given year."""
    standings = db_service.get_standings(year)
    
    # Fallback for 2026 if DB is empty (Pre-season or fresh install)
    if not standings and year == 2026:
        drivers = season_config.config.get("drivers", [])
        # Create initial standings with 0 points
        initial_standings = []
        for i, d in enumerate(drivers, 1):
            name_parts = d.get("name", "").split(" ")
            given_name = name_parts[0] if name_parts else ""
            family_name = " ".join(name_parts[1:]) if len(name_parts) > 1 else ""
            team_id = d.get("team_id", "")
            team = season_config.get_team_config(team_id)
            
            initial_standings.append({
                "position": i,
                "driverCode": d.get("code"),
                "driverName": d.get("name"),
                "driverNumber": 0, # Config doesn't have numbers yet
                "teamId": team_id,
                "teamName": team.get("name", team_id) if team else team_id,
                "points": 0,
                "wins": 0,
                "podiums": 0,
            })
        return {"standings": initial_standings, "year": year}

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
    
    # Fallback for 2026 if DB is empty
    if not constructors and year == 2026:
        teams = season_config.config.get("teams", [])
        initial_standings = []
        for i, t in enumerate(teams, 1):
            initial_standings.append({
                "position": i,
                "team_name": t.get("name"),
                "points": 0,
                "drivers": 0 # We could count them but 0 is fine for init
            })
        return {"standings": initial_standings, "year": year}
        
    return {"standings": constructors, "year": year}
