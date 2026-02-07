from fastapi import APIRouter, HTTPException, Query
from app.services.fastf1_service import FastF1Service

router = APIRouter()
fastf1_service = FastF1Service()

@router.get("/", summary="Get F1 Circuits")
async def get_circuits(year: int = 2025):
    """
    Get a list of circuits for a specific season.
    """
    # The schedule contains circuit info
    schedule = fastf1_service.get_schedule(year)
    if not schedule:
        return {"circuits": []}
        
    circuits = []
    for event in schedule:
        # FastF1 schedule event objects usually have Location, CircuitName etc.
        # We extract unique circuits.
        if "Circuit" in event and event["Circuit"] != "":
             # Check if we assume event structure. 
             # For now, return the EventName and Location as proxy for circuits
             circuit_info = {
                 "EventName": event.get("EventName"),
                 "RoundNumber": event.get("RoundNumber"),
                 "Location": event.get("Location"),
                 "Country": event.get("Country"),
                 "Session1Date": event.get("Session1Date")
             }
             circuits.append(circuit_info)
             
    return {"circuits": circuits}
