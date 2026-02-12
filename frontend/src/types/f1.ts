/**
 * F1 Intelligence Platform - Core Type Definitions
 * Based on FastF1 data structures for compatibility with backend
 */

// ============================================================================
// DRIVER TYPES
// ============================================================================

export interface Driver {
    /** Driver code (e.g., "VER", "HAM") */
    code: string;
    /** First name */
    firstName: string;
    /** Last name */
    lastName: string;
    /** Car number */
    number: number;
    /** Team name */
    team: string;
    /** Team color (hex) */
    teamColor: string;
    /** Nationality */
    nationality: string;
    /** URL to driver headshot image */
    headshotUrl?: string;
    /** Full name convenience property */
    fullName?: string;
}

export interface DriverInfo {
    /** Driver abbreviation code */
    Abbreviation: string;
    /** Broadcast name (e.g., "M VERSTAPPEN") */
    BroadcastName: string;
    /** Driver number as string */
    DriverNumber: string;
    /** First name */
    FirstName: string;
    /** Full name */
    FullName: string;
    /** Last name */
    LastName: string;
    /** Team color hex code */
    TeamColor: string;
    /** Team name */
    TeamName: string;
    /** Country code */
    CountryCode: string;
}

// ============================================================================
// CIRCUIT TYPES
// ============================================================================

export interface Circuit {
    /** Unique circuit identifier */
    id: string;
    /** Full circuit name */
    name: string;
    /** Country name */
    country: string;
    /** Track length in kilometers */
    length: number;
    /** Number of turns */
    turns: number;
    /** Lap record time formatted as string (e.g., "1:27.097") */
    lapRecord: string;
    /** Lap record holder name */
    lapRecordHolder: string;
    /** Lap record year */
    lapRecordYear: number;
    /** City/location */
    location: string;
    /** Track image URL */
    imageUrl?: string;
    /** DRS zones count */
    drsZones: number;
}

export interface CircuitDetailed extends Circuit {
    /** Sector distances [S1, S2, S3] as fraction of lap */
    sectorDistances: [number, number, number];
    /** First Grand Prix year */
    firstGrandPrix: number;
    /** Number of laps in a race */
    raceLaps: number;
    /** Race distance in km */
    raceDistance: number;
    /** Timezone */
    timezone: string;
}

// ============================================================================
// LAP DATA TYPES (FastF1 Compatible)
// ============================================================================

export type TyreCompound = 'SOFT' | 'MEDIUM' | 'HARD' | 'INTER' | 'WET';

export const TYRE_COLORS: Record<TyreCompound, string> = {
    SOFT: '#FF3333',    // Red
    MEDIUM: '#FFC906',  // Yellow
    HARD: '#FFFFFF',    // White
    INTER: '#47C839',   // Green
    WET: '#0390FC',     // Blue
};

export interface Lap {
    /** Lap number */
    lapNumber: number;
    /** Driver code */
    driver: string;
    /** Lap time in milliseconds */
    lapTime: number;
    /** Sector 1 time in milliseconds */
    sector1: number;
    /** Sector 2 time in milliseconds */
    sector2: number;
    /** Sector 3 time in milliseconds */
    sector3: number;
    /** Tyre compound used */
    compound: TyreCompound;
    /** Tyre age in laps */
    tyreLife: number;
    /** Position at end of lap */
    position: number;
    /** Gap to leader in seconds */
    gap: number;
    /** Interval to car ahead in seconds */
    interval?: number;
    /** Is this a personal best lap? */
    isPersonalBest?: boolean;
    /** Is fresh tyre? */
    freshTyre?: boolean;
    /** Stint number */
    stint?: number;
}

export interface LapDetailed extends Lap {
    /** Speed at Intermediate 1 (km/h) */
    speedI1: number;
    /** Speed at Intermediate 2 (km/h) */
    speedI2: number;
    /** Speed at Finish Line (km/h) */
    speedFL: number;
    /** Speed Trap speed (km/h) */
    speedST: number;
    /** Was the lap deleted? */
    deleted?: boolean;
    /** Reason for deletion if applicable */
    deletedReason?: string;
    /** Is lap timing accurate? */
    isAccurate?: boolean;
}

// ============================================================================
// STANDINGS TYPES
// ============================================================================

