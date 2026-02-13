import os
import sys
from dotenv import load_dotenv

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Load .env
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(env_path)

from app.services.database_service import DatabaseService

def verify_phase2_schema():
    print(" Verifying Phase 2 Schema (Race Results & Laps)...")
    
    db = DatabaseService()
    if not db.supabase:
        print(" Database connection failed.")
        return

    tables = ["race_results", "lap_times"]
    all_good = True

    for t in tables:
        try:
            # Try to select from table
            response = db.supabase.table(t).select("*").limit(1).execute()
            print(f" Table '{t}' is accessible.")
        except Exception as e:
            print(f" Table '{t}' verification failed: {e}")
            if "relation" in str(e) and "does not exist" in str(e):
                 print(f"   >> The SQL script for Phase 2 needs to be run for table {t}.")
            all_good = False

    if all_good:
        print("\n Phase 2 Schema is READY.")
    else:
        print("\n Phase 2 Schema has issues.")

if __name__ == "__main__":
    verify_phase2_schema()
