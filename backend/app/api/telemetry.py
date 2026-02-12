from fastapi import APIRouter, HTTPException, Query
from app.services.fastf1_service import FastF1Service
import pandas as pd
import numpy as np

router = APIRouter()
fastf1_service = FastF1Service()

@router.get("/trace", summary="Get Lap Telemetry")
async def get_lap_telemetry(
    year: int = Query(..., description="Year of the event"),
    gp: str = Query(..., description="Grand Prix name or round number"),
    session: str = Query("R", description="Session identifier (FP1, FP2, FP3, Q, S, R)"),
    driver: str = Query(..., description="Driver code (e.g. VER)"),
    lap: int = Query(None, description="Lap number. If not provided, returns fastest lap.")
):
    """
    Get telemetry data (Speed, RPM, Gear, Throttle, Brake) for a specific driver and lap.
    """
    try:
        # Load session
        # Note: This might be slow on first load (caching handles subsequent calls)
        sess = fastf1_service.load_session(year, gp, session)
        if not sess:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Pick driver
        try:
            d_laps = sess.laps.pick_driver(driver)
        except Exception:
             raise HTTPException(status_code=404, detail=f"Driver {driver} not found in session")

        if len(d_laps) == 0:
            raise HTTPException(status_code=404, detail=f"No laps found for driver {driver}")

        # Pick lap
        if lap:
            # laps are 1-indexed usually, but fastf1 can query by 'LapNumber'
            selected_lap = d_laps[d_laps['LapNumber'] == lap]
            if len(selected_lap) == 0:
                 raise HTTPException(status_code=404, detail=f"Lap {lap} not found for driver")
            selected_lap = selected_lap.iloc[0] # Series
        else:
            selected_lap = d_laps.pick_fastest()
            if selected_lap is None:  # Can happen if no valid lap
                 selected_lap = d_laps.iloc[0]

        # Get telemetry
        car_data = selected_lap.get_car_data().add_distance()
        
        # Convert to list of dicts
        # Replace NaN with None for JSON compliance
        car_data = car_data.where(pd.notnull(car_data), None)
        
        # Subset columns to reduce payload size
        cols = ['Date', 'RPM', 'Speed', 'nGear', 'Throttle', 'Brake', 'DRS', 'Distance']
        # Ensure cols exist
        available_cols = [c for c in cols if c in car_data.columns]
        
        telemetry = car_data[available_cols].to_dict('records')
        
        # Also return lap info
        lap_info = {
            "LapNumber": int(selected_lap['LapNumber']),
            "LapTime": str(selected_lap['LapTime']).replace('0 days ', ''),
            "Sector1Time": str(selected_lap['Sector1Time']).replace('0 days ', ''),
            "Sector2Time": str(selected_lap['Sector2Time']).replace('0 days ', ''),
            "Sector3Time": str(selected_lap['Sector3Time']).replace('0 days ', ''),
            "Compound": str(selected_lap['Compound']),
            "TyreLife": int(selected_lap['TyreLife']) if pd.notnull(selected_lap['TyreLife']) else None
        }

        # Handle Date serialization
        for point in telemetry:
             if 'Date' in point and point['Date']:
                 point['Date'] = point['Date'].isoformat()

        return {
            "driver": driver,
            "lap_info": lap_info,
            "telemetry": telemetry
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Telemetry Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
