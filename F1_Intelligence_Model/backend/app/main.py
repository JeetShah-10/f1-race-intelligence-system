# F1_Intelligence_Model/backend/app/main.py

from fastapi import FastAPI

# Create an instance of the FastAPI class
app = FastAPI(
    title="F1 Intelligence Model API",
    description="API for providing F1 race predictions and data.",
    version="0.1.0",
)

@app.get("/")
def read_root():
    """
    Root endpoint for the API.
    Returns a welcome message.
    """
    return {"message": "Welcome to the F1 Intelligence Model API!"}

# A simple health check endpoint to confirm the API is running.
@app.get("/health")
def health_check():
    """
    Health check endpoint.
    Returns a status of 'ok' if the API is running.
    """
    return {"status": "ok"}
