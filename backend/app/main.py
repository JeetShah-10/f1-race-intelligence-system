from fastapi import FastAPI
from app.api.simulate import router as simulate_router

app = FastAPI(title="F1 Intelligence System")

app.include_router(simulate_router)

@app.get("/health")
def health():
    return {"status": "ok"}