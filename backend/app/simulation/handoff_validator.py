from typing import List
from app.schemas.ml_simulation_handoff import MLHandoff

def validate_ml_handoff(handoff_list: List[MLHandoff]) -> None:
    """
    Validates a list of MLHandoff objects for completeness and sanity.
    
    Args:
        handoff_list: List of MLHandoff objects to validate.
        
    Raises:
        ValueError: If any validation check fails.
    """
    if not handoff_list:
        raise ValueError("MLHandoff list cannot be empty.")

    for i, handoff in enumerate(handoff_list):
        driver_id = handoff.driver_id or f"Index {i}"
        
        # Check required fields (Pydantic handles types, but logic might require more)
        if handoff.baseline_lap_time is None:
             raise ValueError(f"Driver {driver_id}: baseline_lap_time is missing.")
             
        # Numeric sanity checks
        if handoff.baseline_lap_time <= 0:
            raise ValueError(f"Driver {driver_id}: baseline_lap_time must be positive, got {handoff.baseline_lap_time}.")
            
        # Check optional fields if they are present
        if handoff.tyre_degradation_slope < 0:
            raise ValueError(f"Driver {driver_id}: tyre_degradation_slope must be non-negative, got {handoff.tyre_degradation_slope}.")

        if hasattr(handoff, 'pace_variance') and handoff.pace_variance < 0:
             raise ValueError(f"Driver {driver_id}: pace_variance must be non-negative.")
             
        if hasattr(handoff, 'initial_tyre_life') and handoff.initial_tyre_life < 0:
             raise ValueError(f"Driver {driver_id}: initial_tyre_life must be non-negative.")

        # Note: If sector paces are provided, they should ideally sum roughly to baseline_lap_time,
        # but exact equality is often too strict due to floating point or model specifics.
        # We'll skip that check for now unless strictly required.
