from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List
import asyncio
import json
import traceback

from app.schemas.simulation import SimulationRequest
from app.simulation.race_engine import RaceEngine
from app.simulation.simulation_context import SimulationContext
from app.services.prediction_service import PredictionService

router = APIRouter()

# Store active connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_json(self, message: dict, websocket: WebSocket):
        await websocket.send_json(message)

manager = ConnectionManager()
prediction_service = PredictionService()

@router.websocket("/ws/race")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        data = await websocket.receive_text()
        req_data = json.loads(data)
        
        # Parse Request
        simulation_request = SimulationRequest(**req_data)
        
        # 1. Get ML Data + Model
        ml_handoff = prediction_service.get_simulation_handoff(simulation_request)
        pace_model = prediction_service.get_pace_model()  # <--- INJECTED
        
        # 2. Build Context
        ctx = SimulationContext(
            drivers=simulation_request.drivers,
            weather=simulation_request.event_config.weather if simulation_request.event_config else "dry",
            circuit=simulation_request.circuit_id,
            year=2024,
            lap_count=simulation_request.laps,
            track_temp=simulation_request.track_temp,
            air_temp=simulation_request.air_temp,
            ml_handoff=ml_handoff,
            pace_model=pace_model # <--- INJECTED
        )
        
        # 3. Initialize Engine
        engine = RaceEngine(ctx)
        
        # 4. Stream Laps
        for snapshot in engine.stream():
            # Convert Snapshot to JSON-friendly dict
            # We need to map the internal snapshot to the WebSocket message format
            # New format: { "type": "LAP_UPDATE", "lap": X, "drivers": [...] }
            
            drivers_data = []
            sorted_driver_ids = snapshot.driver_positions
            
            for d_id in sorted_driver_ids:
                drivers_data.append({
                    "driver_id": d_id,
                    "position": sorted_driver_ids.index(d_id) + 1,
                    "gap_to_leader": snapshot.gaps_to_leader.get(d_id, 0.0),
                    "interval": snapshot.intervals.get(d_id, 0.0),
                    "last_lap_time": snapshot.lap_times.get(d_id, 0.0),
                    "sector_times": snapshot.sector_times.get(d_id, []),
                    "tyre_compound": snapshot.tyre_compounds.get(d_id, ""),
                    "tyre_age": snapshot.tyre_ages.get(d_id, 0),
                    "pit_stops": snapshot.pit_stop_counts.get(d_id, 0)
                })

            msg = {
                "type": "LAP_UPDATE",
                "lap": snapshot.lap_number,
                "sc_status": snapshot.sc_status, 
                "weather": snapshot.weather,
                "track_temp": snapshot.track_temp,
                "drivers": drivers_data,
                "dnf": snapshot.dnf_this_lap
            }
            
            await manager.send_json(msg, websocket)
            
            # Simple throttle to control animation speed
            await asyncio.sleep(0.1)

        # 5. Finalize
        final_results = engine.final_results()
        await manager.send_json({
            "type": "RACE_COMPLETE",
            "results": final_results
        }, websocket)
        
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WS Error: {e}")
        traceback.print_exc()
        await manager.send_json({"type": "ERROR", "message": str(e)}, websocket)
        manager.disconnect(websocket)
