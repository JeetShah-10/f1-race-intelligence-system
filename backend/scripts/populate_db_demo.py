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

from app.services.database_service import DatabaseService
from app.schemas.simulation import SimulationResult, DriverResult, LapData

def populate_demo_data():
    print("🚀 Populating Supabase with DEMO Data (Persistent)...")
    
    db = DatabaseService()
    if not db.supabase:
        print("❌ DatabaseService failed to initialize.")
        return

    # 1. Create Mock Simulation Result
    print("1. Creating Mock Data (Verstappen vs Hamilton at Monaco)...")
    
    # Max Verstappen (Winner)
    ver_laps = [
        LapData(lap_number=1, lap_time=75.2, position=1, gap_to_front=0.0, tyre_life=1, compound="SOFT"),
        LapData(lap_number=2, lap_time=74.8, position=1, gap_to_front=0.0, tyre_life=2, compound="SOFT"),
        LapData(lap_number=3, lap_time=74.9, position=1, gap_to_front=0.0, tyre_life=3, compound="SOFT")
    ]
    ver_result = DriverResult(
        driver_id="VER",
        team="Red Bull Racing",
        final_position=1,
        total_time=224.9,
        gap_to_leader=0.0,
        status="Finished",
        lap_data=ver_laps
    )

    # Lewis Hamilton (P2)
    ham_laps = [
        LapData(lap_number=1, lap_time=76.0, position=2, gap_to_front=0.8, tyre_life=1, compound="MEDIUM"),
        LapData(lap_number=2, lap_time=75.5, position=2, gap_to_front=1.5, tyre_life=2, compound="MEDIUM"),
        LapData(lap_number=3, lap_time=75.4, position=2, gap_to_front=2.0, tyre_life=3, compound="MEDIUM")
    ]
    ham_result = DriverResult(
        driver_id="HAM",
        team="Mercedes",
        final_position=2,
        total_time=226.9,
        gap_to_leader=2.0,
        status="Finished",
        lap_data=ham_laps
    )
    
    result = SimulationResult(
        circuit_id="monaco",
        status="completed",
        total_laps=3,
        results=[ver_result, ham_result]
    )
    
    # 2. Save to DB
    print("2. Saving to Supabase...")
    sim_id = db.save_simulation(result, session_type="DEMO_RUN", year=2025)
    
    if not sim_id:
        print("❌ Save failed.")
        return
        
    print(f"✅ Save successful!")
    print(f"👉 Check your Supabase Dashboard now.")
    print(f"   Table: simulation_results -> ID: {sim_id}")

if __name__ == "__main__":
    populate_demo_data()
