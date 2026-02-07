# API Contract — F1 Race Intelligence System

## Overview
This document defines the REST API contract between the frontend UI and backend services.

---

## Base Configuration

| Property | Value |
|----------|-------|
| Base URL | `http://localhost:8000/api` |
| Content-Type | `application/json` |
| API Version | `v1` |

---

## Endpoints

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-20T10:00:00Z"
}
```

---

### Session Data

#### Get Sessions List

```http
GET /api/sessions/{year}
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| year | integer | Yes | Season year (2018-2025) |

**Response:**
```json
{
  "sessions": [
    {
      "round": 1,
      "name": "Bahrain Grand Prix",
      "circuit": "Bahrain International Circuit",
      "date": "2024-03-02",
      "country": "Bahrain"
    }
  ]
}
```

#### Get Session Details

```http
GET /api/sessions/{year}/{round}
```

**Response:**
```json
{
  "event": {
    "name": "Monaco Grand Prix",
    "round": 8,
    "circuit": "Circuit de Monaco",
    "country": "Monaco"
  },
  "results": [
    {
      "position": 1,
      "driver": "VER",
      "team": "Red Bull Racing",
      "time": "1:34:23.156",
      "gap": null,
      "points": 25
    }
  ],
  "weather": {
    "airTemp": 24.5,
    "trackTemp": 42.3,
    "humidity": 65,
    "rainfall": false
  }
}
```

---

### Drivers

```http
GET /api/drivers
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| year | integer | No | Filter by season (default: current) |

**Response:**
```json
{
  "drivers": [
    {
      "code": "VER",
      "firstName": "Max",
      "lastName": "Verstappen",
      "team": "Red Bull Racing",
      "number": 1,
      "nationality": "Dutch"
    }
  ]
}
```

---

### Circuits

```http
GET /api/circuits
```

**Response:**
```json
{
  "circuits": [
    {
      "id": "monaco",
      "name": "Circuit de Monaco",
      "country": "Monaco",
      "length": 3.337,
      "turns": 19,
      "lapRecord": "1:12.909"
    }
  ]
}
```

---

### Predictions

#### Qualifying Prediction

```http
POST /api/predict/qualifying
```

**Request Body:**
```json
{
  "circuit": "monaco",
  "year": 2024,
  "weather": {
    "condition": "dry",
    "airTemp": 22,
    "trackTemp": 40
  }
}
```

**Response:**
```json
{
  "prediction": {
    "grid": [
      {
        "position": 1,
        "driver": "VER",
        "team": "Red Bull Racing",
        "predictedTime": "1:10.234",
        "confidence": 0.85
      }
    ],
    "modelVersion": "1.0.0",
    "generatedAt": "2024-01-20T10:00:00Z"
  }
}
```

#### Race Prediction

```http
POST /api/predict/race
```

**Request Body:**
```json
{
  "circuit": "monaco",
  "year": 2024,
  "grid": ["VER", "LEC", "SAI", "..."],
  "weather": {
    "condition": "dry"
  },
  "tyreStrategy": "mandatory"
}
```

**Response:**
```json
{
  "prediction": {
    "classification": [
      {
        "position": 1,
        "driver": "VER",
        "team": "Red Bull Racing",
        "gap": null,
        "tyreStrategy": ["SOFT", "MEDIUM", "HARD"],
        "pitStops": 2,
        "confidence": 0.78
      }
    ],
    "modelVersion": "1.0.0"
  }
}
```

---

### Simulation

#### Run Race Simulation

```http
POST /api/simulate
```

**Request Body:**
```json
{
  "circuit": "monaco",
  "year": 2024,
  "laps": 78,
  "grid": ["VER", "LEC", "SAI"],
  "weather": {
    "condition": "dry",
    "changeOnLap": null
  },
  "options": {
    "safetyCar": false,
    "vsc": false,
    "randomDnf": true
  }
}
```

**Response:**
```json
{
  "simulation": {
    "id": "sim_abc123",
    "status": "completed",
    "results": [
      {
        "position": 1,
        "driver": "VER",
        "laps": 78,
        "totalTime": "1:34:23.156",
        "gap": null,
        "fastestLap": "1:13.245",
        "tyreStints": [
          {"compound": "SOFT", "laps": 20},
          {"compound": "MEDIUM", "laps": 30},
          {"compound": "HARD", "laps": 28}
        ],
        "pitStops": 2
      }
    ],
    "lapData": [
      {
        "lap": 1,
        "positions": [
          {"driver": "VER", "position": 1, "gap": 0},
          {"driver": "LEC", "position": 2, "gap": 1.234}
        ]
      }
    ]
  }
}
```

---

### Telemetry (Phase 2)

```http
GET /api/telemetry/{session_id}/{driver}
```

**Response:**
```json
{
  "telemetry": {
    "driver": "VER",
    "lap": 45,
    "data": [
      {
        "distance": 0,
        "speed": 0,
        "throttle": 0,
        "brake": 100,
        "gear": 1
      }
    ]
  }
}
```

---

## Error Responses

All endpoints return standard error format:

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Circuit not found",
    "details": {
      "circuit": "Invalid circuit ID: 'xyz'"
    }
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| INVALID_REQUEST | 400 | Malformed request body |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 422 | Schema validation failed |
| RATE_LIMITED | 429 | Too many requests |
| SERVER_ERROR | 500 | Internal server error |

---

## Rate Limits

| Tier | Requests/min | Simulation/hour |
|------|--------------|-----------------|
| Guest | 10 | 0 |
| Registered | 60 | 10 |
| Premium | 120 | 50 |