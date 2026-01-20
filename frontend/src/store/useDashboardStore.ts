import { create } from 'zustand';

// ─────────────────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

export interface NextRace {
    name: string;
    circuit: string;
    country: string;
    date: string;
    session: string;
    weather: string;
    trackCharacteristics: {
        downforce: string;
        overtaking: string;
        tyreWear: string;
        pitLoss: string;
    };
    modelConfidence: number;
    countdown: {
        days: number;
        hours: number;
        minutes: number;
    };
    image: string;
}

export interface Driver {
    name: string;
    code: string;
    team: string;
    points: number;
    position: number;
    teamColor?: string;
    image?: string;
}

export interface DriverMomentum {
    driver: string;
    trend: 'dominant' | 'rising' | 'stable' | 'volatile' | 'declining';
    delta: string;
    last5: string[];
}

export interface Rivalry {
    pair: [string, string];
    metric: string;
    value: string;
    narrative: string;
}

export interface Insights {
    overcutSuccessProbability: number;
    undercutStrength: string;
    safetyCarProbability: number;
    tyreDegradation: {
        soft: string;
        medium: string;
        hard: string;
    };
    trackEvolution: string;
    pitLoss: number;
    strategyRecommendation: string;
}

export interface Scenario {
    id: string;
    name: string;
    icon: string;
    description: string;
    premium?: boolean;
}

export interface Meta {
    dataSource: string;
    lastIngest: string;
    modelVersion: string;
    trainingRange: string;
    uptime: string;
    status: 'Operational' | 'Degraded' | 'Offline';
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const TEAM_COLORS: Record<string, string> = {
    'Red Bull': '#3671C6',
    'Ferrari': '#DC0000',
    'McLaren': '#FF8700',
    'Mercedes': '#00D2BE',
    'Aston Martin': '#006F62',
    'Alpine': '#0090FF',
    'Williams': '#005AFF',
    'Haas': '#B6BABD',
    'RB': '#2B4562',
    'Kick Sauber': '#52E252',
};

const DRIVER_IMAGES: Record<string, string> = {
    'VER': '/assets/drivers/max-verstappen-removebg-preview.png',
    'NOR': '/assets/drivers/lando-norris-removebg-preview.png',
    'LEC': '/assets/drivers/charles-leclerc-removebg-preview.png',
    'PIA': '/assets/drivers/oscar-piastri-removebg-preview.png',
    'HAM': '/assets/drivers/lewis-hamilton-removebg-preview.png',
    'RUS': '/assets/drivers/george-russell-removebg-preview.png',
    'SAI': '/assets/drivers/carlos-sainz-removebg-preview.png',
    'ALO': '/assets/drivers/fernando-alonso-removebg-preview.png',
};

const mockNextRace: NextRace = {
    name: 'Monaco Grand Prix',
    circuit: 'Monte Carlo',
    country: 'Monaco',
    date: '2026-05-24T13:00:00Z',
    session: 'Race',
    weather: 'Sunny 24°C',
    trackCharacteristics: {
        downforce: 'High',
        overtaking: 'Low',
        tyreWear: 'Medium',
        pitLoss: '18.2s',
    },
    modelConfidence: 0.94,
    countdown: {
        days: 20,
        hours: 4,
        minutes: 55,
    },
    image: '/assets/circuits/monaco-circuit.png',
};

const mockDrivers: Driver[] = [
    { name: 'Max Verstappen', code: 'VER', team: 'Red Bull', points: 575, position: 1 },
    { name: 'Lando Norris', code: 'NOR', team: 'McLaren', points: 374, position: 2 },
    { name: 'Charles Leclerc', code: 'LEC', team: 'Ferrari', points: 319, position: 3 },
    { name: 'Oscar Piastri', code: 'PIA', team: 'McLaren', points: 285, position: 4 },
    { name: 'Lewis Hamilton', code: 'HAM', team: 'Mercedes', points: 240, position: 5 },
].map(driver => ({
    ...driver,
    teamColor: TEAM_COLORS[driver.team] || '#FFFFFF',
    image: DRIVER_IMAGES[driver.code] || '',
}));

const mockMomentum: DriverMomentum[] = [
    { driver: 'VER', trend: 'dominant', delta: '+0.42s', last5: ['P1', 'P1', 'P2', 'P1', 'P1'] },
    { driver: 'NOR', trend: 'rising', delta: '+0.21s', last5: ['P3', 'P2', 'P2', 'P2', 'P3'] },
    { driver: 'LEC', trend: 'stable', delta: '+0.12s', last5: ['P2', 'P3', 'P3', 'P3', 'P2'] },
    { driver: 'PIA', trend: 'rising', delta: '+0.18s', last5: ['P5', 'P4', 'P4', 'P3', 'P4'] },
    { driver: 'HAM', trend: 'volatile', delta: '-0.08s', last5: ['P6', 'P8', 'P5', 'P4', 'P7'] },
];

const mockRivalries: Rivalry[] = [
    { pair: ['VER', 'NOR'], metric: 'Qualifying Delta', value: '+0.143s', narrative: 'Norris closing gap in S2' },
    { pair: ['LEC', 'NOR'], metric: 'Race Pace', value: '+0.09s', narrative: 'Ferrari stronger in traction zones' },
    { pair: ['PIA', 'HAM'], metric: 'Tyre Deg', value: '-0.22s/lap', narrative: 'Piastri more consistent on mediums' },
];

const mockInsights: Insights = {
    overcutSuccessProbability: 0.72,
    undercutStrength: 'Weak',
    safetyCarProbability: 0.34,
    tyreDegradation: {
        soft: 'High',
        medium: 'Medium',
        hard: 'Low',
    },
    trackEvolution: 'High',
    pitLoss: 18.2,
    strategyRecommendation: 'Two-stop viable',
};

const mockScenarios: Scenario[] = [
    { id: 'chaos', name: 'Chaos Mode', icon: '⚠️', description: 'High incident probability' },
    { id: 'high-deg', name: 'High Degradation', icon: '🛞', description: 'Tyre wear favors alternate strategies' },
    { id: 'rain', name: 'Rain Probability', icon: '🌧', description: 'Wet conditions expected during race', premium: true },
    { id: 'strategy-opt', name: 'Strategy Optimizer', icon: '🧮', description: 'Compute ideal pit windows', premium: true },
    { id: 'multi-compare', name: 'Multi Compare', icon: '🔒', description: 'Premium feature', premium: true },
];

const mockMeta: Meta = {
    dataSource: 'FIA Timing (via FastF1)',
    lastIngest: '2026-05-21T11:30:00Z',
    modelVersion: 'RacePredictor v3.1',
    trainingRange: '2022-2025',
    uptime: '99.98%',
    status: 'Operational',
};

// ─────────────────────────────────────────────────────────────────────────────
// STORE INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

interface DashboardState {
    // Mode
    mode: 'view' | 'simulate' | 'compare';
    setMode: (mode: 'view' | 'simulate' | 'compare') => void;

