import os
import sys
import asyncio
from datetime import datetime
from dotenv import load_dotenv

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Load .env explicitly for script execution
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(env_path)

from app.services.database_service import DatabaseService
from app.schemas.simulation import SimulationResult, DriverResult, LapData
from supabase import create_client

def verify_integration():
    print(" Starting Database Integration Verification...")
    
    db = DatabaseService()
    if not db.supabase:
        print(" DatabaseService failed to initialize.")
        return

    # 1. Create Mock Simulation Result
    print("1. Creating Mock Data...")
    
    lap1 = LapData(lap_number=1, lap_time=80.5, position=1, gap_to_front=0.0, tyre_life=1, compound="SOFT")
    lap2 = LapData(lap_number=2, lap_time=79.8, position=1, gap_to_front=0.0, tyre_life=2, compound="SOFT")
    
    driver1 = DriverResult(
        driver_id="VER",
        team="Red Bull Racing",
        final_position=1,
        total_time=160.3,
        gap_to_leader=0.0,
        status="Finished",
        lap_data=[lap1, lap2]
    )
    
    result = SimulationResult(
        circuit_id="monaco_test",
        status="completed",
        total_laps=2,
        results=[driver1]
    )
    
    # 2. Save to DB
    print("2. Saving to Supabase...")
    sim_id = db.save_simulation(result, session_type="TEST_INTEGRATION", year=2025)
    
    if not sim_id:
        print(" Save failed (returned None).")
        return
        
    print(f" Save successful. Simulation ID: {sim_id}")
    
    # 3. Verify Data in DB
    print("3. Verifying Relational Integrity...")
    
    # Query Simulation
    sim_row = db.supabase.table("simulation_results").select("*").eq("id", sim_id).single().execute()
    print(f"   [Simulation] Found: {sim_row.data['circuit_id'] == 'monaco_test'}")
    
    # Query Driver
    adv_row = db.supabase.table("driver_results").select("*").eq("simulation_id", sim_id).single().execute()
    driver_row_id = adv_row.data['id']
    print(f"   [Driver] Found: {adv_row.data['driver_id'] == 'VER'} (Team: {adv_row.data['team_id']})")
    
    # Query Laps
    laps = db.supabase.table("lap_data").select("*").eq("driver_result_id", driver_row_id).execute()
    print(f"   [Laps] Found {len(laps.data)} laps (Expected 2).")
    
    if len(laps.data) == 2:
        print(" INTEGRATION TEST PASSED")
    else:
        print(" INTEGRATION TEST FAILED: Lap count mismatch.")

    # 4. Cleanup
    print("4. Cleaning Up...")
    db.supabase.table("simulation_results").delete().eq("id", sim_id).execute()
    print(" Cleanup complete.")

if __name__ == "__main__":
    verify_integration()
