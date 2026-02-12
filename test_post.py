import requests
import json

url = "http://localhost:8000/api/predict/event"
payload = {
    "year": 2026,
    "round": 8, # Monaco
    "circuit_id": "monaco",
    "session": "Race",
    "lap_count": 5,
    "track_temp": 30.0,
    "air_temp": 25.0,
    "drivers": [
        {
            "driver": "ver",
            "team": "red_bull",
            "grid_position": 1,
            "compound": "MEDIUM",
            "tyre_life": 0,
            "avg_lap_time": 80.0,
            "std_lap_time": 0.5,
            "num_laps": 0,
            "finished": 0
        }
    ]
}
headers = {
    "Content-Type": "application/json"
}

try:
    response = requests.post(url, json=payload)
    print(f"Status: {response.status_code}")
    print(response.json())
except Exception as e:
    print(f"Error: {e}")
