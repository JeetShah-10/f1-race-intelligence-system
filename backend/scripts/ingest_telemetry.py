import os
import sys
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
TELEMETRY_BATCH_SIZE = 5000

def setup_fastf1():
    os.makedirs(CACHE_DIR, exist_ok=True)
    fastf1.Cache.enable_cache(CACHE_DIR)

def ingest_telemetry():
    print(" Starting Phase 3: Telemetry Ingestion (High Volume)...")
    setup_fastf1()
    
    db = DatabaseService()
    if not db.supabase:
        print(" Database connection failed.")
        return

    # 1. Get Races
    try:
        races_db = db.supabase.table("races").select("race_id, year, round, name").execute().data
        print(f" Found {len(races_db)} races. Limiting to 1 for VERIFICATION.")
        races_db = races_db[:1]
    except Exception as e:
        print(f" Failed to fetch races: {e}")
        return

    for race_meta in races_db:
        year = race_meta['year']
        round_num = race_meta['round']
        race_id = race_meta['race_id']
        name = race_meta['name']
        
        print(f"\nProcessing {year} Round {round_num}: {name}")

        try:
            session = fastf1.get_session(year, round_num, 'R')
            session.load(weather=False, messages=False) # Helper: Need telemetry=True (default)
            
            laps = session.laps
            if laps is None or laps.empty: continue

            # Process per driver to avoid massive memory usage
            drivers = list(session.results['DriverNumber'].unique())
            
            # Helper to safely get name
            def get_driver_id(row):
                 if 'Forename' in row and 'Surname' in row:
                      return f"{row['Forename']}_{row['Surname']}".lower().replace(" ", "_")
                 elif 'FullName' in row:
                      return row['FullName'].lower().replace(" ", "_")
                 return f"driver_{row['DriverNumber']}"

            driver_num_map = {}
            for _, row in session.results.iterrows():
                 driver_num_map[row['DriverNumber']] = get_driver_id(row)
            
            for drv_num in drivers:
                if drv_num not in driver_num_map: continue
                driver_id = driver_num_map[drv_num]
                
                try:
                    # Get telemetry for all laps of this driver
                    d_laps = laps.pick_driver(drv_num)
                    # We can get telemetry for the whole session or per lap. 
                    # Per lap is safer for linking lap_number if needed.
                    
                    # Optimization: Get all telemetry at once? 
                    # car_data = d_laps.get_car_data() # This misses timestamp sync sometimes
                    # telemetry = d_laps.get_telemetry() # Includes distance, time, etc.
                    
                    telemetry = d_laps.get_telemetry()
                    
                    if telemetry is None or telemetry.empty: continue
                    
                    # Prepare batch
                    batch = []
                    
                    for _, row in telemetry.iterrows():
                        # FastF1 telemetry 'Date' is the timestamp
                        if 'Date' not in row or pd.isna(row['Date']): continue
                        
                        # Find lap number? Complex match. 
                        # For MVP, we skip explicit 'lap_number' link in telemetry table unless critical.
                        # We just store the stream.
                        
                        ts = row['Date']
                        
                        batch.append({
                            "race_id": race_id,
                            "driver_id": driver_id,
                            "date": ts.isoformat(),
                            "speed": int(row['Speed']) if pd.notna(row['Speed']) else 0,
                            "rpm": int(row['RPM']) if pd.notna(row['RPM']) else 0,
                            "throttle": int(row['Throttle']) if pd.notna(row['Throttle']) else 0,
                            "brake": bool(row['Brake']) if pd.notna(row['Brake']) else False,
                            "gear": int(row['nGear']) if pd.notna(row['nGear']) else 0,
                            "drs": int(row['DRS']) if pd.notna(row['DRS']) else 0
                        })
                        
                        if len(batch) >= TELEMETRY_BATCH_SIZE:
                            try:
                                db.supabase.table("telemetry").upsert(batch).execute()
                                print(f"       Upserted {len(batch)} pts for {driver_id}")
                                batch = []
                            except Exception as e:
                                print(f"      [!] Batch insert error: {e}")
                                batch = [] # discard failed batch to continue?
                    
                    # Final batch
                    if batch:
                        try:
                            db.supabase.table("telemetry").upsert(batch).execute()
                            print(f"       Upserted {len(batch)} pts for {driver_id}")
                        except Exception as e:
                            print(f"      [!] Final batch error: {e}")

                except Exception as e:
                    print(f"   [!] Driver {driver_id} tel error: {e}")

        except Exception as e:
            print(f"    Race error: {e}")

    print("\n Phase 3 Ingestion Complete!")

if __name__ == "__main__":
    ingest_telemetry()
