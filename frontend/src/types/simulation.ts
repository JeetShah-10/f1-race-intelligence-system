export type TireCompound = 'C1' | 'C2' | 'C3' | 'INTER' | 'WET';

export const TIRE_COLORS: Record<TireCompound, string> = {
    C1: '#F2F2F2',
    C2: '#E2DD47',
    C3: '#F74141',
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
