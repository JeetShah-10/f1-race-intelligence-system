import { create } from 'zustand';

interface Driver {
    id: string;
    [key: string]: unknown;
}

interface RaceState {
    sessionType: string;
    trackStatus: string;
    currentLap: number;
    totalLaps: number;
    drivers: Driver[];
    setTelemetry: (data: Partial<RaceState>) => void;
    updateDriver: (id: string, updates: Partial<Driver>) => void;
}

export const useRaceStore = create<RaceState>((set) => ({
    sessionType: 'RACE',
    trackStatus: 'GREEN', // GREEN, YELLOW, SC, VSC, RED
    currentLap: 1,
    totalLaps: 57,
    drivers: [], // Initially empty, to be populated by Dev's ingestion

    // Actions for real-time updates
    setTelemetry: (data) => set((state) => ({ ...state, ...data })),

    // Update a single car's 2026 state
    updateDriver: (id, updates) => set((state) => ({
        drivers: state.drivers.map((d) => d.id === id ? { ...d, ...updates } : d)
    })),
}));
