import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WeatherCondition = 'dry' | 'light_rain' | 'wet';
export type TyreCompound = 'soft' | 'medium' | 'hard' | 'intermediate' | 'wet';
export type SimulationStatus = 'idle' | 'configuring' | 'qualifying' | 'race' | 'complete';

export interface Circuit {
    id: string;
    name: string;
    country: string;
    image: string;
    map: string;
    characteristics: string[];
    pitLoss: string;
    lapRecord: string;
}

export interface ScenarioConfig {
    id: string;
    name: string;
    circuit: Circuit | null;
    weather: WeatherCondition;
    tyreStrategy: TyreCompound[];
    date: string;
}

export interface SimulationResult {
    id: string;
    scenarioId: string;
    timestamp: Date;
    grid: string[];
    finishOrder: string[];
    fastestLap: { driver: string; time: string };
    podium: string[];
    dnfs: string[];
    safetyCars: number;
}

interface SimulationState {
    status: SimulationStatus;
    setStatus: (status: SimulationStatus) => void;
    currentScenario: ScenarioConfig;
    setCircuit: (circuit: Circuit) => void;
    setWeather: (weather: WeatherCondition) => void;
    setTyreStrategy: (tyres: TyreCompound[]) => void;
    resetScenario: () => void;
    currentLap: number;
    totalLaps: number;
    setLap: (current: number, total?: number) => void;
    results: SimulationResult[];
    latestResult: SimulationResult | null;
    addResult: (result: SimulationResult) => void;
    clearResults: () => void;
    savedScenarios: ScenarioConfig[];
    saveScenario: (scenario: ScenarioConfig) => void;
    deleteScenario: (id: string) => void;
}

const defaultScenario: ScenarioConfig = {
    id: crypto.randomUUID(),
    name: 'New Scenario',
    circuit: null,
    weather: 'dry',
    tyreStrategy: ['medium', 'hard'],
    date: new Date().toISOString(),
};

export const useSimulationStore = create<SimulationState>()(
    persist(
        (set) => ({
            status: 'idle',
            setStatus: (status) => set({ status }),

            currentScenario: defaultScenario,
            setCircuit: (circuit) => set((state) => ({
                currentScenario: { ...state.currentScenario, circuit }
            })),
            setWeather: (weather) => set((state) => ({
                currentScenario: { ...state.currentScenario, weather }
            })),
            setTyreStrategy: (tyres) => set((state) => ({
                currentScenario: { ...state.currentScenario, tyreStrategy: tyres }
            })),
            resetScenario: () => set({
                currentScenario: { ...defaultScenario, id: crypto.randomUUID() }
            }),

            currentLap: 0,
            totalLaps: 57,
            setLap: (current, total) => set((state) => ({
                currentLap: current,
                totalLaps: total ?? state.totalLaps,
            })),

            results: [],
            latestResult: null,
            addResult: (result) => set((state) => ({
                results: [result, ...state.results].slice(0, 10),
                latestResult: result,
            })),
            clearResults: () => set({ results: [], latestResult: null }),

            savedScenarios: [],
            saveScenario: (scenario) => set((state) => ({
                savedScenarios: [...state.savedScenarios, scenario]
            })),
            deleteScenario: (id) => set((state) => ({
                savedScenarios: state.savedScenarios.filter((s) => s.id !== id)
            })),
        }),
        {
            name: 'apex-simulation-store',
            partialize: (state) => ({
                savedScenarios: state.savedScenarios,
                results: state.results,
            }),
        }
    )
);
