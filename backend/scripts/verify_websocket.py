import asyncio
import websockets
import json
import os
import sys

# Setup Paths for Schema Imports (needed for validation if we want strict typing, but JSON is enough here)
# We'll just construct the JSON manually to be independent.

async def verify_realtime_stream():
    url = "ws://localhost:8000/ws/simulate"
    print(f"Connecting to {url}...")
    
    # Payload (SimulationRequest)
    start_payload = {
        "circuit_id": "bahrain",
        "year": 2023,
        "lap_count": 10, # Short race for testing
        "track_temp": 30.0,
        "air_temp": 25.0,
        "drivers": [
            {
                "driver": "VER", "team": "Red Bull", "compound": "SOFT", "tyre_life": 0,
                "grid_position": 1, "avg_lap_time": 92.0, "std_lap_time": 0.1, "num_laps": 10, "finished": 1
            },
            {
                "driver": "HAM", "team": "Mercedes", "compound": "MEDIUM", "tyre_life": 0,
                "grid_position": 2, "avg_lap_time": 93.0, "std_lap_time": 0.1, "num_laps": 10, "finished": 1
            }
        ],
        "events": []
    }

    try:
        async with websockets.connect(url) as ws:
            print("Connected! Sending Configuration...")
            await ws.send(json.dumps(start_payload))
            
            print("Listening for updates...")
            async for message in ws:
                data = json.loads(message)
                msg_type = data.get("type")
                
                if msg_type == "LAP_UPDATE":
                    payload = data["data"]
                    lap = payload["lap"]
                    leader = payload["positions"][0]
                    # Find leader gap? It's always 0.
                    # Let's find HAM gap
                    ham_gap = payload["gaps"].get("HAM", 0.0)
                    
                    print(f"   Lap {lap}: Leader={leader}, HAM Gap={ham_gap:.3f}s")
                    
                elif msg_type == "RACE_COMPLETE":
                    print("Race Complete! Results received.")
                    winner = data["results"]["results"][0]["driver_id"]
                    print(f"   Winner: {winner}")
                    break
                    
                elif msg_type == "ERROR":
                    print(f"API Error: {data['message']}")
                    break
                    
    except ConnectionRefusedError:
        print("Connection Refused! Is the server running? (uvicorn app.main:app)")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(verify_realtime_stream())
