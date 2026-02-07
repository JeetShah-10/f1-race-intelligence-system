import os
import sys
from dotenv import load_dotenv

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Load .env
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(env_path)

from app.services.database_service import DatabaseService

def verify_schema_existence():
    print("🔍 Verifying Metadata Schema...")
    
    db = DatabaseService()
    if not db.supabase:
        print("❌ Database connection failed.")
        return

    try:
        # Try to select from 'seasons'
        # Even if empty, it should not throw "relation does not exist"
        response = db.supabase.table("seasons").select("*").limit(1).execute()
        print("✅ Table 'seasons' is accessible.")
        print(f"   Data: {response.data}")
    except Exception as e:
        print(f"❌ Table verification failed: {e}")
        if "relation" in str(e) and "does not exist" in str(e):
             print("   >> The SQL script definitely needs to be run (excluding the policy creation if needed).")
        else:
             print("   >> This might be a permission issue or something else.")

if __name__ == "__main__":
    verify_schema_existence()
