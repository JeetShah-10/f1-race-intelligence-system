from fastapi import APIRouter
from app.schemas.simulation import SimulationRequest
from app.services.prediction_service import PredictionService
from app.simulation.race_engine import RaceEngine

router = APIRouter()
predictor = PredictionService()

@router.post("/simulate/race")
def simulate_race(payload: SimulationRequest):
    # 1. Get ML Handoff data
    ml_handoff = predictor.get_simulation_handoff(payload)

    # 2. Initialize RaceEngine
    race_engine = RaceEngine(
        drivers=[driver.dict() for driver in payload.drivers],
        weather=payload.weather,
        circuit=payload.circuit,
        lap_count=payload.lap_count,
        ml_handoff=ml_handoff
    )

    # 3. Run simulation
    simulation_results = race_engine.run()

    return simulation_results