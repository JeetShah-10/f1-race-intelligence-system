import json
import os
from typing import Dict, Any, Optional

class SeasonConfigService:
    def __init__(self, config_path: str = "backend/app/config/2026_season.json"):
        # Resolve path relative to backend root if needed
        if not os.path.isabs(config_path):
            root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            self.config_path = os.path.join(root_dir, "app", "config", "2026_season.json")
        else:
            self.config_path = config_path
            
        self.config = self._load_config()
        self.teams_map = {t["id"]: t for t in self.config.get("teams", [])}
        self.drivers_map = {d["id"]: d for d in self.config.get("drivers", [])}
        self.drivers_by_code = {d["code"]: d for d in self.config.get("drivers", [])}

    def _load_config(self) -> Dict[str, Any]:
        try:
            with open(self.config_path, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading 2026 config: {e}")
            return {}

    def get_driver_config(self, driver_id_or_code: str) -> Optional[Dict[str, Any]]:
        """
        Get 2026 configuration for a driver (including new rookies).
        """
        driver_id_or_code = driver_id_or_code.lower()
        if driver_id_or_code in self.drivers_map:
            return self.drivers_map[driver_id_or_code]
        
        # Try finding by code (e.g. LIN, ANT)
        upper_code = driver_id_or_code.upper()
        if upper_code in self.drivers_by_code:
            return self.drivers_by_code[upper_code]
            
        return None

    def get_team_config(self, team_id: str) -> Optional[Dict[str, Any]]:
        """
        Get 2026 configuration for a team (including Audi/Cadillac).
        """
        return self.teams_map.get(team_id.lower())

    def get_archetype_driver(self, driver_id_or_code: str) -> Optional[str]:
        """
        Returns the historical driver ID to use for modeling this new driver.
        Example: 'Lindblad' -> 'Lawson'
        """
        cfg = self.get_driver_config(driver_id_or_code)
        if cfg:
            return cfg.get("archetype")
        return None  # If not found, implies it's an existing driver (use self)

    def get_archetype_team(self, team_id: str) -> Optional[str]:
        """
        Returns the historical team ID to use for modeling this new team.
        Example: 'Audi' -> 'Sauber'
        """
        cfg = self.get_team_config(team_id)
        if cfg:
            return cfg.get("archetype")
        return None
        
    def get_performance_modifiers(self, entity_id: str, type: str = 'driver') -> Dict[str, float]:
        """
        Get performance modifiers (lap_time_bias, etc.)
        """
        if type == 'driver':
            cfg = self.get_driver_config(entity_id)
        else:
            cfg = self.get_team_config(entity_id)
            
        if cfg:
            return cfg.get("performance_modifiers", {})
        return {}
