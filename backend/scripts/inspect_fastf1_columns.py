import fastf1
import pandas as pd

def inspect():
    import os
    # Use absolute path relative to this script
    CACHE_DIR = os.path.join(os.path.dirname(__file__), '..', 'cache', 'fastf1')
    os.makedirs(CACHE_DIR, exist_ok=True)
    fastf1.Cache.enable_cache(CACHE_DIR)
    print("1. Getting session...")
    try:
        session = fastf1.get_session(2025, 1, 'R')
        print("2. Session found. Loading...")
        session.load(telemetry=False, weather=False, messages=False)
        print("3. Session loaded.")
        
        if session.results is None or session.results.empty:
            print("⚠️ Session results are empty.")
            return

        cols = session.results.columns.tolist()
        print(f"\n📊 Available Columns: {cols}")
        
        with open("backend/scripts/debug_columns.txt", "w") as f:
            f.write(str(cols))
            f.write("\n\nFirst Row:\n")
            f.write(str(session.results.iloc[0].to_dict()))
            
        print("✅ Columns written to backend/scripts/debug_columns.txt")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("🚀 Starting inspection...")
    inspect()
