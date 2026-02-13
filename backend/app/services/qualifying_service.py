import random
from typing import List, Dict, Any
from app.services.season_config_service import SeasonConfigService
# from app.services.fastf1_service import FastF1Service  # Future integration

class QualifyingService:
    def __init__(self):
        self.config_service = SeasonConfigService()
        
    def get_2026_drivers(self) -> List[Dict[str, Any]]:
        """
        Returns the full list of 22 drivers for the 2026 season.
        Source of truth: frontend/src/data/f1-data.ts
        """
        driver_roster = [
            #  McLaren 
            {"id": "nor", "team": "mclaren"},
            {"id": "pia", "team": "mclaren"},
            #  Red Bull Racing 
            {"id": "ver", "team": "red_bull"},
            {"id": "had", "team": "red_bull"},
            #  Ferrari 
            {"id": "lec", "team": "ferrari"},
            {"id": "ham", "team": "ferrari"},
            #  Mercedes 
            {"id": "rus", "team": "mercedes"},
            {"id": "ant", "team": "mercedes"},
            #  Williams 
            {"id": "alb", "team": "williams"},
            {"id": "sai", "team": "williams"},
            #  Racing Bulls 
            {"id": "law", "team": "rb"},
            {"id": "lin", "team": "rb"},
            #  Aston Martin 
            {"id": "alo", "team": "aston_martin"},
            {"id": "str", "team": "aston_martin"},
            #  Haas 
            {"id": "oco", "team": "haas"},
            {"id": "bea", "team": "haas"},
            #  Audi 
            {"id": "hul", "team": "audi"},
            {"id": "bor", "team": "audi"},
            #  Alpine 
            {"id": "gas", "team": "alpine"},
            {"id": "col", "team": "alpine"},
            #  Cadillac 
            {"id": "bot", "team": "cadillac"},
            {"id": "per", "team": "cadillac"},
        ]
        return driver_roster

    def predict_grid(self, circuit_id: str, weather: str = "dry") -> List[Dict[str, Any]]:
        """
        Predicts the starting grid for a generic 2026 race at the given circuit.
        Returns a list of driver dictionaries sorted by Position 1..22.
        """
        grid = []
        
        # 1. Base Tier Logic for 2026
        tiers = {
            "tier1": 80.0, # seconds
            "tier2": 81.0,
            "tier3": 82.0
        }
        
        # Map Teams to Tiers (2026 Spec)
        team_performance = {
            "red_bull": tiers["tier1"],
            "mclaren": tiers["tier1"],
            "ferrari": tiers["tier1"],
            "mercedes": tiers["tier1"] + 0.2,
            "aston_martin": tiers["tier2"],
            "alpine": tiers["tier2"],
            "williams": tiers["tier2"] + 0.3,
            "rb": tiers["tier2"] + 0.3,
            "haas": tiers["tier3"],
            "audi": tiers["tier3"] + 0.2,
            "cadillac": tiers["tier3"] + 0.4,
        }
        
        driver_roster = self.get_2026_drivers()
        
        qualified_drivers = []
        
        for d in driver_roster:
            # 1. Base Car Performance
            base_perf = team_performance.get(d["team"], 82.0)
            
            # Check for JSON overrides (2026 Spec)
            team_cfg = self.config_service.get_team_config(d["team"])
            if team_cfg:
                base_perf += team_cfg.get("performance_modifiers", {}).get("lap_time_bias", 0.0)
            
            team_perf = base_perf
            driver_perf_mod = 0.0
            
            # Check if this driver has 2026 config
            d_config = self.config_service.get_driver_config(d["id"])
            if d_config:
                mods = d_config.get("performance_modifiers", {})
                driver_perf_mod += mods.get("raw_pace", 0.0)
            else:
                # Fallback tiers for drivers without JSON config
                if d["id"] in ["ver", "nor", "lec", "ham", "alo"]:
                    driver_perf_mod -= 0.3  # Elite bonus
                elif d["id"] in ["str", "lin", "bor", "col"]:
                    driver_perf_mod += 0.3  # Less experienced / slower
            
            # 3. Random Variance (Qualifying run execution)
            variance = random.uniform(-0.15, 0.15)
            
            final_time = team_perf + driver_perf_mod + variance
            
            qualified_drivers.append({
                "driver_id": d["id"],
                "team": d["team"],
                "qualifying_time": round(final_time, 3)
            })
            
        # Sort by time
        qualified_drivers.sort(key=lambda x: x["qualifying_time"])
        
        # Assign Grid Positions
        for i, d in enumerate(qualified_drivers):
            d["position"] = i + 1
            
        return qualified_drivers

if __name__ == "__main__":
    qs = QualifyingService()
    grid = qs.predict_grid("monaco")
    print(" Predicted 2026 Grid (22 Drivers) ")
    for d in grid:
        print(f"P{d['position']}: {d['driver_id'].upper()} ({d['team']}) - {d['qualifying_time']}s")
