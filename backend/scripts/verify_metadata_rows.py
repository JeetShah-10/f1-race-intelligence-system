import os
import sys
from dotenv import load_dotenv

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Load .env
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(env_path)

from app.services.database_service import DatabaseService

def verify_counts():
    print("Verifying Metadata Ingestion Counts (2025 Focus)...")
    
    db = DatabaseService()
    if not db.supabase:
        print("Database connection failed.")
        return

    tables = ["seasons", "circuits", "teams", "drivers", "races"]
    
    for t in tables:
        try:
            # count='exact' is supported in recent supabase-py or via select with count
            res = db.supabase.table(t).select("*", count="exact").execute()
            count = res.count if res.count is not None else len(res.data)
            print(f"   {t}: {count} rows")
            
            # Print sample to confirm it's 2025 data
            if count > 0 and t == "seasons":
                 print(f"      Sample: {res.data[0]}")
        except Exception as e:
            print(f"   Could not count {t}: {e}")

if __name__ == "__main__":
    verify_counts()