    // Data slices
    nextRace: NextRace;
    standings: Driver[];
    momentum: DriverMomentum[];
    rivalries: Rivalry[];
    insights: Insights;
    scenarios: Scenario[];
    meta: Meta;

    // Setters (for future API integration)
    setNextRace: (race: NextRace) => void;
    setStandings: (drivers: Driver[]) => void;
    setMomentum: (momentum: DriverMomentum[]) => void;
    setRivalries: (rivalries: Rivalry[]) => void;
    setInsights: (insights: Insights) => void;
    setScenarios: (scenarios: Scenario[]) => void;
    setMeta: (meta: Meta) => void;

    // Selectors
    getDriverByCode: (code: string) => Driver | undefined;
    getMomentumByDriver: (code: string) => DriverMomentum | undefined;
}

// ─────────────────────────────────────────────────────────────────────────────
// STORE CREATION
// ─────────────────────────────────────────────────────────────────────────────

export const useDashboardStore = create<DashboardState>((set, get) => ({
    // Mode
    mode: 'view',
    setMode: (mode) => set({ mode }),

    // Data slices - initialized with mock data (sync load, < 100ms)
    nextRace: mockNextRace,
    standings: mockDrivers,
    momentum: mockMomentum,
    rivalries: mockRivalries,
    insights: mockInsights,
    scenarios: mockScenarios,
    meta: mockMeta,

    // Setters
    setNextRace: (race) => set({ nextRace: race }),
    setStandings: (drivers) => set({ standings: drivers }),
    setMomentum: (momentum) => set({ momentum }),
    setRivalries: (rivalries) => set({ rivalries }),
    setInsights: (insights) => set({ insights }),
    setScenarios: (scenarios) => set({ scenarios }),
    setMeta: (meta) => set({ meta }),

    // Selectors
    getDriverByCode: (code) => get().standings.find((d) => d.code === code),
    getMomentumByDriver: (code) => get().momentum.find((m) => m.driver === code),
}));

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTED SELECTORS (for component usage)
// ─────────────────────────────────────────────────────────────────────────────

export const selectNextRace = (state: DashboardState) => state.nextRace;
export const selectStandings = (state: DashboardState) => state.standings;
export const selectMomentum = (state: DashboardState) => state.momentum;
export const selectRivalries = (state: DashboardState) => state.rivalries;
export const selectInsights = (state: DashboardState) => state.insights;
export const selectScenarios = (state: DashboardState) => state.scenarios;
export const selectMeta = (state: DashboardState) => state.meta;
export const selectMode = (state: DashboardState) => state.mode;
