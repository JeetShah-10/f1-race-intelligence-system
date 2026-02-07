import asyncio
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.simulation.simulation_context import SimulationContext
from app.simulation.race_engine import RaceEngine
from app.schemas.simulation import SimulationRequest
from app.services.prediction_service import PredictionService

router = APIRouter()
prediction_service = PredictionService()

@router.websocket("/simulate")
async def websocket_simulate(websocket: WebSocket):
    """
    Real-Time Race Simulation Stream.
    Protocol:
    1. Client connects.
    2. Client sends JSON SimulationRequest.
    3. Server streams Lap Updates (JSON).
    4. Server sends "FINISHED" message.
    """
    await websocket.accept()
    
    try:
        # 1. Wait for Configuration
        data = await websocket.receive_text()
        req_dict = json.loads(data)
        
        # Validate Request
        request = SimulationRequest(**req_dict)
        print(f"📡 WS: Starting Simulation for {request.circuit_id}")

        # 2. Setup Engine (Same as Batch API)
        ml_handoffs = prediction_service.get_simulation_handoff(request)
        
        ctx = SimulationContext(
            circuit=request.circuit_id,
            year=request.year,
            drivers=request.drivers,
            weather="Sunny",
            track_temp=request.track_temp,
            air_temp=request.air_temp,
            lap_count=request.lap_count,
            ml_handoff=ml_handoffs
        )
        
        engine = RaceEngine(ctx)
        
        # 3. Register Custom Events if any
        for evt in request.events:
            if evt.type == "SC":
                from app.simulation.events import SafetyCarEvent
                engine.event_manager.register_event(SafetyCarEvent(evt.start_lap, evt.duration))

        # 4. Stream Loop
        for snapshot in engine.stream():
            # Format Snapshot for Client
            # Only sending essential visual data to keep frame size low
            lap_data = {
                "lap": snapshot.lap_number,
                "positions": snapshot.driver_positions,
                "gaps": snapshot.gaps_to_leader,
                "times": snapshot.lap_times
            }
            
            await websocket.send_json({
                "type": "LAP_UPDATE",
                "data": lap_data
            })
            
            # Artificial Delay for UX (Fast Motion)
            await asyncio.sleep(0.2) # 5 Laps per second
            
        # 5. Finish
        final_results = engine.final_results()
        await websocket.send_json({
            "type": "RACE_COMPLETE",
            "results": final_results
        })
        
        print("📡 WS: Simulation Complete")
        await websocket.close()

    except WebSocketDisconnect:
        print("📡 WS: Client Disconnected")
    except Exception as e:
        print(f"❌ WS Error: {e}")
        # Try to send error if still connected
        try:
            await websocket.send_json({"type": "ERROR", "message": str(e)})
            await websocket.close()
        except:
            pass
