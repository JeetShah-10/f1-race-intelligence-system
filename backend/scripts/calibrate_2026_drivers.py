import fastf1
import numpy as np
import json
import os

# Setup Cache
if not os.path.exists('cache'):
    os.makedirs('cache')
fastf1.Cache.enable_cache('cache')

def get_driver_stats(driver_code, year=2024):
    """
    Fetches aggregate stats for a driver from a season.
    Returns: { 'raw_pace': float, 'consistency': float }
    """
    print(f" Analyzing {driver_code} ({year})...")
    
    # We'll sample 5 representative races to be concise but accurate
    # Bahrain, Suzuka, Silverstone, Monza, Abu Dhabi
    rounds = [1, 4, 12, 16, 24] 
    pace_deficits = []
    consistency_scores = []
    
    for r in rounds:
        try:
            session = fastf1.get_session(year, r, 'R')
            session.load(telemetry=False, laps=True, weather=False)
            
            laps = session.laps.pick_driver(driver_code)
            winner = session.laps.pick_driver(session.results.iloc[0]['Abbreviation'])
            
            if laps.empty:
                continue
                
            # Filter valid laps
            clean_laps = laps.pick_quicklaps().pick_track_status('1').dropna(subset=['LapTime'])
            winner_laps = winner.pick_quicklaps().pick_track_status('1').dropna(subset=['LapTime'])
            
            if clean_laps.empty or winner_laps.empty:
                continue
                
            # 1. Calculate Pace Deficit (vs Winner's Median)
            my_median = clean_laps['LapTime'].dt.total_seconds().median()
            winner_median = winner_laps['LapTime'].dt.total_seconds().median()
            
            if np.isnan(my_median) or np.isnan(winner_median):
                continue
                
            # Percent deficit (e.g., 1.02 = 2% slower)
            deficit = (my_median / winner_median) - 1.0
            pace_deficits.append(deficit)
            
            # 2. Calculate Consistency (Std Dev of Lap Times)
            # Lower is better. 
            std_dev = clean_laps['LapTime'].dt.total_seconds().std()
            
            # Normalize 0..1 (0=Robot, 1=Erratic)
            # Typical F1 std dev is 0.2s - 1.5s
            # Map 0.2 -> 1.0, 1.5 -> 0.0
            score = max(0.0, min(1.0, 1.0 - (std_dev - 0.2) / 1.5))
            consistency_scores.append(score)
            
        except Exception as e:
            print(f"   [!]  Skipping round {r}: {e}")
            continue
            
    if not pace_deficits:
        return {'raw_pace': 0.1, 'consistency': 0.8} # Default fallback
        
    avg_pace = np.mean(pace_deficits)
    avg_consistency = np.mean(consistency_scores)
    
    # Scale Pace for our Engine (Our engine uses seconds-ish modifiers)
    # 0.01 deficit (1%) ~ +0.8s on a 80s lap
    # We want a modifier around -0.1 to +0.2
    # Let's map 0% -> -0.1, 1% -> 0.05, 2% -> 0.2
    final_pace_mod = (avg_pace * 10) - 0.1
    
    return {
        'raw_pace': round(final_pace_mod, 3),
        'consistency': round(avg_consistency, 2)
    }

def main():
    print("  Calibrating 2026 Drivers...")
    
    # 1. Real Data Extraction
    perez_stats = get_driver_stats("PER", 2024)
    bottas_stats = get_driver_stats("BOT", 2024)
    
    # 2. Proxy Data Extraction (Lindblad -> Piastri 2023 Rookie Season as Proxy)
    # Lindblad is a high-potential rookie, similar hype to Piastri?
    print(" Using PIA (2023) as proxy for Arvid Lindblad...")
    lindblad_stats = get_driver_stats("PIA", 2023)
    
    # 3. Construct Cadillac Team Stats
    # Aggregate of drivers + New Team Penalty
    cadillac_reliability = 0.82 # New entry
    cadillac_pace_bias = (perez_stats['raw_pace'] + bottas_stats['raw_pace']) / 2 + 0.3 # +0.3s drag for new car
    
    print("\n CALIBRATION RESULTS:")
    print(f"PER (Perez): {perez_stats}")
    print(f"BOT (Bottas): {bottas_stats}")
    print(f"LIN (Lindblad/PIA Proxy): {lindblad_stats}")
    print(f"Cadillac Team: Pace Bias={cadillac_pace_bias:.3f}, Reliability={cadillac_reliability}")

    # Generate JSON Snippet
    print("\n JSON Configuration to Apply:")
    
    updates = {
        "per": {
            "performance_modifiers": perez_stats
        },
        "bot": {
            "performance_modifiers": bottas_stats
        },
        "lin": {
            "performance_modifiers": lindblad_stats
        },
        "cadillac_team": {
            "performance_modifiers": {
                "lap_time_bias": round(cadillac_pace_bias, 3),
                "reliability_score": cadillac_reliability
            }
        }
    }
    
    print(json.dumps(updates, indent=4))

if __name__ == "__main__":
    main()