export interface DriverStanding {
    /** Current position in standings */
    position: number;
    /** Driver code */
    driver: string;
    /** Driver full name */
    driverName: string;
    /** Team name */
    team: string;
    /** Total championship points */
    points: number;
    /** Number of race wins */
    wins: number;
    /** Number of podiums */
    podiums?: number;
    /** Number of pole positions */
    poles?: number;
    /** Number of fastest laps */
    fastestLaps?: number;
    /** Points gained in last race */
    lastRacePoints?: number;
}

export interface ConstructorStanding {
    /** Current position in standings */
    position: number;
    /** Team/constructor name */
    team: string;
    /** Short team name */
    shortName: string;
    /** Team color (hex) */
    teamColor: string;
    /** Total championship points */
    points: number;
    /** Number of race wins */
    wins: number;
    /** Drivers in this team */
    drivers: [string, string];
}

// ============================================================================
// SESSION & RACE TYPES
// ============================================================================

export type SessionType = 'FP1' | 'FP2' | 'FP3' | 'Q' | 'SPRINT' | 'R';

export interface Session {
    /** Session identifier */
    id: string;
    /** Session type */
    type: SessionType;
    /** Session name */
    name: string;
    /** Associated circuit */
    circuit: Circuit;
    /** Session date */
    date: string;
    /** Scheduled start time */
    startTime: string;
    /** Total laps (for race) */
    totalLaps?: number;
}

export interface RaceWeekend {
    /** Round number */
    round: number;
    /** Grand Prix name */
    name: string;
    /** Country */
    country: string;
    /** Circuit info */
    circuit: Circuit;
    /** All sessions */
    sessions: Session[];
    /** Race date */
    date: string;
    /** Is sprint weekend? */
    isSprint: boolean;
}

// ============================================================================
// TELEMETRY TYPES
// ============================================================================

export interface TelemetryPoint {
    /** Distance into lap (meters) */
    distance: number;
    /** Speed (km/h) */
    speed: number;
    /** Throttle position (0-100) */
    throttle: number;
    /** Brake position (0-100) */
    brake: number;
    /** Current gear */
    gear: number;
    /** Engine RPM */
    rpm: number;
    /** DRS status */
    drs: boolean;
    /** ERS deployment */
    ers?: number;
}

export interface CarTelemetry {
    /** Driver code */
    driver: string;
    /** Lap number */
    lap: number;
    /** Telemetry data points */
    points: TelemetryPoint[];
}

// ============================================================================
// WEATHER TYPES
// ============================================================================

export interface WeatherData {
    /** Timestamp */
    time: string;
    /** Air temperature (°C) */
    airTemp: number;
    /** Track temperature (°C) */
    trackTemp: number;
    /** Humidity (%) */
    humidity: number;
    /** Wind speed (km/h) */
    windSpeed: number;
    /** Wind direction (degrees) */
    windDirection: number;
    /** Is it raining? */
    rainfall: boolean;
    /** Atmospheric pressure (mbar) */
    pressure?: number;
}

// ============================================================================
// PREDICTION TYPES
// ============================================================================

export interface RacePrediction {
    /** Driver code */
    driver: string;
    /** Predicted finish position */
    predictedPosition: number;
    /** Confidence level (0-1) */
    confidence: number;
    /** Suggested strategy */
    strategy?: string;
}

export interface QualifyingPrediction {
    /** Driver code */
    driver: string;
    /** Predicted grid position */
    predictedPosition: number;
    /** Predicted Q3 time (if applicable) */
    predictedTime?: number;
    /** Confidence level (0-1) */
    confidence: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/** Format milliseconds to lap time string (e.g., "1:27.097") */
export function formatLapTime(ms: number): string {
    if (ms <= 0) return '--:--.---';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const millis = ms % 1000;
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
}

/** Parse lap time string to milliseconds */
export function parseLapTime(timeStr: string): number {
    const match = timeStr.match(/^(\d+):(\d+)\.(\d+)$/);
    if (!match) return 0;
    const [, min, sec, ms] = match;
    return parseInt(min) * 60000 + parseInt(sec) * 1000 + parseInt(ms);
}

/** Format gap/interval for display */
export function formatGap(seconds: number): string {
    if (seconds === 0) return 'LEADER';
    if (seconds < 0) return '--';
    return `+${seconds.toFixed(3)}`;
}
