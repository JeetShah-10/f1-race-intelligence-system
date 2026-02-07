import os
import sys
from dotenv import load_dotenv

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Load .env
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(env_path)

from app.services.database_service import DatabaseService

def verify_phase3_schema():
    print("🔍 Verifying Phase 3 Schema (Telemetry)...")
    
    db = DatabaseService()
    if not db.supabase:
        print("❌ Database connection failed.")
        return

    try:
        # Try to select from 'telemetry'
        response = db.supabase.table("telemetry").select("*").limit(1).execute()
        print("✅ Table 'telemetry' is accessible.")
    except Exception as e:
        print(f"❌ Table 'telemetry' verification failed: {e}")
        if "relation" in str(e) and "does not exist" in str(e):
             print("   >> The SQL script for Phase 3 needs to be run.")
        else:
             print("   >> This might be a permission issue or something else.")

if __name__ == "__main__":
    verify_phase3_schema()
