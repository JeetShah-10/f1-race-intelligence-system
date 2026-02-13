import os
import sys
import asyncio
from datetime import datetime
from dotenv import load_dotenv

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Load .env
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(env_path)

from app.schemas.simulation import SimulationRequest, DriverInput, DriverResult, LapData, SimulationResult
from app.services.prediction_service import PredictionService
from app.services.database_service import DatabaseService
from app.simulation.simulation_context import SimulationContext
from app.simulation.race_engine import RaceEngine

def run_real_simulation():
    print("  Starting REAL Simulation (Circuit: Bahrain)...")
    
    # 1. Initialize Services
    ml_service = PredictionService()
    db_service = DatabaseService()
    
    if not db_service.supabase:
        print(" DatabaseService failed to initialize. Check .env variables.")
        return

    # 2. Define Drivers (2024 Grid)
    drivers = [
        DriverInput(driver="VER", team="Red Bull", grid_position=1, compound="SOFT", tyre_life=0, avg_lap_time=None, std_lap_time=None, num_laps=0, finished=0),
        DriverInput(driver="LEC", team="Ferrari", grid_position=2, compound="SOFT", tyre_life=0, avg_lap_time=None, std_lap_time=None, num_laps=0, finished=0),
        DriverInput(driver="RUS", team="Mercedes", grid_position=3, compound="MEDIUM", tyre_life=0, avg_lap_time=None, std_lap_time=None, num_laps=0, finished=0),
        DriverInput(driver="SAI", team="Ferrari", grid_position=4, compound="MEDIUM", tyre_life=0, avg_lap_time=None, std_lap_time=None, num_laps=0, finished=0),
        DriverInput(driver="HAM", team="Mercedes", grid_position=9, compound="HARD", tyre_life=0, avg_lap_time=None, std_lap_time=None, num_laps=0, finished=0),
    ]

    # 3. Create Request
    req = SimulationRequest(
        circuit_id="bahrain",
        year=2024,
        session_type="R",
        lap_count=20, # Shortened real race for speed
        track_temp=30.0,
        air_temp=25.0,
        drivers=drivers
    )
    
    # 4. Run ML Pipeline (Get Physics Params)
    print(" Fetching ML Parameters (Pace & Degradation)...") 
    # Note: access private method or run the public one?
    # PredictionService.get_simulation_handoff is the public API.
    handoffs = ml_service.get_simulation_handoff(req)
    
    # 5. Build Context & Run Engine
    print(f" Lights Out! Simulating {req.lap_count} laps...")
    ctx = SimulationContext(
        circuit=req.circuit_id,
        year=req.year,
        drivers=drivers,
        weather="Sunny",
        track_temp=req.track_temp,
        air_temp=req.air_temp,
        lap_count=req.lap_count,
        ml_handoff=handoffs
    )
    
    engine = RaceEngine(ctx)
    result_data = engine.run()
    
    # 6. Map to Schema (Same logic as API)
    driver_results = []
    for d in result_data["results"]:
        driver_laps = []
        d_id = d["driver_id"]
        
        for snapshot in engine.snapshots:
            if d_id in snapshot.lap_times:
                dlap = LapData(
                    lap_number=snapshot.lap_number,
                    lap_time=snapshot.lap_times[d_id],
                    position=snapshot.driver_positions.index(d_id) + 1,
                    gap_to_front=snapshot.gaps_to_leader[d_id],
                    tyre_life=snapshot.lap_number + d.get('starting_tyre_age', 0), # Simplified
                    compound="SOFT" # Placeholder, engine handles swaps internally but doesn't expose yet
                )
                driver_laps.append(dlap)

        res = DriverResult(
            driver_id=d["driver_id"],
            team=d.get("team", "Unknown"),
            final_position=d["position"],
            total_time=d["time"],
            gap_to_leader=d["gap_to_leader"],
            status=d["status"],
            lap_data=driver_laps
        )
        driver_results.append(res)
    
    final_result = SimulationResult(
        circuit_id=req.circuit_id,
        status="completed",
        total_laps=req.lap_count,
        results=driver_results
    )
    
    # 7. Persist
    print(" Saving results to Supabase...")
    sim_id = db_service.save_simulation(final_result, session_type="REAL_SIMULATION_SCRIPT", year=2024)
    
    if sim_id:
        print(f" Success! Data saved.")
        print(f"   Simulation ID: {sim_id}")
        print(f"   Check your 'simulation_results' table.")
    else:
        print(" Save failed.")

if __name__ == "__main__":
    run_real_simulation()
