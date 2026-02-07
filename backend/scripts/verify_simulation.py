import asyncio
import sys
import os

# Setup Paths
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(ROOT_DIR)

from app.schemas.simulation import SimulationRequest, DriverInput, EventConfig

async def verify_simulation_logic():
    print("Verifying Full Simulation Pipeline (Day 3 + Strategy + API Events)...")
    
    # Mock Request with Events
    req = SimulationRequest(
        circuit_id="bahrain",
        year=2023,
        lap_count=57,
        drivers=[
            DriverInput(driver="VER", team="Red Bull", compound="SOFT", tyre_life=0,
                        grid_position=1, avg_lap_time=92.0, std_lap_time=0.1, num_laps=57, finished=1),
            DriverInput(driver="HAM", team="Mercedes", compound="MEDIUM", tyre_life=0,
                        grid_position=2, avg_lap_time=92.5, std_lap_time=0.1, num_laps=57, finished=1)
        ],
        track_temp=30.0,
        air_temp=25.0,
        events=[
            EventConfig(type="SC", start_lap=10, duration=5) # 💉 API INJECTION
        ]
    )
    
    try:
        # 3. Call API Endpoint Logic
        from app.api.simulate import simulate_race
        
        # This calls the actual handler logic
        result = await simulate_race(req)
        
        # Analyze Results for SC (Lap 10-15) indirectly via lap data
        print("\n   Analyzing Safety Car Phase (Laps 10-15) from API Result...")
        
        # We need to find the driver result to check laps
        ver_result = result.results[0]
        ver_laps = ver_result.lap_data
        
        sc_times = []
        for lap in ver_laps:
            if 10 <= lap.lap_number < 15:
                print(f"      Lap {lap.lap_number}: {lap.lap_time:.3f}s")
                sc_times.append(lap.lap_time)
                
        avg = sum(sc_times) / len(sc_times) if sc_times else 0
        if 118 < avg < 122:
             print("   API Event Injection WORKS (SC ~120s)")
        else:
             print(f"   API Event Injection FAILED (Avg {avg:.1f}s)")
             
        print("\nSimulation Logic Verified.")
            
    except Exception as e:
        print(f"Verification Failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(verify_simulation_logic())
