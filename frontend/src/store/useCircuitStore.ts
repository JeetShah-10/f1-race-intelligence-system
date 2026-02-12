import { create } from 'zustand';
import { api } from '../services/api';

export interface Circuit {
    id: string;
    name: string;
    country: string;
    countryCode: string;
    city: string;
    image: string;
    map: string;
    length: string;
    laps: number;
    lapRecord: string;
    lapRecordHolder: string;
    characteristics: string[];
    pitLoss: string;
    tyreCompounds: string[];
}

export interface RaceEvent {
    id: string;
    circuit: Circuit;
    date: string;
    daysUntil: number;
    weather: string;
    historicalWinner: string;
    isSprint: boolean;
}

export interface ModelInsight {
    label: string;
    value: string | number;
    unit?: string;
    description: string;
    badge?: 'CRITICAL' | 'STRONG' | 'WARNING';
}

interface CircuitState {
    circuits: Circuit[];
    setCircuits: (circuits: Circuit[]) => void;
    nextRace: RaceEvent | null;
    setNextRace: (race: RaceEvent) => void;
    selectedCircuit: Circuit | null;
    setSelectedCircuit: (circuit: Circuit | null) => void;
    insights: ModelInsight[];
    setInsights: (insights: ModelInsight[]) => void;
    calendar: RaceEvent[];
    setCalendar: (events: RaceEvent[]) => void;
    loadCircuits: () => Promise<void>;
}

const defaultCircuits: Circuit[] = [
    {
        id: 'monaco',
        name: 'Monaco Grand Prix',
        country: 'Monaco',
        countryCode: 'MC',
        city: 'Monte Carlo',
        image: '/assets/circuits/monaco-circuit.png',
        map: '/assets/circuits/monaco-map.png',
        length: '3.337 km',
        laps: 78,
        lapRecord: '1:12.909',
        lapRecordHolder: 'Hamilton (2021)',
        characteristics: ['Street Circuit', 'Low Overtaking', 'High Downforce'],
        pitLoss: '22.1s',
        tyreCompounds: ['C3', 'C4', 'C5'],
    },
    {
        id: 'silverstone',
        name: 'British Grand Prix',
        country: 'United Kingdom',
        countryCode: 'GB',
        city: 'Silverstone',
        image: '/assets/circuits/silverstone-circuit.png',
        map: '/assets/circuits/silverstone-map.png',
        length: '5.891 km',
        laps: 52,
        lapRecord: '1:27.097',
        lapRecordHolder: 'Verstappen (2020)',
        characteristics: ['High Speed', 'Technical', 'Weather Variable'],
        pitLoss: '19.8s',
        tyreCompounds: ['C1', 'C2', 'C3'],
    },
    {
        id: 'spa',
        name: 'Belgian Grand Prix',
        country: 'Belgium',
        countryCode: 'BE',
        city: 'Spa-Francorchamps',
        image: '/assets/circuits/spa-circuit.png',
        map: '/assets/circuits/spa-map.png',
        length: '7.004 km',
        laps: 44,
        lapRecord: '1:46.286',
        lapRecordHolder: 'Bottas (2018)',
        characteristics: ['Long Circuit', 'High Speed', 'Elevation Changes'],
        pitLoss: '21.5s',
        tyreCompounds: ['C2', 'C3', 'C4'],
    },
];

const defaultNextRace: RaceEvent = {
    id: 'monaco-2026',
    circuit: defaultCircuits[0],
    date: 'May 25, 2026',
    daysUntil: 20,
    weather: 'Sunny, 24°C',
    historicalWinner: 'Leclerc (2024)',
    isSprint: false,
};

const defaultInsights: ModelInsight[] = [
    { label: 'Overcut Viable', value: 72, unit: '%', description: 'High track evolution', badge: 'STRONG' },
    { label: 'Undercut Window', value: 'Lap 18-22', description: 'Optimal pit range' },
    { label: 'Safety Car %', value: 34, unit: '%', description: 'Historic average' },
    { label: 'Tyre Delta', value: '1.2s/lap', description: 'Med vs Hard', badge: 'CRITICAL' },
    { label: 'Track Evolution', value: '+0.8s', description: 'Session improvement' },
    { label: 'Pit Loss', value: '22.1s', description: 'Including delta' },
];

export const useCircuitStore = create<CircuitState>((set) => ({
    circuits: defaultCircuits,
    setCircuits: (circuits) => set({ circuits }),

    nextRace: defaultNextRace,
    setNextRace: (race) => set({ nextRace: race }),

    selectedCircuit: null,
    setSelectedCircuit: (circuit) => set({ selectedCircuit: circuit }),

    insights: defaultInsights,
    setInsights: (insights) => set({ insights }),

    calendar: [],
    setCalendar: (events) => set({ calendar: events }),

    loadCircuits: async () => {
        try {
            const backendCircuits = await api.getCircuits();
            if (backendCircuits && backendCircuits.length > 0) {
                const circuits: Circuit[] = backendCircuits.map((bc: any) => ({
                    id: bc.circuit_id || bc.id || '',
                    name: bc.name || bc.circuit_name || '',
                    country: bc.country || '',
                    countryCode: bc.country_code || '',
                    city: bc.city || bc.location || '',
                    image: bc.image || `/assets/circuits/${(bc.circuit_id || bc.id || '').toLowerCase()}-circuit.webp`,
                    map: bc.map || `/assets/circuits/${(bc.circuit_id || bc.id || '').toLowerCase()}-map.webp`,
                    length: bc.length_km ? `${bc.length_km} km` : bc.length || '',
                    laps: bc.total_laps || bc.laps || 0,
                    lapRecord: bc.lap_record || '',
                    lapRecordHolder: bc.lap_record_holder || '',
                    characteristics: bc.characteristics || [],
                    pitLoss: bc.pit_loss || '',
                    tyreCompounds: bc.tyre_compounds || [],
                }));
                set({ circuits });
                console.log('[Circuits] \u2705 Loaded from backend');
            }
        } catch (err) {
            console.warn('[Circuits] \u26a0\ufe0f Backend unavailable, using default data:', err);
        }
    },
}));
