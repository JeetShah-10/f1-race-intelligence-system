import { TEAMS_2026_DATA } from './f1-data';
import type {
    RaceLap,
    RaceConfig,
    DriverStanding,
    RaceEvent,
    TireCompound,
    RaceFlag,
    SectorStatus,
    FullRaceData,
    Circuit,
    QualifyingResult,
    QualifyingData,
    GridPosition,
} from '../types/simulation';

// ─── 2026 Driver Database ─────────────────────────────────────────────────
interface DriverInfo {
    code: string;
    name: string;
    number: number;
    teamId: string;
    basePace: number;
    consistency: number;
    racecraft: number;
    photo: string;
}

const DRIVERS_2026: DriverInfo[] = [
    { code: 'VER', name: 'Max Verstappen', number: 1, teamId: 'red-bull', basePace: 0.0, consistency: 0.15, racecraft: 0.95, photo: '/assets/drivers/max-verstappen-removebg-preview.webp' },
    { code: 'HAD', name: 'Isack Hadjar', number: 20, teamId: 'red-bull', basePace: 0.35, consistency: 0.30, racecraft: 0.60, photo: '/assets/drivers/isack-hadjar-removebg-preview.webp' },
    { code: 'LEC', name: 'Charles Leclerc', number: 16, teamId: 'ferrari', basePace: 0.05, consistency: 0.20, racecraft: 0.88, photo: '/assets/drivers/charles-leclerc-removebg-preview.webp' },
    { code: 'HAM', name: 'Lewis Hamilton', number: 44, teamId: 'ferrari', basePace: 0.08, consistency: 0.18, racecraft: 0.92, photo: '/assets/drivers/lewis-hamilton-removebg-preview.webp' },
    { code: 'NOR', name: 'Lando Norris', number: 4, teamId: 'mclaren', basePace: 0.03, consistency: 0.18, racecraft: 0.87, photo: '/assets/drivers/lando-norris-removebg-preview.webp' },
    { code: 'PIA', name: 'Oscar Piastri', number: 81, teamId: 'mclaren', basePace: 0.10, consistency: 0.22, racecraft: 0.82, photo: '/assets/drivers/oscar-piastri-removebg-preview.webp' },
    { code: 'RUS', name: 'George Russell', number: 63, teamId: 'mercedes', basePace: 0.12, consistency: 0.20, racecraft: 0.85, photo: '/assets/drivers/george-russell-removebg-preview.webp' },
    { code: 'ANT', name: 'Kimi Antonelli', number: 12, teamId: 'mercedes', basePace: 0.25, consistency: 0.28, racecraft: 0.70, photo: '/assets/drivers/kimi-antonelli-removebg-preview.webp' },
    { code: 'ALO', name: 'Fernando Alonso', number: 14, teamId: 'aston-martin', basePace: 0.20, consistency: 0.15, racecraft: 0.90, photo: '/assets/drivers/fernando-alonso-removebg-preview.webp' },
    { code: 'STR', name: 'Lance Stroll', number: 18, teamId: 'aston-martin', basePace: 0.40, consistency: 0.32, racecraft: 0.55, photo: '/assets/drivers/lance-stroll-removebg-preview.webp' },
    { code: 'GAS', name: 'Pierre Gasly', number: 10, teamId: 'alpine', basePace: 0.30, consistency: 0.22, racecraft: 0.78, photo: '/assets/drivers/pierre-gasly-removebg-preview.webp' },
    { code: 'COL', name: 'Franco Colapinto', number: 43, teamId: 'alpine', basePace: 0.45, consistency: 0.30, racecraft: 0.62, photo: '/assets/drivers/colapinto-removebg-preview.webp' },
    { code: 'SAI', name: 'Carlos Sainz', number: 55, teamId: 'williams', basePace: 0.18, consistency: 0.18, racecraft: 0.84, photo: '/assets/drivers/carlos-sainz-removebg-preview.webp' },
    { code: 'ALB', name: 'Alex Albon', number: 23, teamId: 'williams', basePace: 0.28, consistency: 0.22, racecraft: 0.76, photo: '/assets/drivers/alex-albon-removebg-preview.webp' },
    { code: 'LAW', name: 'Liam Lawson', number: 30, teamId: 'racing-bulls', basePace: 0.32, consistency: 0.25, racecraft: 0.72, photo: '/assets/drivers/liam-lawson-removebg-preview.webp' },
    { code: 'LIN', name: 'Arvid Lindblad', number: 40, teamId: 'racing-bulls', basePace: 0.42, consistency: 0.32, racecraft: 0.58, photo: '/assets/drivers/arvid-lindblad-removebg-preview.webp' },
    { code: 'HUL', name: 'Nico Hülkenberg', number: 27, teamId: 'audi', basePace: 0.38, consistency: 0.20, racecraft: 0.74, photo: '/assets/drivers/nico-hulkenberg-removebg-preview.webp' },
    { code: 'BOR', name: 'Gabriel Bortoleto', number: 5, teamId: 'audi', basePace: 0.48, consistency: 0.30, racecraft: 0.64, photo: '/assets/drivers/bortoleto-removebg-preview.webp' },
    { code: 'OCO', name: 'Esteban Ocon', number: 31, teamId: 'haas', basePace: 0.35, consistency: 0.22, racecraft: 0.72, photo: '/assets/drivers/esteban-ocon-removebg-preview.webp' },
    { code: 'BEA', name: 'Oliver Bearman', number: 87, teamId: 'haas', basePace: 0.40, consistency: 0.28, racecraft: 0.66, photo: '/assets/drivers/oliver-bearman-removebg-preview.webp' },
    { code: 'PER', name: 'Sergio Pérez', number: 11, teamId: 'cadillac', basePace: 0.50, consistency: 0.30, racecraft: 0.70, photo: '/assets/drivers/sergio-perez-removebg-preview.webp' },
    { code: 'BOT', name: 'Valtteri Bottas', number: 77, teamId: 'cadillac', basePace: 0.52, consistency: 0.25, racecraft: 0.65, photo: '/assets/drivers/valtteri-bottas-removebg-preview.webp' },
];

