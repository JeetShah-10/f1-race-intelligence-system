import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).resolve().parent.parent
sys.path.append(str(backend_path))

from app.services.race_predictor_service import RacePredictorService

def verify_predictor():
    print(" Verifying 2026 Race Predictor Service...")
    
    service = RacePredictorService()
    
    # Predict Monaco 2026 (Wet Race)
    result = service.predict_event_2026(
        circuit_id="monaco",
        weather="wet", # High drama
        lap_count=20
    )
    
    # Print Analysis Report
    print("\n" + "="*40)
    print(result["analysis"])
    print("="*40 + "\n")
    
    print(" Prediction Pipeline Verification Complete")

if __name__ == "__main__":
    verify_predictor()
