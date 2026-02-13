import os
import sys
from dotenv import load_dotenv

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Load .env
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(env_path)

from app.services.database_service import DatabaseService

def reset_database():
    print("  Resetting Historical Database (Clearing All Data)...")
    
    db = DatabaseService()
    if not db.supabase:
        print(" Database connection failed.")
        return

    # Delete in order of dependency (Children first)
    tables = [
        "telemetry",
        "lap_times",
        "race_results",
        "races",      # References seasons, circuits
        "drivers",    # Standalone (referenced by others)
        "teams",      # Standalone
        "circuits",   # Standalone (referenced by races)
        "seasons"     # Standalone (referenced by races)
    ]
    
    for t in tables:
        try:
            # neq("id", "0") is a hack to delete all rows as supabase-py delete() requires a filter
            # or use instance specific filter if PK known. 
            # Ideally: delete().neq("some_col", "impossible_value")? 
            # Actually, to delete all, we can use a filter that matches everything.
            # But Supabase API requires at least one filter for safety usually.
            # Let's use greater than 0-ish filter if ID based?
            # Or use explicit query: DELETE FROM x;
            
            # Since we have the service key, we can use RPC or raw SQL? 
            # But supabase-py logic:
            
            print(f"   Deleting {t}...")
            # For this script we will try to delete where simple condition is true.
            # Most tables have an ID.
            
            if t == "seasons":
                 db.supabase.table(t).delete().gt("year", 0).execute()
            elif t == "circuits":
                 db.supabase.table(t).delete().neq("circuit_id", "xxxx").execute()
            elif "race_results" in t or "telemetry" in t or "lap_times" in t:
                 # High volume: might time out if massive, but we are in dev.
                 # Filter: race_id != 'xxxx'
                 db.supabase.table(t).delete().neq("race_id", "xxxx").execute()
            else:
                 # generic
                 pk_map = {
                     "projects": "id",
                     "teams": "team_id", 
                     "drivers": "driver_id",
                     "races": "race_id"
                 }
                 pk = pk_map.get(t, "id")
                 db.supabase.table(t).delete().neq(pk, "xxxx").execute()
                 
            print(f"    Cleared {t}.")
            
        except Exception as e:
            print(f"   [!] Error clearing {t}: {e}")

    print("\n Database Reset Complete.")

if __name__ == "__main__":
    reset_database()
