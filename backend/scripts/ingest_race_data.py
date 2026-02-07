import os
import sys
import asyncio
import fastf1
import pandas as pd
import numpy as np
from datetime import datetime
from dotenv import load_dotenv

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Load .env
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(env_path)

from app.services.database_service import DatabaseService

# Configuration
CACHE_DIR = os.path.join(os.path.dirname(__file__), '..', 'cache', 'fastf1')

def setup_fastf1():
    os.makedirs(CACHE_DIR, exist_ok=True)
    fastf1.Cache.enable_cache(CACHE_DIR)

def ingest_race_data():
    print("🚀 Starting Phase 2: Race Data Ingestion...")
    setup_fastf1()
    
    db = DatabaseService()
    if not db.supabase:
        print("❌ Database connection failed.")
        return

    # 1. Get List of Races to Process
    # We only process races that exist in our 'races' table
    try:
        response = db.supabase.table("races").select("race_id, year, round, name").execute()
        races_db = response.data
        print(f"📅 Found {len(races_db)} races in database to process.")
    except Exception as e:
        print(f"❌ Failed to fetch races list: {e}")
        return

    for race_meta in races_db:
        year = race_meta['year']
        round_num = race_meta['round']
        race_id = race_meta['race_id']
        name = race_meta['name']
        
        print(f"\nProcessing {year} Round {round_num}: {name} ({race_id})")

        try:
            session = fastf1.get_session(year, round_num, 'R')
            session.load(telemetry=False, weather=False, messages=False) # Laps & Results are enough
            
            # --- RACE RESULTS ---
            results = session.results
            if results is None or results.empty:
                print("   ⚠️ No results data.")
            else:
                results_payload = []
                for _, row in results.iterrows():
                    driver_id = f"{row['Forename']}_{row['Surname']}".lower().replace(" ", "_")
                    team_id = "".join(filter(str.isalnum, str(row['TeamName']).lower()))
                    
                    # Safe conversions
                    pos = int(row['Position']) if pd.notna(row['Position']) else None
                    grid = int(row['GridPosition']) if pd.notna(row['GridPosition']) else None
                    points = float(row['Points']) if pd.notna(row['Points']) else 0.0
                    time_ms = int(row['Time'].total_seconds() * 1000) if pd.notna(row['Time']) else None
                    
                    results_payload.append({
                        "race_id": race_id,
                        "driver_id": driver_id,
                        "team_id": team_id,
                        "position": pos,
                        "grid": grid,
                        "status": str(row['Status']),
                        "points": points,
                        "time_millis": time_ms
                    })
                
                # Bulk Upsert Results
                if results_payload:
                    try:
                        db.supabase.table("race_results").upsert(results_payload).execute()
                        print(f"   ✅ Upserted {len(results_payload)} results.")
                    except Exception as e:
                        print(f"      ⚠️ Result upsert error: {e}")


            # --- LAP TIMES ---
            laps = session.laps
            if laps is None or laps.empty:
                print("   ⚠️ No lap data.")
            else:
                # Optimized Payload Construction
                # We need to map DriverNumber to driver_id first
                # Build a map from DriverNumber -> driver_id
                driver_num_map = {}
                for _, row in results.iterrows():
                     d_id = f"{row['Forename']}_{row['Surname']}".lower().replace(" ", "_")
                     driver_num_map[row['DriverNumber']] = d_id
                
                laps_payload = []
                for _, lap in laps.iterrows():
                    d_num = lap['DriverNumber']
                    if d_num not in driver_num_map:
                        continue # Skip unknown driver
                    
                    driver_id = driver_num_map[d_num]
                    
                    # Safe conversions
                    lap_time = int(lap['LapTime'].total_seconds() * 1000) if pd.notna(lap['LapTime']) else None
                    s1 = int(lap['Sector1Time'].total_seconds() * 1000) if pd.notna(lap['Sector1Time']) else None
                    s2 = int(lap['Sector2Time'].total_seconds() * 1000) if pd.notna(lap['Sector2Time']) else None
                    s3 = int(lap['Sector3Time'].total_seconds() * 1000) if pd.notna(lap['Sector3Time']) else None
                    
                    if not lap_time: continue # Skip partial laps

                    laps_payload.append({
                        "race_id": race_id,
                        "driver_id": driver_id,
                        "lap_number": int(lap['LapNumber']),
                        "lap_time_millis": lap_time,
                        "sector_1_millis": s1,
                        "sector_2_millis": s2,
                        "sector_3_millis": s3,
                        "compound": str(lap['Compound']),
                        "tyre_life": int(lap['TyreLife']) if pd.notna(lap['TyreLife']) else None
                    })
                
                # Chunked Upsert for Laps (can be 1000+)
                if laps_payload:
                    chunk_size = 1000
                    total_laps = len(laps_payload)
                    for i in range(0, total_laps, chunk_size):
                        chunk = laps_payload[i:i + chunk_size]
                        try:
                            # Supabase limits payload size, chunking is safer
                            db.supabase.table("lap_times").upsert(chunk).execute()
                        except Exception as e:
                            print(f"      ⚠️ Lap chunk {i}-{i+chunk_size} error: {e}")
                    
                    print(f"   ✅ Upserted {total_laps} laps.")

        except Exception as e:
            print(f"   ❌ Failed to process race {race_id}: {e}")

    print("\n✅ Phase 2 Ingestion Complete!")

if __name__ == "__main__":
    ingest_race_data()
