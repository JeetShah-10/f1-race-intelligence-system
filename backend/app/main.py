from fastapi import FastAPI
from app.api.simulate import router as simulate_router
from app.api.sessions import router as sessions_router
from app.api.standings import router as standings_router
from app.api.drivers import router as drivers_router
from app.api.circuits import router as circuits_router
from app.api.websockets import router as ws_router
from app.api.telemetry import router as telemetry_router
from app.api.predict import router as predict_router
from app.api.strategy import router as strategy_router

app = FastAPI(title="F1 Intelligence System")

# CORS Configuration
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for dev, or specific URLs: ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routers
app.include_router(simulate_router, prefix="/api/simulate", tags=["Simulation"])
app.include_router(ws_router, prefix="/ws", tags=["Real-Time"])
app.include_router(sessions_router, prefix="/api/sessions", tags=["Sessions"])
app.include_router(standings_router, prefix="/api/standings", tags=["Standings"])
app.include_router(drivers_router, prefix="/api/drivers", tags=["Drivers"])
app.include_router(circuits_router, prefix="/api/circuits", tags=["Circuits"])
app.include_router(telemetry_router, prefix="/api/telemetry", tags=["Telemetry"])
app.include_router(predict_router, prefix="/api/predict", tags=["Prediction"])
app.include_router(strategy_router, prefix="/api/strategy", tags=["Strategy"])

@app.get("/health")
def health():
    """Health check endpoint."""
    return {"status": "ok"}