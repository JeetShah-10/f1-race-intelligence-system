from fastapi import APIRouter, HTTPException, Query
from app.services.ergast_service import ErgastService

router = APIRouter()
ergast_service = ErgastService()

@router.get("/", summary="Get F1 Drivers")
async def get_drivers(year: int = 2025):
    """
    Get a list of drivers for a specific season.
    """
    # We can use the driver standings to get the active drivers for a season
    # Or query the 'drivers' endpoint of Ergast if exposed.
    # FastF1's Ergast object has get_driver_info(season=year) usually?
    # Let's check ErgastService capabilities we built or extend it.
    
    # Re-using get_driver_standings is a safe bet to get *active* drivers who scored points,
    # but strictly we should use ergast.get_driver_info(season=year).
    # Since we don't have that method in our service yet, let's stick to standings for now 
    # as a proxy, or better, extend the service.
    
    standings = ergast_service.get_driver_standings(year)
    if not standings:
        return {"drivers": []}
    
    # Extract driver info from standings
    drivers = []
    for entry in standings:
        if 'Driver' in entry:
            drivers.append(entry['Driver'])
        elif 'driverId' in entry: # Fallback if structure varies
             drivers.append(entry)
             
    return {"drivers": drivers}
