import sys
import os

# Setup Paths
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(ROOT_DIR)

from app.services.prediction_service import PredictionService
from app.schemas.simulation import SimulationRequest, DriverInput

def verify_ml_integration():
    print("Verifying ML Integration (Day 2)...")
    
    try:
        service = PredictionService()
        
        # Create Dummy Request
        req = SimulationRequest(
            circuit_id="bahrain",
            session_type="R",
            lap_count=50,
            year=2023,
            drivers=[
                DriverInput(
                    driver="VER", team="Red Bull", compound="SOFT", tyre_life=0,
                    grid_position=1, avg_lap_time=90.0, std_lap_time=0.5, num_laps=57, finished=1
                ),
                DriverInput(
                    driver="HAM", team="Mercedes", compound="MEDIUM", tyre_life=0,
                    grid_position=2, avg_lap_time=90.5, std_lap_time=0.4, num_laps=57, finished=1
                )
            ],
            track_temp=30.0,
            air_temp=25.0,
            speed_st=300.0,
            speed_fl=310.0
        )
        
        print("   Calling get_simulation_handoff...")
        handoffs = service.get_simulation_handoff(req)
        
        print(f"Success! Generated {len(handoffs)} handoff objects.")
        for h in handoffs:
            print(f"   {h.driver_id}: Base Pace={h.baseline_lap_time:.3f}s, Deg={h.tyre_degradation_slope:.4f}s/lap")
            
    except Exception as e:
        print(f"Verification Failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    verify_ml_integration()
