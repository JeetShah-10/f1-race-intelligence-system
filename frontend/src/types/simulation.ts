export type TireCompound = 'SOFT' | 'MEDIUM' | 'HARD' | 'INTER' | 'WET';
export type TyreCompound = TireCompound; // Alias for compatibility

export const TIRE_COLORS: Record<TireCompound, string> = {
    SOFT: '#FF3333',
    MEDIUM: '#FFC906',
    HARD: '#FFFFFF',
    INTER: '#1EB53A',
    WET: '#0064E0',
};

export type SectorStatus = 'PURPLE' | 'GREEN' | 'YELLOW' | 'NONE';

export const SECTOR_COLORS: Record<SectorStatus, string> = {
    PURPLE: '#A020F0',
    GREEN: '#00E676',
    YELLOW: '#F9E300',
    NONE: '#FFFFFF',
};

export type WeatherCondition = 'DRY' | 'LIGHT_RAIN' | 'WET';

export type RaceEventType =
    | 'OVERTAKE'
    | 'PIT_STOP'
    | 'SAFETY_CAR'
    | 'VIRTUAL_SC'
    | 'DNF'
    | 'YELLOW_FLAG';

export interface Constructor {
    id: string;
    name: string;
    shortName: string;
    color: string;
}

export interface Driver {
    id: string;
    code: string;
    firstName: string;
    lastName: string;
    number: number;
    constructor: Constructor;
    nationality: string;
}

export interface SectorTime {
    sector: 1 | 2 | 3;
    time: number;
    status: SectorStatus;
}

export interface LapTime {
    lap: number;
    sectors: SectorTime[];
    total: number;
    isPersonalBest: boolean;
    isSessionBest: boolean;
}

export interface TimingEntry {
    position: number;
    driver: Driver;
    gap: string;
    interval: string;
    lastLap: LapTime | null;
    bestLap: LapTime | null;
    currentTire: TireCompound;
    tireAge: number;
    pitStops: number;
    status: 'RUNNING' | 'PIT' | 'OUT' | 'DNF';
}

export interface StrategyStint {
    compound: TireCompound;
    startLap: number;
    endLap: number | null;
    laps: number;
}

export interface PitStop {
    lap: number;
    duration: number;
    compoundBefore: TireCompound;
    compoundAfter: TireCompound;
}

export interface RaceEvent {
    type: RaceEventType;
    lap: number;
    timestamp: number;
    drivers: string[];
    description: string;
}

export interface OvertakeEvent extends RaceEvent {
    type: 'OVERTAKE';
    attacker: string;
    defender: string;
    corner: number;
}

export interface TelemetryPoint {
    distance: number;
    speed: number;
    throttle: number;
    brake: number;
    gear: number;
    rpm: number;
    ers: number;
    drs: boolean;
}

export interface TelemetryData {
    driver: Driver;
    lap: number;
    points: TelemetryPoint[];
}

export interface SimulationState {
    mode: 'IDLE' | 'QUALIFYING' | 'RACE' | 'RESULTS';
    currentLap: number;
    totalLaps: number;
    timing: TimingEntry[];
    events: RaceEvent[];
    weather: WeatherCondition;
    safetyCarActive: boolean;
    virtualSCActive: boolean;
}

export interface Circuit {
    id: string;
    name: string;
    country: string;
    length: number;
    turns: number;
    sectors: [number, number, number];
    drsZones: number;
    lapRecord: {
        time: number;
        driver: string;
        year: number;
    };
}

export type SimulationStatus = 'IDLE' | 'RUNNING' | 'PAUSED' | 'FINISHED' | 'ERROR';

export interface ScenarioConfig {
    circuit_id: string;
    year: number;
    lap_count: number;
    drivers: any[]; // refine as needed
    events: any[];
}

export interface SimulationResult {
    id: string;
    date: string;
    circuit: string;
    winner: string;
    fastestLap: string;
    totalTime: string;
}
