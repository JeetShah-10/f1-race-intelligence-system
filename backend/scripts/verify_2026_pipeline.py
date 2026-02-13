import sys
import os
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).resolve().parent.parent
sys.path.append(str(backend_path))

from app.services.qualifying_service import QualifyingService
from app.simulation.race_engine import RaceEngine
from app.simulation.simulation_context import SimulationContext
from app.schemas.simulation import DriverInput
from app.schemas.ml_simulation_handoff import MLHandoff

def verify_pipeline():
    print(" Starting 2026 Simulation Pipeline Verification")
    
    # 1. Run Qualifying
    print("\n--- Phase 1: Qualifying (Monaco) ---")
    qs = QualifyingService()
    grid = qs.predict_grid("monaco")
    
    print(f"Grid Size: {len(grid)}")
    print(f"Pole Position: {grid[0]['driver_id']} ({grid[0]['team']})")
    print(f"Back Row: {grid[-1]['driver_id']} ({grid[-1]['team']})")
    
    # 2. Prepare Simulation Input
    print("\n--- Phase 2: Simulation Setup ---")
    
    driver_inputs = []
    ml_handoffs = []
    
    for d in grid:
        # Create Driver Input
        di = DriverInput(
            driver=d["driver_id"],
            team=d["team"],
            grid_position=d["position"],
            compound="MEDIUM",
            tyre_life=0,
            avg_lap_time=None,
            std_lap_time=None,
            num_laps=0,
            finished=0
        )
        driver_inputs.append(di)
        
        # Create Mock ML Handoff (Bypassing real ML model for reliability)
        # 2026 Drivers might not be in historical ML model
        base_pace = d["qualifying_time"] + 5.0 # Race pace is slower than quali
        
        handoff = MLHandoff(
            driver_id=d["driver_id"],
            baseline_lap_time=base_pace,
            tyre_degradation_slope=0.1 # Standard deg
        )
        ml_handoffs.append(handoff)
        
    print(f"Prepared {len(driver_inputs)} drivers and handoffs.")
    
    # 3. Create Context
    ctx = SimulationContext(
        circuit="monaco",
        year=2026,
        drivers=driver_inputs,
        weather="wet", # Force WET race to increase crash probability
        track_temp=25.0,
        air_temp=20.0,
        lap_count=20, # Short race to test events
        ml_handoff=ml_handoffs
    )
    
    # 4. Run Race Engine
    print("\n--- Phase 3: Race Execution (High Risk) ---")
    engine = RaceEngine(ctx)
    results = engine.run()
    
    # 5. Analyze Results
    print("\n--- Phase 4: Results Analysis ---")
    
    # Check for crashes
    dnfs = [d for d in results["results"] if d["status"] != "Finished"]
    finished = [d for d in results["results"] if d["status"] == "Finished"]
    
    print(f"Total Finishers: {len(finished)}")
    print(f"Total DNFs: {len(dnfs)}")
    
    for dnf in dnfs:
        print(f" DNF: {dnf['driver_id']} ({dnf['team']}) - Status: {dnf['status']}")
        
    # Check for Safety Car Events
    sc_events = [e for e in engine.event_manager.events if "SafetyCar" in str(e.__class__)]
    print(f"Safety Car Deployments: {len(sc_events)}")
    
    print("\n Verification Complete")

if __name__ == "__main__":
    verify_pipeline()
