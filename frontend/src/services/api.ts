import { API_BASE_URL } from '../config';

//  Backend Response Types 

export interface Driver {
    driverId: string;
    code: string;
    url: string;
    givenName: string;
    familyName: string;
    dateOfBirth: string;
    nationality: string;
    permanentNumber?: string;
}

//  Simulation Request/Response (matches backend schema) 

export interface DriverInput {
    driver: string;
    team: string;
    grid_position: number;
    compound?: string;
    tyre_life?: number;
}

export interface EventConfig {
    type: string;        // "SC", "VSC", "RED_FLAG", "WEATHER"
    start_lap: number;
    duration?: number;
    new_weather?: string;
}

export interface SimulationRequest {
    circuit_id: string;
    year?: number;
    session_type?: string;
    lap_count?: number;
    weather?: string;
    track_temp?: number;
    air_temp?: number;
    drivers?: DriverInput[];
    grid?: string;      // "current_2026" preset
    events?: EventConfig[];
}

export interface BackendLapData {
    lap: number;
    time: number;
    sector_1: number | null;
    sector_2: number | null;
    sector_3: number | null;
    compound: string;
    tyre_age: number;
}

export interface BackendDriverResult {
    driver_id: string;
    team: string;
    position: number;
    total_time: number;
    gap_to_leader: number;
    status: string;      // "Finished" or "DNF"
    laps: BackendLapData[];
    total_pit_stops: number;
    pit_stops: Array<{ lap: number; compound: string; duration?: number }>;
    events: Array<{ type: string; lap: number; description?: string }>;
}

export interface BackendSimulationResult {
    circuit: string;
    weather: string;
    total_laps: number;
    results: BackendDriverResult[];
}

//  Qualifying Request/Response 

export interface QualifyingRequest {
    circuit_id: string;
    year?: number;
    weather?: string;
    track_temp?: number;
    air_temp?: number;
    drivers?: DriverInput[];
    grid?: string;
}

export interface BackendQualifyingResultItem {
    driver_id: string;
    team: string;
    position: number;
    q1_time: number | null;
    q2_time: number | null;
    q3_time: number | null;
    best_time: number | null;
    gap_to_pole: number | null;
}

export interface BackendQualifyingResult {
    circuit_id: string;
    weather: string;
    results: BackendQualifyingResultItem[];
}

//  Calendar / Circuit Responses 

export interface BackendCalendarEntry {
    raceId: number;
    round: number;
    name: string;
    date: string;
    circuitId: string;
    circuitName: string;
    country: string;
    lat: number | null;
    lng: number | null;
    totalLaps: number | null;
    turns: number | null;
    drsZones: number | null;
    length: number | null;
}

export interface BackendCircuit {
    circuit_id: string;
    name: string;
    country: string;
    lat: number | null;
    lng: number | null;
    total_laps: number | null;
    turns: number | null;
    drs_zones: number | null;
    length_km: number | null;
}

//  Predict Request/Response 

export interface PredictEventRequest {
    circuit_id: string;
    year?: number;
    weather?: string;
}

//  API Client 

export const api = {
    //  Existing endpoints 

    async getDrivers(season: number = 2025): Promise<Driver[]> {
        const response = await fetch(`${API_BASE_URL}/api/drivers?year=${season}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch drivers: ${response.statusText}`);
        }
        const data = await response.json();
        return data.drivers || [];
    },

    async getStandings(season: number = 2025) {
        const response = await fetch(`${API_BASE_URL}/api/standings/drivers?year=${season}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch standings: ${response.statusText}`);
        }
        const data = await response.json();
        return data.standings || [];
    },

    async getSchedule(season: number = 2025) {
        const response = await fetch(`${API_BASE_URL}/api/sessions/${season}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch schedule: ${response.statusText}`);
        }
        const data = await response.json();
        return data.sessions || [];
    },

    async getTelemetry(year: number, gp: string, session: string, driver: string, lap?: number) {
        const query = new URLSearchParams({
            year: year.toString(),
            gp,
            session,
            driver,
            ...(lap ? { lap: lap.toString() } : {}),
        });
        const response = await fetch(`${API_BASE_URL}/api/telemetry/trace?${query}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch telemetry: ${response.statusText}`);
        }
        return await response.json();
    },

    async checkHealth(): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/health`);
            return response.ok;
        } catch {
            return false;
        }
    },

    //  NEW: Simulation 

    async runSimulation(req: SimulationRequest): Promise<BackendSimulationResult> {
        const response = await fetch(`${API_BASE_URL}/api/simulate/simulate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req),
        });
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Simulation failed (${response.status}): ${errorBody}`);
        }
        return await response.json();
    },

    //  NEW: Qualifying 

    async runQualifying(req: QualifyingRequest): Promise<BackendQualifyingResult> {
        const response = await fetch(`${API_BASE_URL}/api/qualifying/qualify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req),
        });
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Qualifying failed (${response.status}): ${errorBody}`);
        }
        return await response.json();
    },

    //  NEW: Calendar 

    async getCalendar(year: number = 2026): Promise<BackendCalendarEntry[]> {
        const response = await fetch(`${API_BASE_URL}/api/calendar/${year}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch calendar: ${response.statusText}`);
        }
        const data = await response.json();
        return data.calendar || data.races || [];
    },

    //  NEW: Circuits 

    async getCircuits(): Promise<BackendCircuit[]> {
        const response = await fetch(`${API_BASE_URL}/api/circuits/`);
        if (!response.ok) {
            throw new Error(`Failed to fetch circuits: ${response.statusText}`);
        }
        const data = await response.json();
        return data.circuits || [];
    },

    async getCircuit(circuitId: string): Promise<BackendCircuit> {
        const response = await fetch(`${API_BASE_URL}/api/circuits/${circuitId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch circuit: ${response.statusText}`);
        }
        return await response.json();
    },

    //  NEW: Predict Event 

    async predictEvent(req: PredictEventRequest) {
        const response = await fetch(`${API_BASE_URL}/api/predict/event`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req),
        });
        if (!response.ok) {
            throw new Error(`Prediction failed: ${response.statusText}`);
        }
        return await response.json();
    },

    //  NEW: Dashboard Stats & Public endpoints

    async getDashboardStats(): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`);
        if (!response.ok) {
            throw new Error(`Failed to fetch dashboard stats: ${response.statusText}`);
        }
        return await response.json();
    },

    async subscribeToNewsletter(email: string): Promise<{ success: boolean; message: string }> {
        const response = await fetch(`${API_BASE_URL}/api/newsletter`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        if (!response.ok) {
            throw new Error(`Subscription failed: ${response.statusText}`);
        }
        return await response.json();
    },

    async get2026Stats(): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/stats/2026`);
        if (!response.ok) {
            throw new Error(`Failed to fetch 2026 stats: ${response.statusText}`);
        }
        return await response.json();
    },
};

