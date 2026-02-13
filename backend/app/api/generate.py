# backend/app/api/generate.py
"""
POST /api/simulate/generate - Pre-calculated simulation endpoint.

Returns the entire race as a pre-computed set of 0.1s frames,
suitable for client-side playback using requestAnimationFrame.
Response is automatically GZIP-compressed via middleware.
"""

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import ORJSONResponse
from app.schemas.simulation import SimulationRequest
from app.services.prediction_service import PredictionService
from app.simulation.simulation_context import SimulationContext
from app.simulation.race_engine import RaceEngine
from app.simulation.frame_generator import FrameGenerator

router = APIRouter()
prediction_service = PredictionService()


@router.post("/generate")
def generate_simulation(request: SimulationRequest):
    """
    Generate a complete pre-calculated simulation.
    
    Returns:
        {
            "simulationId": "sim_abc123",
            "totalDuration": 5400.0,
            "events": [...],
            "frames": [...]
        }
    """
    try:
        # 1. Get ML Data
        ml_handoff = prediction_service.get_simulation_handoff(request)
        pace_model = prediction_service.get_pace_model()

        # 2. Build Context
        ctx = SimulationContext(
            drivers=request.drivers,
            weather=request.weather,
            circuit=request.circuit_id,
            year=request.year,
            lap_count=request.lap_count,
            track_temp=request.track_temp,
            air_temp=request.air_temp,
            ml_handoff=ml_handoff,
            pace_model=pace_model,
        )

        # 3. Run Simulation (batch mode - collect all snapshots)
        engine = RaceEngine(ctx)
        engine.run()

        # 4. Extract driver events for the event timeline
        driver_events = {d.driver_id: d.events for d in engine.drivers}

        # 5. Generate pre-calculated frames
        generator = FrameGenerator(
            snapshots=engine.snapshots,
            driver_events=driver_events,
            track_id=request.circuit_id,
        )
        result = generator.generate()

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
