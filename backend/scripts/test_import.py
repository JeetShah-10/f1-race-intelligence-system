import sys
print("1. Start script", flush=True)
try:
    import fastf1
    print("2. FastF1 imported", flush=True)
except Exception as e:
    print(f"❌ Import failed: {e}", flush=True)

try:
    import pandas as pd
    print("3. Pandas imported", flush=True)
except Exception as e:
    print(f"❌ Pandas import failed: {e}", flush=True)

print("4. Done", flush=True)
