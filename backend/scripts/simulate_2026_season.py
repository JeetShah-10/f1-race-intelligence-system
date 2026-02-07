import sys
from pathlib import Path
from typing import Dict, List, Any

# Add backend to path
backend_path = Path(__file__).resolve().parent.parent
sys.path.append(str(backend_path))

from app.services.race_predictor_service import RacePredictorService
from app.analysis.race_analyzer import RaceAnalyzer

# F1 2026 Projected Calendar (Generic)
# [Circuit Key, Feature]
CALENDAR = [
    ("bahrain", "dry"), ("jeddah", "dry"), ("melbourne", "dry"), ("suzuka", "dry"),
    ("shanghai", "dry"), ("miami", "dry"), ("monaco", "dry"), ("montreal", "wet"),
    ("barcelona", "dry"), ("austria", "dry"), ("silverstone", "rain"), ("hungary", "dry"),
    ("spa", "wet"), ("zandvoort", "dry"), ("monza", "dry"), ("baku", "dry"),
    ("singapore", "wet"), ("austin", "dry"), ("mexico", "dry"), ("brazil", "rain"),
    ("las_vegas", "dry"), ("qatar", "dry"), ("abudhabi", "dry")
]

POINTS_SYSTEM = {1: 25, 2: 18, 3: 15, 4: 12, 5: 10, 6: 8, 7: 6, 8: 4, 9: 2, 10: 1}

def simulate_season():
    predictor = RacePredictorService()
    
    # Season State
    standings = {} # Driver ID -> Points
    constructor_standings = {} # Team ID -> Points
    race_results_log = []
    
    print(f"🚀 Starting 2026 Season Simulation ({len(CALENDAR)} Races)")
    
    for round_num, (circuit, weather) in enumerate(CALENDAR, 1):
        print(f"\n--- Round {round_num}: {circuit.upper()} ({weather}) ---")
        
        # Run Race Event
        # Lower lap count to speed up simulation, but enough for variability
        event_result = predictor.predict_event_2026(
            circuit_id=circuit,
            weather=weather,
            lap_count=20 
        )
        
        # Analyze Points
        results = event_result["race_result"]["results"]
        winner = results[0]
        print(f"   🏆 Winner: {winner['driver_id'].upper()}")
        
        # Log Result
        race_results_log.append({
            "round": round_num,
            "circuit": circuit,
            "winner": winner['driver_id'],
            "podium": [r['driver_id'] for r in results[:3]]
        })
        
        # Update Standings
        for d in results:
            pos = d["position"]
            pts = POINTS_SYSTEM.get(pos, 0)
            
            # WDC
            d_id = d["driver_id"]
            standings[d_id] = standings.get(d_id, 0) + pts
            
            # WCC
            t_id = d["team"]
            constructor_standings[t_id] = constructor_standings.get(t_id, 0) + pts

    # Final Report
    print("\n" + "="*40)
    print("🏆 2026 WORLD CHAMPIONSHIP STANDINGS 🏆")
    print("="*40)
    
    # Sort WDC
    wdc_sorted = sorted(standings.items(), key=lambda x: x[1], reverse=True)
    for i, (d, pts) in enumerate(wdc_sorted, 1):
        print(f"{i}. {d.upper()}: {pts} pts")
        
    print("\n🏆 CONSTRUCTORS STANDINGS")
    wcc_sorted = sorted(constructor_standings.items(), key=lambda x: x[1], reverse=True)
    for i, (t, pts) in enumerate(wcc_sorted, 1):
        print(f"{i}. {t.upper()}: {pts} pts")
        
    # Generate Artifact
    generate_markdown_report(wdc_sorted, wcc_sorted, race_results_log)

def generate_markdown_report(wdc, wcc, logs):
    lines = []
    lines.append("# 🏆 2026 F1 World Championship Report")
    lines.append("## Executive Summary")
    lines.append(f"**World Champion**: {wdc[0][0].upper()} ({wdc[0][1]} pts)")
    lines.append(f"**Constructors Champion**: {wcc[0][0].upper()} ({wcc[0][1]} pts)")
    
    lines.append("\n## 📋 Drivers Standings")
    lines.append("| Pos | Driver | Points |")
    lines.append("| :--- | :--- | :--- |")
    for i, (d, pts) in enumerate(wdc, 1):
         lines.append(f"| {i} | {d.upper()} | {pts} |")

    lines.append("\n## 🏎️ Constructors Standings")
    lines.append("| Pos | Team | Points |")
    lines.append("| :--- | :--- | :--- |")
    for i, (t, pts) in enumerate(wcc, 1):
         lines.append(f"| {i} | {t.upper()} | {pts} |")
         
    lines.append("\n## 🏁 Race Results")
    lines.append("| Round | Circuit | Winner | Podium |")
    lines.append("| :--- | :--- | :--- | :--- |")
    for r in logs:
        podium_str = ", ".join([p.upper() for p in r['podium']])
        lines.append(f"| {r['round']} | {r['circuit'].capitalize()} | {r['winner'].upper()} | {podium_str} |")
        
    # Save to local file for retrieval
    out_path = Path("backend/2026_season_results.md")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"\nReport generated at {out_path}")

if __name__ == "__main__":
    simulate_season()
