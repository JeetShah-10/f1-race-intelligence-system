// ─── Tyre & Sector Enums ──────────────────────────────────────────────────
export type TireCompound = 'SOFT' | 'MEDIUM' | 'HARD' | 'INTER' | 'WET';
export type TyreCompound = TireCompound;

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

// ─── Race Flag ────────────────────────────────────────────────────────────
export type RaceFlag = 'GREEN' | 'YELLOW' | 'SC' | 'VSC' | 'RED';

export const FLAG_COLORS: Record<RaceFlag, string> = {
    GREEN: '#00E676',
    YELLOW: '#FFC107',
    SC: '#FF9800',
    VSC: '#FF9800',
    RED: '#FF1744',
};

// ─── Race Event Types ─────────────────────────────────────────────────────
export type RaceEventType =
    | 'OVERTAKE'
    | 'PIT_STOP'
    | 'SC_DEPLOY'
    | 'SC_END'
    | 'VSC_DEPLOY'
    | 'VSC_END'
    | 'DNF'
    | 'FASTEST_LAP'
    | 'DRS_ENABLED'
    | 'YELLOW_FLAG'
    | 'PENALTY'
    | 'CRASH';

export type WeatherCondition = 'DRY' | 'LIGHT_RAIN' | 'WET';
export type DriverStatus = 'RUNNING' | 'PIT' | 'OUT';

// ─── Penalty Types ────────────────────────────────────────────────────────
export type PenaltyType =
    | '5_SEC'
    | '10_SEC'
    | 'DRIVE_THROUGH'
    | 'TRACK_LIMITS'
    | 'UNSAFE_RELEASE';

export interface Penalty {
    type: PenaltyType;
    description: string;
    seconds: number;
}

// ─── Core Data Structures ─────────────────────────────────────────────────
export interface DriverStanding {
    position: number;
    driverCode: string;
    driverName: string;
    driverNumber: number;
    teamId: string;
    teamName: string;
    teamColor: string;
    gapToLeader: string;
    interval: string;
    lastLapTime: number;
    bestLapTime: number;
    isFastestLap: boolean;
    compound: TireCompound;
    tyreAge: number;
    pitStops: number;
    status: DriverStatus;
    speed: number;
    sectors: [number, number, number];
    sectorStatus: [SectorStatus, SectorStatus, SectorStatus];
    positionChange: number;
    driverPhoto?: string;
}

export interface RaceEvent {
    type: RaceEventType;
    lap: number;
    description: string;
    drivers: string[];
    penalty?: Penalty;
}

export interface RaceLap {
    lap: number;
    flag: RaceFlag;
    standings: DriverStanding[];
    events: RaceEvent[];
}

export interface RaceConfig {
    circuitId: string;
    circuitName: string;
    country: string;
    totalLaps: number;
    year: number;
}

export interface FullRaceData {
    raceId: string;
    config: RaceConfig;
    laps: RaceLap[];
}

// ─── Circuit ──────────────────────────────────────────────────────────────
export interface Circuit {
    id: string;
    name: string;
    country: string;
    length: number;
    turns: number;
    laps: number;
    drsZones: number;
}

// ─── Qualifying ───────────────────────────────────────────────────────────
export type QualifyingSession = 'Q1' | 'Q2' | 'Q3';

export interface QualifyingResult {
    driverCode: string;
    driverName: string;
    driverNumber: number;
    teamId: string;
    teamName: string;
    teamColor: string;
    q1Time: number | null;
    q2Time: number | null;
    q3Time: number | null;
    bestTime: number;
    position: number;
    eliminated: boolean;
    eliminatedIn: QualifyingSession | null;
    driverPhoto?: string;
}

export interface QualifyingData {
    circuitId: string;
    results: QualifyingResult[];
    sessionTimes: {
        q1: QualifyingResult[];
        q2: QualifyingResult[];
        q3: QualifyingResult[];
    };
}

// ─── Grid Position ────────────────────────────────────────────────────────
export interface GridPosition {
    position: number;
    driverCode: string;
    driverName: string;
    driverNumber: number;
    teamId: string;
    teamName: string;
    teamColor: string;
    qualifyingTime: string;
    driverPhoto?: string;
}

// ─── Simulation Phase (expanded state machine) ───────────────────────────
export type SimulationPhase =
    | 'CIRCUIT_SELECT'
    | 'WEEKEND_INTRO'
    | 'QUALIFYING'
    | 'QUALI_RESULTS'
    | 'GRID_FORMATION'
    | 'RACE_READY'
    | 'RACE_PLAYING'
    | 'RACE_PAUSED'
    | 'RACE_FINISHED';

// ─── Simulation Status (kept for backwards compat) ───────────────────────
export type SimulationStatus = 'IDLE' | 'LOADING' | 'READY' | 'PLAYING' | 'PAUSED' | 'FINISHED';
