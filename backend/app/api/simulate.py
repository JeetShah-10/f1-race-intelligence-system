<<<<<<< HEAD
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
=======
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from app.schemas.simulation import SimulationRequest, SimulationResult, DriverResult, LapData
from app.services.prediction_service import PredictionService
from app.services.database_service import DatabaseService
from app.simulation.simulation_context import SimulationContext
from app.simulation.race_engine import RaceEngine

router = APIRouter()
prediction_service = PredictionService()
db_service = DatabaseService()

@router.post("/", response_model=SimulationResult, summary="Run Race Simulation")
async def simulate_race(request: SimulationRequest, background_tasks: BackgroundTasks):
    """
    Run a full race simulation based on input configuration.
    
    1. Gets ML parameters (Pace, Deg) from PredictionService.
    2. Initializes RaceEngine with Context.
    3. Runs the loop.
    4. Formats and returns the result.
    5. Persists result to Supabase (Background Task).
    """
    print(f"🏎️  Simulation Request Received: {request.circuit_id} ({request.lap_count} laps)")
    
    # 1. Get Machine Learning Handoff (Physics Parameters)
    try:
        ml_handoffs = prediction_service.get_simulation_handoff(request)
    except Exception as e:
        print(f"❌ ML Service Failed: {e}")
        raise HTTPException(status_code=500, detail=f"ML Service Error: {str(e)}")

    # 2. Build Simulation Context
    ctx = SimulationContext(
        circuit=request.circuit_id,
        year=request.year,
        drivers=request.drivers,
        weather="Sunny",
        track_temp=request.track_temp,
        air_temp=request.air_temp,
        lap_count=request.lap_count,
        ml_handoff=ml_handoffs
    )

    # 3. Initialize & Run Engine
    engine = RaceEngine(ctx)
    
    # 3b. Register Requested Events
    for evt in request.events:
        if evt.type == "SC":
            from app.simulation.events import SafetyCarEvent
            engine.event_manager.register_event(SafetyCarEvent(evt.start_lap, evt.duration))
            print(f"   + Registered Custom Event: SC (Lap {evt.start_lap})")
            
    result_data = engine.run()
    
    # 4. Map to Response Schema (SimulationResult)
    driver_results = []
    for d in result_data["results"]:
        # Reconstruct LapData from engine snapshots
        driver_laps = []
        d_id = d["driver_id"]
        
        for snapshot in engine.snapshots:
            if d_id in snapshot.lap_times:
                dlap = LapData(
                    lap_number=snapshot.lap_number,
                    lap_time=snapshot.lap_times[d_id],
                    position=snapshot.driver_positions.index(d_id) + 1,
                    gap_to_front=snapshot.gaps_to_leader[d_id],
                    tyre_life=snapshot.lap_number, # TODO: Get exact tyre life from driver state history if needed
                    compound="SOFT" # Placeholder
                )
                driver_laps.append(dlap)

        res = DriverResult(
            driver_id=d["driver_id"],
            team=d.get("team", "Unknown"), # Added Team
            final_position=d["position"],
            total_time=d["time"],
            gap_to_leader=d["gap_to_leader"],
            status=d["status"],
            lap_data=driver_laps
        )
        driver_results.append(res)

    final_result = SimulationResult(
        circuit_id=request.circuit_id,
        status="completed",
        total_laps=request.lap_count,
        results=driver_results
    )

    # 5. Persist to Database (Background Task)
    background_tasks.add_task(
        db_service.save_simulation, 
        final_result, 
        request.session_type, 
        request.year
    )
    
    return final_result
>>>>>>> 5875195 (Recover all stashed backend files - Week 1 API endpoints and services)
