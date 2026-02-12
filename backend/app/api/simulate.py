from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from app.schemas.simulation import SimulationRequest, SimulationResult
from app.services.prediction_service import PredictionService
from app.simulation.simulation_context import SimulationContext
from app.simulation.race_engine import RaceEngine
from app.services.database_service import DatabaseService
import logging

log = logging.getLogger(__name__)

router = APIRouter()
prediction_service = PredictionService()
db_service = DatabaseService()


def save_simulation_result(result_dict: dict):
    """Background task to persist simulation results to Supabase."""
    try:
        sim_id = db_service.save_simulation(result_dict)
        if sim_id:
            log.info(f"Simulation saved to Supabase: {sim_id}")
        else:
            log.warning("Simulation save skipped (Supabase not connected)")
    except Exception as e:
        log.error(f"Error saving simulation: {e}")


@router.post("/simulate", response_model=SimulationResult)
def run_simulation(
    request: SimulationRequest,
    background_tasks: BackgroundTasks,
):
    # 1. Get ML Data (Legacy Handoff + Model Reference)
    ml_handoff = prediction_service.get_simulation_handoff(request)
    pace_model = prediction_service.get_pace_model()

    # 2. Build Context (Now with Model!)
    ctx = SimulationContext(
        drivers=request.drivers,
        weather=request.weather,
        circuit=request.circuit_id,
        year=2024,
        lap_count=request.lap_count,
        track_temp=request.track_temp,
        air_temp=request.air_temp,
        ml_handoff=ml_handoff,
        pace_model=pace_model  # <--- INJECTED
    )

    # 3. Run Simulation
    engine = RaceEngine(ctx)
    result_data = engine.run()

    # 4. Format Output
    simulation_result = SimulationResult(**result_data)

    # 5. Async Save to Supabase
    result_dict = simulation_result.dict()
    background_tasks.add_task(save_simulation_result, result_dict)

    return simulation_result