// ─── 2026 Circuits (IDs MATCH SimulatePage.tsx) ──────────────────────────
export const CIRCUITS_2026: Circuit[] = [
    { id: 'bahrain', name: 'Bahrain Grand Prix', country: 'Bahrain', length: 5.412, turns: 15, laps: 57, drsZones: 3 },
    { id: 'jeddah', name: 'Saudi Arabian Grand Prix', country: 'Saudi Arabia', length: 6.174, turns: 27, laps: 50, drsZones: 3 },
    { id: 'melbourne', name: 'Australian Grand Prix', country: 'Australia', length: 5.278, turns: 14, laps: 58, drsZones: 4 },
    { id: 'suzuka', name: 'Japanese Grand Prix', country: 'Japan', length: 5.807, turns: 18, laps: 53, drsZones: 2 },
    { id: 'shanghai', name: 'Chinese Grand Prix', country: 'China', length: 5.451, turns: 16, laps: 56, drsZones: 2 },
    { id: 'miami', name: 'Miami Grand Prix', country: 'USA', length: 5.412, turns: 19, laps: 57, drsZones: 3 },
    { id: 'monaco', name: 'Monaco Grand Prix', country: 'Monaco', length: 3.337, turns: 19, laps: 78, drsZones: 1 },
    { id: 'barcelona', name: 'Spanish Grand Prix', country: 'Spain', length: 4.675, turns: 16, laps: 66, drsZones: 2 },
    { id: 'canada', name: 'Canadian Grand Prix', country: 'Canada', length: 4.361, turns: 14, laps: 70, drsZones: 2 },
    { id: 'austria', name: 'Austrian Grand Prix', country: 'Austria', length: 4.318, turns: 10, laps: 71, drsZones: 3 },
    { id: 'silverstone', name: 'British Grand Prix', country: 'Great Britain', length: 5.891, turns: 18, laps: 52, drsZones: 2 },
    { id: 'hungary', name: 'Hungarian Grand Prix', country: 'Hungary', length: 4.381, turns: 14, laps: 70, drsZones: 2 },
    { id: 'spa', name: 'Belgian Grand Prix', country: 'Belgium', length: 7.004, turns: 19, laps: 44, drsZones: 2 },
    { id: 'zandvoort', name: 'Dutch Grand Prix', country: 'Netherlands', length: 4.259, turns: 14, laps: 72, drsZones: 2 },
    { id: 'monza', name: 'Italian Grand Prix', country: 'Italy', length: 5.793, turns: 11, laps: 53, drsZones: 2 },
    { id: 'madrid', name: 'Madrid Grand Prix', country: 'Spain', length: 5.470, turns: 16, laps: 66, drsZones: 3 },
    { id: 'baku', name: 'Azerbaijan Grand Prix', country: 'Azerbaijan', length: 6.003, turns: 20, laps: 51, drsZones: 2 },
    { id: 'singapore', name: 'Singapore Grand Prix', country: 'Singapore', length: 4.940, turns: 19, laps: 62, drsZones: 3 },
    { id: 'austin', name: 'United States Grand Prix', country: 'USA', length: 5.513, turns: 20, laps: 56, drsZones: 2 },
    { id: 'mexico', name: 'Mexico City Grand Prix', country: 'Mexico', length: 4.304, turns: 17, laps: 71, drsZones: 3 },
    { id: 'brazil', name: 'São Paulo Grand Prix', country: 'Brazil', length: 4.309, turns: 15, laps: 71, drsZones: 2 },
    { id: 'las_vegas', name: 'Las Vegas Grand Prix', country: 'USA', length: 6.201, turns: 17, laps: 50, drsZones: 2 },
    { id: 'qatar', name: 'Qatar Grand Prix', country: 'Qatar', length: 5.380, turns: 16, laps: 57, drsZones: 2 },
    { id: 'abu_dhabi', name: 'Abu Dhabi Grand Prix', country: 'UAE', length: 5.281, turns: 16, laps: 58, drsZones: 2 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────
function seededRandom(seed: number): () => number {
    let s = seed;
    return () => {
        s = (s * 16807 + 0) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

function getTeamData(teamId: string) {
    const team = TEAMS_2026_DATA.find(t => t.id === teamId);
    return {
        name: team?.shortName || teamId,
        color: team?.color || '#666666',
    };
}

function formatGap(gap: number): string {
    if (gap <= 0) return 'LEADER';
    if (gap >= 60) return '+1 LAP';
    return `+${gap.toFixed(3)}`;
}

function formatInterval(gap: number, prevGap: number): string {
    if (gap <= 0) return '---';
    const diff = gap - prevGap;
    return `+${Math.max(0.001, diff).toFixed(3)}`;
}

function formatQualTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toFixed(3).padStart(6, '0')}`;
}

// ─── Tyre Degradation ─────────────────────────────────────────────────────
const DEGRADATION: Record<TireCompound, { rate: number; cliff: number }> = {
    SOFT: { rate: 0.035, cliff: 22 },
    MEDIUM: { rate: 0.022, cliff: 32 },
    HARD: { rate: 0.014, cliff: 42 },
    INTER: { rate: 0.025, cliff: 28 },
    WET: { rate: 0.018, cliff: 35 },
};

function tyreDeg(compound: TireCompound, age: number): number {
    const d = DEGRADATION[compound];
    if (age < d.cliff) return d.rate * age;
    return d.rate * d.cliff + d.rate * 2.2 * (age - d.cliff);
}

// ─── Pit Strategy Templates ──────────────────────────────────────────────
interface PitPlan {
    compound: TireCompound;
    lap: number;
    newCompound: TireCompound;
}

function getStrategy(driverIndex: number, totalLaps: number): PitPlan[] {
    const strategies: PitPlan[][] = [
        [{ compound: 'MEDIUM', lap: Math.round(totalLaps * 0.40), newCompound: 'HARD' }],
        [{ compound: 'SOFT', lap: Math.round(totalLaps * 0.28), newCompound: 'HARD' }],
        [{ compound: 'HARD', lap: Math.round(totalLaps * 0.50), newCompound: 'MEDIUM' }],
        [{ compound: 'MEDIUM', lap: Math.round(totalLaps * 0.30), newCompound: 'MEDIUM' }],
        [
            { compound: 'SOFT', lap: Math.round(totalLaps * 0.22), newCompound: 'MEDIUM' },
            { compound: 'MEDIUM', lap: Math.round(totalLaps * 0.60), newCompound: 'SOFT' },
        ],
    ];
    return strategies[driverIndex % strategies.length];
}

// ─── Pre-Defined Race Events (with penalties) ────────────────────────────
interface ScheduledEvent {
    lap: number;
    type: RaceEvent['type'];
    description: string;
    drivers: string[];
    flag?: RaceFlag;
    flagDuration?: number;
}

function getScheduledEvents(totalLaps: number): ScheduledEvent[] {
    return [
        { lap: 1, type: 'OVERTAKE', description: 'HAM overtakes RUS into Turn 1', drivers: ['HAM', 'RUS'] },
        { lap: 4, type: 'OVERTAKE', description: 'NOR overtakes LEC at Turn 4', drivers: ['NOR', 'LEC'] },
        { lap: Math.round(totalLaps * 0.12), type: 'PENALTY', description: 'STR — 5 second time penalty (track limits)', drivers: ['STR'] },
        { lap: Math.round(totalLaps * 0.15), type: 'FASTEST_LAP', description: 'VER sets fastest lap — 1:31.456', drivers: ['VER'] },
        { lap: Math.round(totalLaps * 0.25), type: 'OVERTAKE', description: 'PIA overtakes RUS on the straight', drivers: ['PIA', 'RUS'] },
        { lap: Math.round(totalLaps * 0.35), type: 'PENALTY', description: 'OCO — 10 second penalty (causing a collision)', drivers: ['OCO'] },
        { lap: Math.round(totalLaps * 0.38), type: 'CRASH', description: 'STR crashes at Turn 8 — Safety Car deployed', drivers: ['STR'], flag: 'SC', flagDuration: 4 },
        { lap: Math.round(totalLaps * 0.38) + 4, type: 'SC_END', description: 'Safety Car withdrawn — racing resumes', drivers: [] },
        { lap: Math.round(totalLaps * 0.55), type: 'OVERTAKE', description: 'LEC overtakes NOR at the chicane', drivers: ['LEC', 'NOR'] },
        { lap: Math.round(totalLaps * 0.60), type: 'FASTEST_LAP', description: 'NOR sets fastest lap — 1:30.891', drivers: ['NOR'] },
        { lap: Math.round(totalLaps * 0.65), type: 'PENALTY', description: 'HAD — 5 second penalty (unsafe pit release)', drivers: ['HAD'] },
        { lap: Math.round(totalLaps * 0.72), type: 'CRASH', description: 'BOT retires — rear-end collision damage', drivers: ['BOT'] },
        { lap: Math.round(totalLaps * 0.80), type: 'VSC_DEPLOY', description: 'Virtual Safety Car — debris on track', drivers: [], flag: 'VSC', flagDuration: 3 },
        { lap: Math.round(totalLaps * 0.80) + 3, type: 'VSC_END', description: 'VSC ending — racing resumes', drivers: [] },
        { lap: Math.round(totalLaps * 0.90), type: 'OVERTAKE', description: 'VER passes LEC for the lead', drivers: ['VER', 'LEC'] },
        { lap: totalLaps - 2, type: 'FASTEST_LAP', description: 'VER sets fastest lap — 1:30.234', drivers: ['VER'] },
        { lap: Math.round(totalLaps * 0.40), type: 'DNF', description: 'LIN retires — hydraulics failure', drivers: ['LIN'] },
    ];
}

// ─── QUALIFYING GENERATOR ────────────────────────────────────────────────
export function generateMockQualifying(circuitId: string = 'bahrain'): QualifyingData {
    const circuit = CIRCUITS_2026.find(c => c.id === circuitId) || CIRCUITS_2026[0];
    const baseTime = circuit.length * 15.2;
    const rand = seededRandom(99 + circuitId.charCodeAt(0));

    // Generate Q1 times for all 22 drivers
    const q1Results: QualifyingResult[] = DRIVERS_2026.map(d => {
        const teamData = getTeamData(d.teamId);
        const variance = (rand() - 0.5) * d.consistency * 1.5;
        const q1Time = baseTime + d.basePace + variance;
        return {
            driverCode: d.code,
            driverName: d.name,
            driverNumber: d.number,
            teamId: d.teamId,
            teamName: teamData.name,
            teamColor: teamData.color,
            q1Time,
            q2Time: null,
            q3Time: null,
            bestTime: q1Time,
            position: 0,
            eliminated: false,
            eliminatedIn: null,
            driverPhoto: d.photo,
        };
    });

    // Sort by Q1 time and eliminate bottom 5
    q1Results.sort((a, b) => a.q1Time! - b.q1Time!);
    q1Results.forEach((r, i) => r.position = i + 1);

    const q1Eliminated = q1Results.slice(17); // positions 18-22
    q1Eliminated.forEach(r => { r.eliminated = true; r.eliminatedIn = 'Q1'; });

    // Q2: top 17 drivers
    const q2Drivers = q1Results.slice(0, 17);
    q2Drivers.forEach(d => {
        const driver = DRIVERS_2026.find(dr => dr.code === d.driverCode)!;
        const improvement = rand() * 0.3; // drivers improve in Q2
        const variance = (rand() - 0.5) * driver.consistency;
        d.q2Time = baseTime + driver.basePace - improvement + variance;
        d.bestTime = Math.min(d.bestTime, d.q2Time);
    });

    q2Drivers.sort((a, b) => a.q2Time! - b.q2Time!);
    const q2Eliminated = q2Drivers.slice(12); // positions 13-17
    q2Eliminated.forEach(r => { r.eliminated = true; r.eliminatedIn = 'Q2'; });

    // Q3: top 12 drivers (adjusted to 10 for proper F1 format)
    const q3Drivers = q2Drivers.slice(0, 10);
    q3Drivers.forEach(d => {
        const driver = DRIVERS_2026.find(dr => dr.code === d.driverCode)!;
        const improvement = rand() * 0.4; // further improvement in Q3
        const variance = (rand() - 0.5) * driver.consistency * 0.8;
        d.q3Time = baseTime + driver.basePace - improvement + variance;
        d.bestTime = Math.min(d.bestTime, d.q3Time);
    });

    q3Drivers.sort((a, b) => a.q3Time! - b.q3Time!);

    // Build final results: Q3 drivers at top, then Q2 eliminated, then Q1 eliminated
    const finalResults = [
        ...q3Drivers,
        ...q2Eliminated.sort((a, b) => a.q2Time! - b.q2Time!),
        ...q1Eliminated.sort((a, b) => a.q1Time! - b.q1Time!),
    ];
    finalResults.forEach((r, i) => r.position = i + 1);

    return {
        circuitId,
        results: finalResults,
        sessionTimes: {
            q1: [...q1Results],
            q2: [...q2Drivers, ...q2Eliminated].sort((a, b) => (a.q2Time || 999) - (b.q2Time || 999)),
            q3: [...q3Drivers],
        },
    };
}

// ─── GRID GENERATOR (from qualifying results) ───────────────────────────
export function generateGrid(qualifyingData: QualifyingData): GridPosition[] {
    return qualifyingData.results.map(r => ({
        position: r.position,
        driverCode: r.driverCode,
        driverName: r.driverName,
        driverNumber: r.driverNumber,
        teamId: r.teamId,
        teamName: r.teamName,
        teamColor: r.teamColor,
        qualifyingTime: r.q3Time
            ? formatQualTime(r.q3Time)
            : r.q2Time
                ? formatQualTime(r.q2Time)
                : formatQualTime(r.q1Time!),
        driverPhoto: r.driverPhoto,
    }));
}

// ─── RACE GENERATOR ─────────────────────────────────────────────────────
export function generateMockRace(circuitId: string = 'bahrain', gridOrder?: GridPosition[]): FullRaceData {
    const circuit = CIRCUITS_2026.find(c => c.id === circuitId) || CIRCUITS_2026[0];
    const totalLaps = circuit.laps;
    const baseTime = circuit.length * 15.2;
    const rand = seededRandom(42 + circuitId.charCodeAt(0));

    const config: RaceConfig = {
        circuitId: circuit.id,
        circuitName: circuit.name,
        country: circuit.country,
        totalLaps,
        year: 2026,
    };

    // Use grid order if provided, otherwise sort by qualifying pace
    let startOrder: DriverInfo[];
    if (gridOrder) {
        startOrder = gridOrder.map(g => DRIVERS_2026.find(d => d.code === g.driverCode)!).filter(Boolean);
    } else {
        startOrder = [...DRIVERS_2026]
            .map(d => ({ ...d, qualTime: d.basePace + (rand() - 0.5) * 0.3 }))
            .sort((a, b) => a.qualTime - b.qualTime);
    }

    // Initialize driver state
    interface DriverState {
        info: DriverInfo;
        cumulativeTime: number;
        compound: TireCompound;
        tyreAge: number;
        pitStops: number;
        status: 'RUNNING' | 'PIT' | 'OUT';
        pitPlan: PitPlan[];
        bestLap: number;
        lastLap: number;
        prevPosition: number;
    }

    const drivers: DriverState[] = startOrder.map((d, i) => {
        const plan = getStrategy(i, totalLaps);
        return {
            info: d,
            cumulativeTime: i * 0.3,
            compound: plan[0].compound,
            tyreAge: 0,
            pitStops: 0,
            status: 'RUNNING' as const,
            pitPlan: plan,
            bestLap: 999,
            lastLap: baseTime,
            prevPosition: i + 1,
        };
    });

    const scheduledEvents = getScheduledEvents(totalLaps);
    let currentFlag: RaceFlag = 'GREEN';
    let flagLapsRemaining = 0;
    let fastestLapDriver = '';
    let fastestLapTime = 999;

    const laps: RaceLap[] = [];

    for (let lap = 1; lap <= totalLaps; lap++) {
        const events: RaceEvent[] = [];

        // Check scheduled events for this lap
        const lapEvents = scheduledEvents.filter(e => e.lap === lap);
        for (const ev of lapEvents) {
            events.push({ type: ev.type, lap, description: ev.description, drivers: ev.drivers });

            if (ev.flag) {
                currentFlag = ev.flag;
                flagLapsRemaining = ev.flagDuration || 3;
            }
            if (ev.type === 'SC_END' || ev.type === 'VSC_END') {
                currentFlag = 'GREEN';
                flagLapsRemaining = 0;
            }
            if (ev.type === 'DNF' || ev.type === 'CRASH') {
                const d = drivers.find(dr => dr.info.code === ev.drivers[0]);
                if (d) d.status = 'OUT';
            }
        }

        // Decrement flag timer
        if (flagLapsRemaining > 0) {
            flagLapsRemaining--;
            if (flagLapsRemaining === 0 && (currentFlag === 'SC' || currentFlag === 'VSC')) {
                currentFlag = 'GREEN';
            }
        }

        // SC bunching
        const isSC = currentFlag === 'SC';

        // Simulate each driver's lap
        for (const d of drivers) {
            if (d.status === 'OUT') continue;

            // Check pit plan
            const pitThisLap = d.pitPlan.find(p => p.lap === lap);
            if (pitThisLap) {
                d.status = 'PIT';
                d.compound = pitThisLap.newCompound;
                d.tyreAge = 0;
                d.pitStops++;
                d.cumulativeTime += 22 + rand() * 3;
                events.push({
                    type: 'PIT_STOP',
                    lap,
                    description: `${d.info.code} pits for ${pitThisLap.newCompound} tyres`,
                    drivers: [d.info.code],
                });
            } else {
                d.status = 'RUNNING';
            }

            d.tyreAge++;
            const deg = tyreDeg(d.compound, d.tyreAge);
            const variance = (rand() - 0.5) * d.info.consistency * 2;
            const scSlowdown = isSC ? 8 : currentFlag === 'VSC' ? 4 : 0;
            const lapTime = baseTime + d.info.basePace + deg + variance + scSlowdown;

            d.lastLap = lapTime;
            d.cumulativeTime += lapTime;

            if (lapTime < d.bestLap) d.bestLap = lapTime;
            if (lapTime < fastestLapTime && d.status === 'RUNNING') {
                fastestLapTime = lapTime;
                fastestLapDriver = d.info.code;
            }
        }

        // SC bunching: reduce gaps
        if (isSC) {
            const running = drivers.filter(d => d.status !== 'OUT').sort((a, b) => a.cumulativeTime - b.cumulativeTime);
            for (let i = 1; i < running.length; i++) {
                const gap = running[i].cumulativeTime - running[0].cumulativeTime;
                if (gap > 2) {
                    running[i].cumulativeTime = running[0].cumulativeTime + 1.0 + (i * 0.3);
                }
            }
        }

        // Sort by cumulative time
        const sorted = [...drivers]
            .filter(d => d.status !== 'OUT')
            .sort((a, b) => a.cumulativeTime - b.cumulativeTime);
        const retired = drivers.filter(d => d.status === 'OUT');

        const leaderTime = sorted[0]?.cumulativeTime || 0;

        const standings: DriverStanding[] = sorted.map((d, i) => {
            const teamData = getTeamData(d.info.teamId);
            const gap = d.cumulativeTime - leaderTime;
            const prevGap = i > 0 ? sorted[i - 1].cumulativeTime - leaderTime : 0;
            const posChange = d.prevPosition - (i + 1);
            d.prevPosition = i + 1;

            const s1 = d.lastLap * 0.32 + (rand() - 0.5) * 0.2;
            const s2 = d.lastLap * 0.38 + (rand() - 0.5) * 0.2;
            const s3 = d.lastLap - s1 - s2;

            const makeSectorStatus = (): SectorStatus => {
                const r = rand();
                if (r < 0.08) return 'PURPLE';
                if (r < 0.35) return 'GREEN';
                return 'YELLOW';
            };

            return {
                position: i + 1,
                driverCode: d.info.code,
                driverName: d.info.name,
                driverNumber: d.info.number,
                teamId: d.info.teamId,
                teamName: teamData.name,
                teamColor: teamData.color,
                gapToLeader: formatGap(gap),
                interval: i === 0 ? '---' : formatInterval(gap, prevGap),
                lastLapTime: parseFloat(d.lastLap.toFixed(3)),
                bestLapTime: parseFloat(d.bestLap.toFixed(3)),
                isFastestLap: d.info.code === fastestLapDriver,
                compound: d.compound,
                tyreAge: d.tyreAge,
                pitStops: d.pitStops,
                status: d.status === 'PIT' ? 'PIT' : 'RUNNING',
                speed: Math.round(280 + rand() * 60),
                sectors: [parseFloat(s1.toFixed(3)), parseFloat(s2.toFixed(3)), parseFloat(s3.toFixed(3))],
                sectorStatus: [makeSectorStatus(), makeSectorStatus(), makeSectorStatus()],
                positionChange: posChange,
                driverPhoto: d.info.photo,
            };
        });

        // Add retired drivers at the bottom
        for (const d of retired) {
            const teamData = getTeamData(d.info.teamId);
            standings.push({
                position: standings.length + 1,
                driverCode: d.info.code,
                driverName: d.info.name,
                driverNumber: d.info.number,
                teamId: d.info.teamId,
                teamName: teamData.name,
                teamColor: teamData.color,
                gapToLeader: 'OUT',
                interval: 'OUT',
                lastLapTime: 0,
                bestLapTime: d.bestLap,
                isFastestLap: false,
                compound: d.compound,
                tyreAge: d.tyreAge,
                pitStops: d.pitStops,
                status: 'OUT',
                speed: 0,
                sectors: [0, 0, 0],
                sectorStatus: ['NONE', 'NONE', 'NONE'],
                positionChange: 0,
                driverPhoto: d.info.photo,
            });
        }

        laps.push({ lap, flag: currentFlag, standings, events });
    }

    return {
        raceId: `mock-${circuitId}-2026`,
        config,
        laps,
    };
}

export function getCircuitById(id: string): Circuit | undefined {
    return CIRCUITS_2026.find(c => c.id === id);
}
