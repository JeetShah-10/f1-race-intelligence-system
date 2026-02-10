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
    mapImage: string;
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

export interface Constructor {
    position: number;
    name: string;
    points: number;
    color: string;
    drivers: string;
    trend: 'up' | 'down' | 'stable';
    image?: string;
}

export interface Race {
    round: number;
    name: string;
    country: string;
    date: string;
    flag: string;
    status: 'completed' | 'next' | 'upcoming';
    circuit: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const TEAM_COLORS: Record<string, string> = {
    'Red Bull Racing': '#3671C6',
    'Red Bull': '#3671C6',
    'Ferrari': '#E8002D',
    'McLaren': '#FF8000',
    'Mercedes': '#27F4D2',
    'Aston Martin': '#229971',
    'Alpine': '#0093CC',
    'Williams': '#64C4FF',
    'Racing Bulls': '#6692FF',
    'RB': '#6692FF',
    'Audi': '#000000',
    'Haas': '#B6BABD',
    'Cadillac': '#1E3264',
};

const DRIVER_IMAGES: Record<string, string> = {
    // Red Bull Racing
    'VER': '/assets/drivers/max-verstappen-removebg-preview.png',
    'HAD': '/assets/drivers/isack-hadjar-removebg-preview.png',
    // Ferrari
    'LEC': '/assets/drivers/charles-leclerc-removebg-preview.png',
    'HAM': '/assets/drivers/lewis-hamilton-removebg-preview.png',
    // McLaren
    'NOR': '/assets/drivers/lando-norris-removebg-preview.png',
    'PIA': '/assets/drivers/oscar-piastri-removebg-preview.png',
    // Mercedes
    'RUS': '/assets/drivers/george-russell-removebg-preview.png',
    'ANT': '/assets/drivers/kimi-antonelli-removebg-preview.png',
    // Aston Martin
    'ALO': '/assets/drivers/fernando-alonso-removebg-preview.png',
    'STR': '/assets/drivers/lance-stroll-removebg-preview.png',
    // Alpine
    'GAS': '/assets/drivers/pierre-gasly-removebg-preview.png',
    'COL': '/assets/drivers/colapinto-removebg-preview.png',
    // Williams
    'SAI': '/assets/drivers/carlos-sainz-removebg-preview.png',
    'ALB': '/assets/drivers/alex-albon-removebg-preview.png',
    // Racing Bulls
    'LAW': '/assets/drivers/liam-lawson-removebg-preview.png',
    'LIN': '/assets/drivers/arvid-lindblad-removebg-preview.png',
    // Audi
    'HUL': '/assets/drivers/nico-hulkenberg-removebg-preview.png',
    'BOR': '/assets/drivers/bortoleto-removebg-preview.png',
    // Haas
    'OCO': '/assets/drivers/ocon-removebg-preview.png',
    'BEA': '/assets/drivers/oliver-bearman-removebg-preview.png',
    // Cadillac
    'PER': '/assets/drivers/sergio-perez-removebg-preview.png',
    'BOT': '/assets/drivers/valettri-bottas-removebg-preview.png',
};

const mockNextRace: NextRace = {
    name: 'Australian Grand Prix',
    circuit: 'Albert Park Circuit',
    country: 'Australia',
    date: '2026-03-08T05:00:00Z',
    session: 'Race',
    weather: 'Sunny 26°C',
    trackCharacteristics: {
        downforce: 'Medium',
        overtaking: 'High',
        tyreWear: 'High',
        pitLoss: '21.5s',
    },
    modelConfidence: 0.91,
    countdown: {
        days: 27,
        hours: 6,
        minutes: 0,
    },
    image: '/assets/circuits/australian-grand-prix-circuit.webp',
    mapImage: '/assets/circuits/australian-grand-prix-map.png',
};

// Complete 2026 F1 Grid - All 22 drivers from 11 teams
const mockDrivers: Driver[] = [
    // Red Bull Racing
    { name: 'Max Verstappen', code: 'VER', team: 'Red Bull Racing', points: 0, position: 1 },
    { name: 'Isack Hadjar', code: 'HAD', team: 'Red Bull Racing', points: 0, position: 2 },
    // Ferrari
    { name: 'Charles Leclerc', code: 'LEC', team: 'Ferrari', points: 0, position: 3 },
    { name: 'Lewis Hamilton', code: 'HAM', team: 'Ferrari', points: 0, position: 4 },
    // McLaren
    { name: 'Lando Norris', code: 'NOR', team: 'McLaren', points: 0, position: 5 },
    { name: 'Oscar Piastri', code: 'PIA', team: 'McLaren', points: 0, position: 6 },
    // Mercedes
    { name: 'George Russell', code: 'RUS', team: 'Mercedes', points: 0, position: 7 },
    { name: 'Kimi Antonelli', code: 'ANT', team: 'Mercedes', points: 0, position: 8 },
    // Aston Martin
    { name: 'Fernando Alonso', code: 'ALO', team: 'Aston Martin', points: 0, position: 9 },
    { name: 'Lance Stroll', code: 'STR', team: 'Aston Martin', points: 0, position: 10 },
    // Alpine
    { name: 'Pierre Gasly', code: 'GAS', team: 'Alpine', points: 0, position: 11 },
    { name: 'Franco Colapinto', code: 'COL', team: 'Alpine', points: 0, position: 12 },
    // Williams
    { name: 'Carlos Sainz', code: 'SAI', team: 'Williams', points: 0, position: 13 },
    { name: 'Alex Albon', code: 'ALB', team: 'Williams', points: 0, position: 14 },
    // Racing Bulls
    { name: 'Liam Lawson', code: 'LAW', team: 'Racing Bulls', points: 0, position: 15 },
    { name: 'Arvid Lindblad', code: 'LIN', team: 'Racing Bulls', points: 0, position: 16 },
    // Audi
    { name: 'Nico Hulkenberg', code: 'HUL', team: 'Audi', points: 0, position: 17 },
    { name: 'Gabriel Bortoleto', code: 'BOR', team: 'Audi', points: 0, position: 18 },
    // Haas
    { name: 'Esteban Ocon', code: 'OCO', team: 'Haas', points: 0, position: 19 },
    { name: 'Oliver Bearman', code: 'BEA', team: 'Haas', points: 0, position: 20 },
    // Cadillac (11th team)
    { name: 'Sergio Perez', code: 'PER', team: 'Cadillac', points: 0, position: 21 },
    { name: 'Valtteri Bottas', code: 'BOT', team: 'Cadillac', points: 0, position: 22 },
].map(driver => ({
    ...driver,
    teamColor: TEAM_COLORS[driver.team] || '#FFFFFF',
    image: DRIVER_IMAGES[driver.code] || '',
}));

const mockMomentum: DriverMomentum[] = [
    { driver: 'VER', trend: 'dominant', delta: '+0.00s', last5: ['-', '-', '-', '-', '-'] },
    { driver: 'NOR', trend: 'rising', delta: '+0.00s', last5: ['-', '-', '-', '-', '-'] },
    { driver: 'LEC', trend: 'stable', delta: '+0.00s', last5: ['-', '-', '-', '-', '-'] },
    { driver: 'HAM', trend: 'rising', delta: '+0.00s', last5: ['-', '-', '-', '-', '-'] },
    { driver: 'PIA', trend: 'stable', delta: '+0.00s', last5: ['-', '-', '-', '-', '-'] },
];

const mockRivalries: Rivalry[] = [
    { pair: ['VER', 'NOR'], metric: 'Pre-Season Testing', value: '+0.087s', narrative: 'McLaren showing strong pace' },
    { pair: ['LEC', 'HAM'], metric: 'Teammate Battle', value: 'TBD', narrative: 'New Ferrari partnership begins' },
    { pair: ['RUS', 'ANT'], metric: 'Experience Gap', value: 'N/A', narrative: 'Russell guiding rookie Antonelli' },
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

const mockConstructors: Constructor[] = [
    { position: 1, name: 'Red Bull Racing', points: 0, color: '#3671C6', drivers: 'VER • HAD', trend: 'stable' },
    { position: 2, name: 'Ferrari', points: 0, color: '#E8002D', drivers: 'LEC • HAM', trend: 'stable' },
    { position: 3, name: 'McLaren', points: 0, color: '#FF8000', drivers: 'NOR • PIA', trend: 'stable' },
    { position: 4, name: 'Mercedes', points: 0, color: '#27F4D2', drivers: 'RUS • ANT', trend: 'stable' },
    { position: 5, name: 'Aston Martin', points: 0, color: '#229971', drivers: 'ALO • STR', trend: 'stable' },
    { position: 6, name: 'Alpine', points: 0, color: '#0093CC', drivers: 'GAS • COL', trend: 'stable' },
    { position: 7, name: 'Williams', points: 0, color: '#64C4FF', drivers: 'SAI • ALB', trend: 'stable' },
    { position: 8, name: 'Racing Bulls', points: 0, color: '#6692FF', drivers: 'LAW • LIN', trend: 'stable' },
    { position: 9, name: 'Audi', points: 0, color: '#F2F2F2', drivers: 'HUL • BOR', trend: 'stable' },
    { position: 10, name: 'Haas', points: 0, color: '#B6BABD', drivers: 'OCO • BEA', trend: 'stable' },
    { position: 11, name: 'Cadillac', points: 0, color: '#1E3264', drivers: 'PER • BOT', trend: 'stable' },
];

const mockCalendar: Race[] = [
    { round: 1, name: 'Australian GP', country: 'Australia', date: 'MAR 08', flag: '🇦🇺', status: 'next', circuit: 'Albert Park' },
    { round: 2, name: 'Chinese GP', country: 'China', date: 'MAR 22', flag: '🇨🇳', status: 'upcoming', circuit: 'Shanghai International Circuit' },
    { round: 3, name: 'Japanese GP', country: 'Japan', date: 'APR 05', flag: '🇯🇵', status: 'upcoming', circuit: 'Suzuka' },
    { round: 4, name: 'Bahrain GP', country: 'Bahrain', date: 'APR 12', flag: '🇧🇭', status: 'upcoming', circuit: 'Sakhir' },
    { round: 5, name: 'Saudi Arabian GP', country: 'Saudi Arabia', date: 'APR 19', flag: '🇸🇦', status: 'upcoming', circuit: 'Jeddah Corniche' },
    { round: 6, name: 'Miami GP', country: 'USA', date: 'MAY 03', flag: '🇺🇸', status: 'upcoming', circuit: 'Miami International Autodrome' },
    { round: 7, name: 'Madrid GP', country: 'Spain', date: 'MAY 17', flag: '🇪🇸', status: 'upcoming', circuit: 'IFEMA Madrid' },
    { round: 8, name: 'Monaco GP', country: 'Monaco', date: 'MAY 24', flag: '🇲🇨', status: 'upcoming', circuit: 'Monaco' },
    { round: 9, name: 'Canadian GP', country: 'Canada', date: 'JUN 07', flag: '🇨🇦', status: 'upcoming', circuit: 'Circuit Gilles-Villeneuve' },
    { round: 10, name: 'Austrian GP', country: 'Austria', date: 'JUN 21', flag: '🇦🇹', status: 'upcoming', circuit: 'Red Bull Ring' },
    { round: 11, name: 'British GP', country: 'UK', date: 'JUL 05', flag: '🇬🇧', status: 'upcoming', circuit: 'Silverstone' },
    { round: 12, name: 'Belgian GP', country: 'Belgium', date: 'JUL 26', flag: '🇧🇪', status: 'upcoming', circuit: 'Spa-Francorchamps' },
    { round: 13, name: 'Hungarian GP', country: 'Hungary', date: 'AUG 02', flag: '🇭🇺', status: 'upcoming', circuit: 'Hungaroring' },
    { round: 14, name: 'Dutch GP', country: 'Netherlands', date: 'AUG 30', flag: '🇳🇱', status: 'upcoming', circuit: 'Zandvoort' },
    { round: 15, name: 'Italian GP', country: 'Italy', date: 'SEP 06', flag: '🇮🇹', status: 'upcoming', circuit: 'Monza' },
    { round: 16, name: 'Azerbaijan GP', country: 'Azerbaijan', date: 'SEP 20', flag: '🇦🇿', status: 'upcoming', circuit: 'Baku City Circuit' },
    { round: 17, name: 'Singapore GP', country: 'Singapore', date: 'OCT 04', flag: '🇸🇬', status: 'upcoming', circuit: 'Marina Bay' },
    { round: 18, name: 'United States GP', country: 'USA', date: 'OCT 18', flag: '🇺🇸', status: 'upcoming', circuit: 'COTA' },
    { round: 19, name: 'Mexico City GP', country: 'Mexico', date: 'OCT 25', flag: '🇲🇽', status: 'upcoming', circuit: 'Autódromo Hermanos Rodríguez' },
    { round: 20, name: 'São Paulo GP', country: 'Brazil', date: 'NOV 08', flag: '🇧🇷', status: 'upcoming', circuit: 'Interlagos' },
    { round: 21, name: 'Las Vegas GP', country: 'USA', date: 'NOV 21', flag: '🇺🇸', status: 'upcoming', circuit: 'Las Vegas Strip Circuit' },
    { round: 22, name: 'Qatar GP', country: 'Qatar', date: 'NOV 29', flag: '🇶🇦', status: 'upcoming', circuit: 'Lusail' },
    { round: 23, name: 'Abu Dhabi GP', country: 'UAE', date: 'DEC 06', flag: '🇦🇪', status: 'upcoming', circuit: 'Yas Marina' },
];

// ─────────────────────────────────────────────────────────────────────────────
// STORE INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

interface DashboardState {
    // Mode
    mode: 'view' | 'simulate' | 'compare';
    setMode: (mode: 'view' | 'simulate' | 'compare') => void;

    // Sidebar state
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;

    // Data slices
    nextRace: NextRace;
    standings: Driver[];
    constructors: Constructor[];
    calendar: Race[];
    momentum: DriverMomentum[];
    rivalries: Rivalry[];
    insights: Insights;
    scenarios: Scenario[];
    meta: Meta;

    // Setters (for future API integration)
    setNextRace: (race: NextRace) => void;
    setStandings: (drivers: Driver[]) => void;
    setConstructors: (constructors: Constructor[]) => void;
    setCalendar: (calendar: Race[]) => void;
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

const loadSidebarState = () => {
    try {
        const saved = localStorage.getItem('f1-sidebar-open');
        return saved ? JSON.parse(saved) : true;
    } catch {
        return true;
    }
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
    // Mode
    mode: 'view',
    setMode: (mode) => set({ mode }),

    // Sidebar state - persisted to localStorage
    sidebarOpen: loadSidebarState(),
    toggleSidebar: () => set((state) => {
        const newState = !state.sidebarOpen;
        localStorage.setItem('f1-sidebar-open', JSON.stringify(newState));
        return { sidebarOpen: newState };
    }),
    setSidebarOpen: (open) => {
        localStorage.setItem('f1-sidebar-open', JSON.stringify(open));
        set({ sidebarOpen: open });
    },

    // Data slices - initialized with mock data (sync load, < 100ms)
    nextRace: mockNextRace,
    standings: mockDrivers,
    constructors: mockConstructors,
    calendar: mockCalendar,
    momentum: mockMomentum,
    rivalries: mockRivalries,
    insights: mockInsights,
    scenarios: mockScenarios,
    meta: mockMeta,

    // Setters
    setNextRace: (race) => set({ nextRace: race }),
    setStandings: (drivers) => set({ standings: drivers }),
    setConstructors: (constructors) => set({ constructors }),
    setCalendar: (calendar) => set({ calendar }),
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
export const selectConstructors = (state: DashboardState) => state.constructors;
export const selectCalendar = (state: DashboardState) => state.calendar;
export const selectMomentum = (state: DashboardState) => state.momentum;
export const selectRivalries = (state: DashboardState) => state.rivalries;
export const selectInsights = (state: DashboardState) => state.insights;
export const selectScenarios = (state: DashboardState) => state.scenarios;
export const selectMeta = (state: DashboardState) => state.meta;
export const selectMode = (state: DashboardState) => state.mode;
export const selectSidebarOpen = (state: DashboardState) => state.sidebarOpen;

