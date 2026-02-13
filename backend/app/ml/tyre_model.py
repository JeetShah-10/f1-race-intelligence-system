import numpy as np
import pandas as pd
from typing import Dict, Optional, Tuple
from dataclasses import dataclass, field
from enum import Enum
import logging

logger = logging.getLogger(__name__)

class TyreCategory(Enum):
    SLICK = "SLICK"
    INTER = "INTER"
    WET = "WET"

class TrackCondition(Enum):
    DRY = "DRY"
    DAMP = "DAMP"
    WET = "WET"

@dataclass
class TyreProfile:
    name: str
    category: TyreCategory
    degradation_rate: float
    reset_pace: float
    warmup_laps: int
    max_analysis_laps: Optional[int]
    max_degradation: float

@dataclass
class StateSpaceConfig:    
    sigma_epsilon: float = 0.3
    sigma_eta: float = 0.1
    
    fuel_effect_prior: float = 0.032
    starting_fuel: float = 110.0
    fuel_burn_rate: float = 1.6
    
    enable_warmup: bool = True
    enable_track_abrasion: bool = True  
    
    debug_logging: bool = False
    
    # Mismatch penalties (Seconds per lap penalty)
    mismatch_penalties: Dict[Tuple[TyreCategory, TrackCondition], float] = field(default_factory=lambda: {
        (TyreCategory.SLICK, TrackCondition.DAMP): 2.0,
        (TyreCategory.SLICK, TrackCondition.WET): 8.0,
        
        (TyreCategory.INTER, TrackCondition.DRY): 1.5,
        (TyreCategory.INTER, TrackCondition.WET): 0.5,
        
        (TyreCategory.WET, TrackCondition.DRY): 4.0,
        (TyreCategory.WET, TrackCondition.DAMP): 1.0,
        
        (TyreCategory.SLICK, TrackCondition.DRY): 0.0,
        (TyreCategory.INTER, TrackCondition.DAMP): 0.0,
        (TyreCategory.WET, TrackCondition.WET): 0.0,
    })

class BayesianTyreModel:
    """
    Universal Bayesian state-space model for tyre degradation with track abrasion.
    Adapted from IAmTomShaw/f1-race-replay.
    """
    
    def __init__(self, config: Optional[StateSpaceConfig] = None):
        self.config = config or StateSpaceConfig()
        
        # Default profiles - can be tuned per track if needed
        self.tyre_profiles: Dict[str, TyreProfile] = {
            'HARD': TyreProfile('HARD', TyreCategory.SLICK, 0.015, 69.5, 3, None, 2.0),
            'MEDIUM': TyreProfile('MEDIUM', TyreCategory.SLICK, 0.035, 69.0, 3, None, 2.0),
            'SOFT': TyreProfile('SOFT', TyreCategory.SLICK, 0.060, 68.5, 1, 10, 2.0),
            'INTERMEDIATE': TyreProfile('INTERMEDIATE', TyreCategory.INTER, 0.04, 75.0, 2, None, 3.0),
            'WET': TyreProfile('WET', TyreCategory.WET, 0.02, 80.0, 2, None, 2.5),
        }
        
        self.fuel_effect = self.config.fuel_effect_prior
        self.sigma_epsilon = self.config.sigma_epsilon
        self.sigma_eta = self.config.sigma_eta
        self.track_abrasion = 1.0
        self._fitted = False

    def _get_base_degradation(self, compound: str) -> float:
        if compound not in self.tyre_profiles:
            return 0.05
        return self.tyre_profiles[compound].degradation_rate

    def predict_next_lap(
        self,
        driver_id: str,
        current_lap: int,
        compound: str,
        laps_on_tyre: int,
        track_condition: str = "DRY",
        skip_fuel_penalty: bool = False,
    ) -> Tuple[float, float, Dict]:
        """
        Predict the lap time components for the next lap.
        Returns: (predicted_pace, std_dev, info_dict)
        
        Args:
            skip_fuel_penalty: When True, omit fuel mass effect from prediction.
                Set True when ML models (Method A/B) are active, since they
                already account for fuel effects in their training data.
                Prevents the double-counting that causes inflated lap times.
        """
        if compound not in self.tyre_profiles:
            # Fallback for unknown compound
            return 80.0, 1.0, {}

        tyre = self.tyre_profiles[compound]
        
        # 1. Degradation Component
        abrasion_factor = self.track_abrasion
        if tyre.category == TyreCategory.WET:
            abrasion_factor = 1.0 + 0.3 * (self.track_abrasion - 1.0)
            
        effective_deg = tyre.degradation_rate * abrasion_factor
        
        # Linear degradation model for simulation state
        # pace = base_pace + (laps * deg)
        deg_penalty = (laps_on_tyre - 1) * effective_deg
        
        # 2. Fuel Component (skip when ML is handling fuel effects)
        fuel_penalty = 0.0
        current_fuel = max(0, self.config.starting_fuel - (current_lap - 1) * self.config.fuel_burn_rate)
        if not skip_fuel_penalty:
            fuel_penalty = current_fuel * self.fuel_effect
        
        # 3. Warmup Component
        warmup_penalty = 0.0
        if self.config.enable_warmup and laps_on_tyre <= tyre.warmup_laps:
             warmup_max = 0.3 if tyre.category == TyreCategory.SLICK else 0.2
             warmup_penalty = warmup_max * (1 - (laps_on_tyre - 1) / tyre.warmup_laps)

        # 4. Mismatch Penalty
        cond_enum = TrackCondition.DRY
        if track_condition.upper() == "WET": cond_enum = TrackCondition.WET
        elif track_condition.upper() == "DAMP": cond_enum = TrackCondition.DAMP
            
        mismatch_penalty = self.config.mismatch_penalties.get((tyre.category, cond_enum), 0.0)

        # Total predicted impact (relative to a "perfect" baseline lap)
        # We don't predict absolute lap time here, but the *variable components*
        predicted_impact = deg_penalty + fuel_penalty + warmup_penalty + mismatch_penalty
        
        uncertainty = np.sqrt(self.sigma_eta**2 + self.sigma_epsilon**2)
        
        info = {
            'deg_penalty': deg_penalty,
            'fuel_penalty': fuel_penalty,
            'warmup_penalty': warmup_penalty,
            'mismatch_penalty': mismatch_penalty,
            'effective_deg': effective_deg,
            'tyre_health': max(0, 100 - (laps_on_tyre * effective_deg * 20)), # approx health metric
            'fuel_skipped': skip_fuel_penalty,
        }
        
        return predicted_impact, uncertainty, info
