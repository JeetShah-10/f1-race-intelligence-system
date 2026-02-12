from fastapi import APIRouter, HTTPException, Query
from app.services.ergast_service import ErgastService
from app.services.season_config_service import SeasonConfigService

router = APIRouter()
ergast_service = ErgastService()
season_config = SeasonConfigService()

@router.get("/", summary="Get F1 Drivers")
async def get_drivers(year: int = 2025):
    """
    Get a list of drivers for a specific season.
    For 2026, returns the configured grid (including rookies/new teams).
    For past years, fetches from Ergast API.
    """
    # 2026 Season: Use our custom config
    if year == 2026:
        drivers = season_config.config.get("drivers", [])
        result = []
        for d in drivers:
            # Split full name into given/family if needed
            name_parts = d.get("name", "").split(" ")
            given_name = name_parts[0] if name_parts else ""
            family_name = " ".join(name_parts[1:]) if len(name_parts) > 1 else ""
            
            result.append({
                "driverId": d.get("id"),
                "code": d.get("code"),
                "givenName": given_name,
                "familyName": family_name,
                "nationality": "Unknown",  # Config doesn't have nationality yet
                "permanentNumber": "0",    # Config doesn't have numbers yet
                "url": "",
                "image": f"/assets/drivers/{d.get('id')}.png" # Frontend expects this path structure
            })
        return {"drivers": result}

    # Past Seasons: Use Ergast/Jolpica
    try:
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
    except Exception as e:
        print(f"Error fetching drivers for {year}: {e}")
        return {"drivers": []}
