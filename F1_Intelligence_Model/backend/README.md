# F1 Intelligence Model - Backend

This directory contains the Python backend for the F1 Intelligence Model, built with FastAPI.

## Setup and Installation

### 1. Prerequisites
- Python 3.10+
- `pip` and `venv`

### 2. Create a Virtual Environment
From the `F1_Intelligence_Model/backend` directory, create and activate a virtual environment.

**On Windows:**
```bash
python -m venv venv
.\venv\Scripts\activate
```

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
Install all required packages using the `requirements.txt` file.
```bash
pip install -r requirements.txt
```

## Running the Server

To run the FastAPI development server, execute the following command from the `F1_Intelligence_Model/backend` directory:

```bash
uvicorn app.main:app --reload
```
The `--reload` flag enables hot-reloading, so the server will restart automatically after code changes.

The API will be available at http://127.0.0.1:8000.

## API Documentation

Once the server is running, interactive API documentation (provided by Swagger UI) is available at:

http://127.0.0.1:8000/docs

You can use this interface to explore and test the API endpoints.

