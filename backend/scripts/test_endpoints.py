"""Quick endpoint test script for verifying new models work end-to-end."""
import requests

BASE = "http://localhost:8000"

# 1. Test qualifying (POST /api/qualifying/qualify)
print("=" * 50)
print("1. Testing POST /api/qualifying/qualify")
print("=" * 50)
r = requests.post(f"{BASE}/api/qualifying/qualify", json={
    "circuit": "bahrain",
    "grid": "current_2026"
})
print(f"   Status: {r.status_code}")
if r.status_code == 200:
    data = r.json()
    results = data.get("results", [])
    print(f"   Drivers: {len(results)}")
    for i, d in enumerate(results[:5]):
        t = d.get("q3_time") or d.get("q2_time") or d.get("q1_time", "N/A")
        print(f"   P{i+1}: {d['driver']:15s} ({d['team']:20s}) - {t}")
else:
    print(f"   Error: {r.text[:500]}")

# 2. Test simulation with grid
print("\n" + "=" * 50)
print("2. Testing POST /api/simulate/simulate")
print("=" * 50)

sim_payload = {
    "circuit": "bahrain",
    "laps": 57,
    "grid": "current_2026",
}

r2 = requests.post(f"{BASE}/api/simulate/simulate", json=sim_payload)
print(f"   Status: {r2.status_code}")
if r2.status_code == 200:
    sim = r2.json()
    sim_results = sim.get("results", sim.get("driver_results", []))
    print(f"   Result drivers: {len(sim_results)}")
    for i, d in enumerate(sim_results[:5]):
        driver = d.get("driver", d.get("driver_id", "N/A"))
        gap = d.get("gap_to_leader", d.get("gap", "N/A"))
        print(f"   P{i+1}: {str(driver):15s} - Gap: {gap}")
    
    # Check for events
    events = sim.get("events", sim.get("race_events", []))
    print(f"\n   Events: {len(events)}")
    for e in events[:5]:
        print(f"     Lap {e.get('lap', '?')}: {e.get('type', '?')} - {e.get('description', e.get('message', ''))}")
    
    # Check for lap data
    laps = sim.get("lap_data", sim.get("laps", []))
    print(f"   Lap data entries: {len(laps)}")
    
    print(f"\n   Top-level keys: {list(sim.keys())}")
else:
    print(f"   Error: {r2.text[:500]}")

print("\nDone!")
