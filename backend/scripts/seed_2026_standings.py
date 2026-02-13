import os
from supabase import create_client, Client

# Configuration
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    # Try to load from .env file if not in env
    try:
        from dotenv import load_dotenv
        load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
        SUPABASE_URL = os.environ.get("SUPABASE_URL")
        SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")
    except Exception:
        pass

if not SUPABASE_URL or not SUPABASE_KEY:
    print(" Error: SUPABASE_URL or SUPABASE_SERVICE_KEY not found.")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# 2026 Driver Roster (22 Drivers)
# Structure: (driver_id, forename, surname, number, team_name, team_id, code)
# Note: team_id should ideally match 'teams' table, but we will focus on seeding 'standings' and 'drivers'.
# We need to ensure 'drivers' table has these drivers first.

drivers_data = [
    # McLaren
    ("lando_norris", "Lando", "Norris", 1, "McLaren", "mclaren", "NOR"),
    ("oscar_piastri", "Oscar", "Piastri", 81, "McLaren", "mclaren", "PIA"),
    
    # Red Bull Racing
    ("max_verstappen", "Max", "Verstappen", 3, "Red Bull Racing", "red_bull", "VER"),
    ("isack_hadjar", "Isack", "Hadjar", 6, "Red Bull Racing", "red_bull", "HAD"),
    
    # Ferrari
    ("charles_leclerc", "Charles", "Leclerc", 16, "Ferrari", "ferrari", "LEC"),
    ("lewis_hamilton", "Lewis", "Hamilton", 44, "Ferrari", "ferrari", "HAM"),
    
    # Mercedes
    ("george_russell", "George", "Russell", 63, "Mercedes", "mercedes", "RUS"),
    ("andrea_kimi_antonelli", "Andrea Kimi", "Antonelli", 12, "Mercedes", "mercedes", "ANT"),
    
    # Williams
    ("alex_albon", "Alex", "Albon", 23, "Williams", "williams", "ALB"),
    ("carlos_sainz", "Carlos", "Sainz", 55, "Williams", "williams", "SAI"),
    
    # Racing Bulls
    ("liam_lawson", "Liam", "Lawson", 30, "Racing Bulls", "rb", "LAW"),
    ("arvid_lindblad", "Arvid", "Lindblad", 27, "Racing Bulls", "rb", "LIN"),
    
    # Aston Martin
    ("fernando_alonso", "Fernando", "Alonso", 14, "Aston Martin", "aston_martin", "ALO"),
    ("lance_stroll", "Lance", "Stroll", 18, "Aston Martin", "aston_martin", "STR"),
    
    # Haas
    ("esteban_ocon", "Esteban", "Ocon", 31, "Haas", "haas", "OCO"),
    ("oliver_bearman", "Oliver", "Bearman", 87, "Haas", "haas", "BEA"),
    
    # Audi
    ("nico_hulkenberg", "Nico", "Hulkenberg", 27, "Audi", "audi", "HUL"),
    ("gabriel_bortoleto", "Gabriel", "Bortoleto", 5, "Audi", "audi", "BOR"),
    
    # Alpine
    ("pierre_gasly", "Pierre", "Gasly", 10, "Alpine", "alpine", "GAS"),
    ("franco_colapinto", "Franco", "Colapinto", 43, "Alpine", "alpine", "COL"),
    
    # Cadillac
    ("valtteri_bottas", "Valtteri", "Bottas", 77, "Cadillac", "cadillac", "BOT"),
    ("sergio_perez", "Sergio", "Perez", 11, "Cadillac", "cadillac", "PER"),
]

def seed():
    print(" Starting 2026 Seeding...")
    
    # 1. Upsert Drivers
    print("Updating Drivers table...")
    for d_id, fore, sur, num, team, t_id, code in drivers_data:
        driver_payload = {
            "driver_id": d_id,
            "forename": fore,
            "surname": sur,
            "number": num,
            "code": code,
            "nationality": "Unknown", # Placeholder
            "url": None
        }
        try:
            # Try to update or insert. Supabase/PostgREST upsert needs explicit header or ON CONFLICT
            res = supabase.table("drivers").upsert(driver_payload).execute()
        except Exception as e:
            print(f"[!] Error upserting driver {d_id}: {e}")

    # 2. Upsert Standings for 2026
    print("Updating Standings table for 2026...")
    
    # Clear existing 2026 standings to avoid duplicates if re-running without unique constraint handling (though we added UNIQUE(driver_id, year))
    # Or just Upsert.
    
    standings_payload = []
    for d_id, fore, sur, num, team, t_id, code in drivers_data:
        standings_payload.append({
            "driver_id": d_id,
            "year": 2026,
            "points": 0,
            "position": 0, # Start at 0 or 1? 0 implies 'no rank yet'.
            "wins": 0,
            "podiums": 0,
            "driver_name": f"{fore} {sur}",
            "driver_number": num,
            "team_name": team
        })
        
    try:
        res = supabase.table("standings").upsert(standings_payload, on_conflict="driver_id, year").execute()
        print(f" Successfully seeded {len(res.data)} standings entries.")
    except Exception as e:
        print(f" Error seeding standings: {e}")

if __name__ == "__main__":
    seed()
