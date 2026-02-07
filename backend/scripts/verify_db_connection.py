import os
import asyncio
from dotenv import load_dotenv
from supabase import create_client, Client

# Load .env
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(env_path)

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_KEY")

if not url or not key:
    print("Error: Supabase credentials not found in .env")
    exit(1)

def verify_connection():
    print(f"Connecting to {url}...")
    supabase: Client = create_client(url, key)

    # Prepare dummy data
    data = {
        "circuit_id": "test_circuit",
        "session_type": "VERIFICATION",
        "total_laps": 10,
        "winner_driver_id": "TEST_DRIVER"
    }

    try:
        print("Inserting test record into 'simulation_results'...")
        response = supabase.table("simulation_results").insert(data).execute()
        
        # Check response
        # supabase-py v2 returns an object with 'data'
        if response.data and len(response.data) > 0:
            print("Success! Record inserted.")
            print(f"ID: {response.data[0]['id']}")
            
            # Optional: Clean up
            print("Cleaning up test record...")
            del_response = supabase.table("simulation_results").delete().eq("id", response.data[0]['id']).execute()
            print("Cleanup complete.")
            
        else:
            print("Insert failed. Response data empty.")
            print(response)

    except Exception as e:
        print(f"Error connecting or inserting: {e}")
        # Identify common errors
        if "relation \"public.simulation_results\" does not exist" in str(e):
            print("!! CRITICAL: The table does not exist. Manual schema run failed.")
        elif "policy" in str(e):
            print("!! CRITICAL: RLS Policy error.")

if __name__ == "__main__":
    verify_connection()
