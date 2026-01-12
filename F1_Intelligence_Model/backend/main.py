# main.py
# This is the main entry point for our FastAPI application.

from fastapi import FastAPI

# Create an instance of the FastAPI class
app = FastAPI(title="F1 Intelligence Model API")


# Define a route for the root URL ("/")
@app.get("/")
def read_root():
    """
    This is the root endpoint. It returns a welcome message.
    """
    return {"message": "Welcome to F1 Intelligence Model API"}
