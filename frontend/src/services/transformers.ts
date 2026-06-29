/**
 * Transformer Layer - Backend -> Frontend Schema Bridge
 *
 * Converts flat backend SimulationResult / QualifyingResult
 * into the per-lap / per-session format the frontend playback engine expects.
 */

import type {
    RaceLap,
    RaceConfig,
    DriverStanding,
    RaceEvent,
    RaceFlag,
    FullRaceData,
    TireCompound,
    SectorStatus,
    QualifyingResult,
    QualifyingData,
    Circuit,
} from '../types/simulation';
import type {
    BackendSimulationResult,
    BackendDriverResult,
    BackendLapData,
    BackendQualifyingResult,
} from './api';
import type { LapUpdateFrame } from './websocket';
import { DRIVERS_2026 as DRIVERS_DATA, TEAMS_2026 as TEAMS_DATA } from '../data/f1-data';

//  Helper lookups 

function getTeamColor(teamName: string): string {
    // Backend uses team names like "Red Bull Racing", "Ferrari", "McLaren"
    // Try matching against team shortName, name, or id
    const lower = teamName.toLowerCase();
    const team = TEAMS_DATA.find(
        t =>
            t.shortName.toLowerCase() === lower ||
            t.name.toLowerCase().includes(lower) ||
            lower.includes(t.id)
    );
    return team?.color || '#666666';
}

function getTeamShortName(teamName: string): string {
    const lower = teamName.toLowerCase();
    const team = TEAMS_DATA.find(
        t =>
            t.shortName.toLowerCase() === lower ||
            t.name.toLowerCase().includes(lower) ||
            lower.includes(t.id)
    );
    return team?.shortName || teamName;
}

function getTeamId(teamName: string): string {
    const lower = teamName.toLowerCase();
    const team = TEAMS_DATA.find(
        t =>
            t.shortName.toLowerCase() === lower ||
            t.name.toLowerCase().includes(lower) ||
            lower.includes(t.id)
    );
    return team?.id || teamName.toLowerCase().replace(/\s+/g, '-');
}

export function getDriverInfo(driverCode: string) {
    return DRIVERS_DATA.find(d => d.code === driverCode);
}

function formatGapStr(gap: number): string {
    if (gap <= 0) return 'LEADER';
    if (gap >= 60) return '+1 LAP';
    return `+${gap.toFixed(3)}`;
}

function formatIntervalStr(gap: number, prevGap: number): string {
    if (gap <= 0) return '---';
    const diff = gap - prevGap;
    return `+${Math.max(0.001, diff).toFixed(3)}`;
}

function classifySector(sectorTime: number | null, allTimes: (number | null)[]): SectorStatus {
    if (sectorTime == null || sectorTime <= 0) return 'NONE';
    const valid = allTimes.filter((t): t is number => t != null && t > 0);
    if (valid.length === 0) return 'YELLOW';
    const best = Math.min(...valid);
    if (sectorTime <= best * 1.001) return 'PURPLE';
    if (sectorTime <= best * 1.005) return 'GREEN';
    return 'YELLOW';
}

function validCompound(c: string): TireCompound {
    const upper = c.toUpperCase();
    if (['SOFT', 'MEDIUM', 'HARD', 'INTER', 'WET'].includes(upper)) {
        return upper as TireCompound;
    }
    return 'MEDIUM';
}

//  Simulation Result Transformer 

export function transformSimulationResult(
    backend: BackendSimulationResult,
    circuitMeta?: Circuit | null,
): FullRaceData {
    const totalLaps = backend.total_laps;
    const circuitId = backend.circuit;
    const results = backend.results; // DriverResult[], one per driver

    // Build config
    const config: RaceConfig = {
        circuitId,
        circuitName: circuitMeta?.name || circuitId,
        country: circuitMeta?.country || '',
        totalLaps,
        year: 2026,
    };

    // Track cumulative times per driver
    const cumulativeTimes: Record<string, number> = {};
    const bestLapTimes: Record<string, number> = {};
    const pitStopCounts: Record<string, number> = {};
    let globalFastestTime = Infinity;
    let globalFastestDriver = '';

    // Initialize
    for (const dr of results) {
        cumulativeTimes[dr.driver_id] = 0;
        bestLapTimes[dr.driver_id] = Infinity;
        pitStopCounts[dr.driver_id] = 0;
    }

    // Build laps-to-pit-stop map
    const pitLaps: Record<string, Set<number>> = {};
    for (const dr of results) {
        pitLaps[dr.driver_id] = new Set(dr.pit_stops.map(p => p.lap));
    }

    // Build laps-to-event map (driver-level events from backend)
    const driverEventsByLap: Record<number, RaceEvent[]> = {};

    // Track DNF drivers
    const dnfLap: Record<string, number> = {};
    for (const dr of results) {
        if (dr.status === 'DNF') {
            // DNF drivers have fewer laps
            dnfLap[dr.driver_id] = dr.laps.length;
        }
        for (const ev of dr.events) {
            const lap = ev.lap;
            if (!driverEventsByLap[lap]) driverEventsByLap[lap] = [];
            driverEventsByLap[lap].push({
                type: mapEventType(ev.type),
                lap,
                description: ev.description || `${dr.driver_id}: ${ev.type}`,
                drivers: [dr.driver_id],
            });
        }
    }

    // Build per-lap RaceLap[]
    const laps: RaceLap[] = [];

    for (let lapNum = 1; lapNum <= totalLaps; lapNum++) {
        const events: RaceEvent[] = [...(driverEventsByLap[lapNum] || [])];
        const standings: DriverStanding[] = [];
        const allSector1: (number | null)[] = [];
        const allSector2: (number | null)[] = [];
        const allSector3: (number | null)[] = [];

        // First pass: collect data and cumulative times
        interface LapEntry {
            dr: BackendDriverResult;
            lapData: BackendLapData | null;
            cumTime: number;
            isOut: boolean;
        }

        const entries: LapEntry[] = [];

        for (const dr of results) {
            const lapData = dr.laps.find(l => l.lap === lapNum) || null;
            const isOut =
                dr.status === 'DNF' && (dnfLap[dr.driver_id] || Infinity) < lapNum;

            if (lapData && !isOut) {
                cumulativeTimes[dr.driver_id] += lapData.time;
                if (lapData.time < bestLapTimes[dr.driver_id]) {
                    bestLapTimes[dr.driver_id] = lapData.time;
                }
                if (lapData.time < globalFastestTime) {
                    globalFastestTime = lapData.time;
                    globalFastestDriver = dr.driver_id;
                }

                allSector1.push(lapData.sector_1);
                allSector2.push(lapData.sector_2);
                allSector3.push(lapData.sector_3);
            }

            // Track pit stops
            if (pitLaps[dr.driver_id]?.has(lapNum)) {
                pitStopCounts[dr.driver_id]++;
                const pitInfo = dr.pit_stops.find(p => p.lap === lapNum);
                events.push({
                    type: 'PIT_STOP',
                    lap: lapNum,
                    description: `${dr.driver_id} pits for ${pitInfo?.compound || 'new'} tyres`,
                    drivers: [dr.driver_id],
                });
            }

            entries.push({
                dr,
                lapData,
                cumTime: cumulativeTimes[dr.driver_id],
                isOut,
            });
        }

        // Sort running drivers by cumulative time
        const running = entries
            .filter(e => !e.isOut)
            .sort((a, b) => a.cumTime - b.cumTime);
        const retired = entries.filter(e => e.isOut);
        const leaderTime = running[0]?.cumTime || 0;

        // Build standings
        let position = 1;
        for (const entry of running) {
            const { dr, lapData } = entry;
            const driverInfo = getDriverInfo(dr.driver_id);
            const gap = entry.cumTime - leaderTime;
            const prevIdx = position - 2;
            const prevGap = prevIdx >= 0 ? running[prevIdx].cumTime - leaderTime : 0;

            const s1 = lapData?.sector_1 ?? (lapData ? lapData.time * 0.32 : 0);
            const s2 = lapData?.sector_2 ?? (lapData ? lapData.time * 0.38 : 0);
            const s3 = lapData?.sector_3 ?? (lapData ? lapData.time - s1 - s2 : 0);

            const isPitting = pitLaps[dr.driver_id]?.has(lapNum) || false;

            standings.push({
                position,
                driverCode: dr.driver_id,
                driverName: driverInfo?.name || dr.driver_id,
                driverNumber: driverInfo?.number || 0,
                teamId: getTeamId(dr.team),
                teamName: getTeamShortName(dr.team),
                teamColor: getTeamColor(dr.team),
                gapToLeader: formatGapStr(gap),
                interval: position === 1 ? '---' : formatIntervalStr(gap, prevGap),
                lastLapTime: lapData ? parseFloat(lapData.time.toFixed(3)) : 0,
                bestLapTime: parseFloat(bestLapTimes[dr.driver_id].toFixed(3)),
                isFastestLap: dr.driver_id === globalFastestDriver,
                compound: validCompound(lapData?.compound || 'MEDIUM'),
                tyreAge: lapData?.tyre_age ?? 0,
                pitStops: pitStopCounts[dr.driver_id],
                status: isPitting ? 'PIT' : 'RUNNING',
                speed: Math.round(280 + Math.random() * 60),
                sectors: [
                    parseFloat(s1.toFixed(3)),
                    parseFloat(s2.toFixed(3)),
                    parseFloat(s3.toFixed(3)),
                ],
                sectorStatus: [
                    classifySector(lapData?.sector_1 ?? null, allSector1),
                    classifySector(lapData?.sector_2 ?? null, allSector2),
                    classifySector(lapData?.sector_3 ?? null, allSector3),
                ],
                positionChange: 0, // Computed below
                driverPhoto: driverInfo?.images.cutout,
            });

            position++;
        }

        // Add retired drivers at the bottom
        for (const entry of retired) {
            const { dr } = entry;
            const driverInfo = getDriverInfo(dr.driver_id);
            standings.push({
                position,
                driverCode: dr.driver_id,
                driverName: driverInfo?.name || dr.driver_id,
                driverNumber: driverInfo?.number || 0,
                teamId: getTeamId(dr.team),
                teamName: getTeamShortName(dr.team),
                teamColor: getTeamColor(dr.team),
                gapToLeader: 'OUT',
                interval: 'OUT',
                lastLapTime: 0,
                bestLapTime: bestLapTimes[dr.driver_id] === Infinity
                    ? 0
                    : parseFloat(bestLapTimes[dr.driver_id].toFixed(3)),
                isFastestLap: false,
                compound: validCompound(
                    dr.laps[dr.laps.length - 1]?.compound || 'MEDIUM',
                ),
                tyreAge: dr.laps[dr.laps.length - 1]?.tyre_age ?? 0,
                pitStops: pitStopCounts[dr.driver_id],
                status: 'OUT',
                speed: 0,
                sectors: [0, 0, 0],
                sectorStatus: ['NONE', 'NONE', 'NONE'],
                positionChange: 0,
                driverPhoto: driverInfo?.images.cutout,
            });
            position++;
        }

        // Determine flag from events
        let flag: RaceFlag = 'GREEN';
        for (const ev of events) {
            if (ev.type === 'CRASH' || ev.description?.toLowerCase().includes('safety car')) {
                flag = 'SC';
                break;
            }
        }

        laps.push({ lap: lapNum, flag, standings, events });
    }

    // Second pass: compute position changes vs previous lap
    for (let i = 1; i < laps.length; i++) {
        const prevStandings = laps[i - 1].standings;
        const currStandings = laps[i].standings;
        for (const curr of currStandings) {
            const prev = prevStandings.find(s => s.driverCode === curr.driverCode);
            if (prev) {
                curr.positionChange = prev.position - curr.position;
            }
        }
    }

    return {
        raceId: `sim-${circuitId}-${Date.now()}`,
        config,
        laps,
    };
}

//  Event Type Mapping 

function mapEventType(backendType: string): RaceEvent['type'] {
    const map: Record<string, RaceEvent['type']> = {
        overtake: 'OVERTAKE',
        pit_stop: 'PIT_STOP',
        crash: 'CRASH',
        dnf: 'DNF',
        fastest_lap: 'FASTEST_LAP',
        sc: 'SC_DEPLOY',
        sc_end: 'SC_END',
        vsc: 'VSC_DEPLOY',
        vsc_end: 'VSC_END',
        penalty: 'PENALTY',
        drs: 'DRS_ENABLED',
        yellow_flag: 'YELLOW_FLAG',
        SC_DEPLOY: 'SC_DEPLOY',
        VSC_DEPLOY: 'VSC_DEPLOY',
        OVERTAKE: 'OVERTAKE',
        PIT_STOP: 'PIT_STOP',
        CRASH: 'CRASH',
        DNF: 'DNF',
        FASTEST_LAP: 'FASTEST_LAP',
        SC_END: 'SC_END',
        VSC_END: 'VSC_END',
        PENALTY: 'PENALTY',
    };
    return map[backendType] || 'OVERTAKE';
}

//  Qualifying Result Transformer 

export function transformQualifyingResult(
    backend: BackendQualifyingResult,
): QualifyingData {
    const circuitId = backend.circuit_id;

    // Build frontend QualifyingResult[] with enriched driver/team data
    const frontendResults: QualifyingResult[] = backend.results.map(item => {
        const driverInfo = getDriverInfo(item.driver_id);
        const teamColor = getTeamColor(item.team);
        const teamName = getTeamShortName(item.team);
        const teamId = getTeamId(item.team);

        // Determine elimination status
        let eliminated = false;
        let eliminatedIn: 'Q1' | 'Q2' | 'Q3' | null = null;

        if (item.q3_time == null && item.q2_time != null) {
            eliminated = true;
            eliminatedIn = 'Q2';
        } else if (item.q2_time == null && item.q1_time != null) {
            eliminated = true;
            eliminatedIn = 'Q1';
        }

        return {
            driverCode: item.driver_id,
            driverName: driverInfo?.name || item.driver_id,
            driverNumber: driverInfo?.number || 0,
            teamId,
            teamName,
            teamColor,
            q1Time: item.q1_time,
            q2Time: item.q2_time,
            q3Time: item.q3_time,
            bestTime: item.best_time || item.q1_time || 0,
            position: item.position,
            eliminated,
            eliminatedIn,
            driverPhoto: driverInfo?.images.cutout,
        };
    });

    // Sort by position
    frontendResults.sort((a, b) => a.position - b.position);

    // Build session arrays
    const q1Results = frontendResults
        .filter(r => r.q1Time != null)
        .sort((a, b) => (a.q1Time || 999) - (b.q1Time || 999));

    const q2Results = frontendResults
        .filter(r => r.q2Time != null)
        .sort((a, b) => (a.q2Time || 999) - (b.q2Time || 999));

    const q3Results = frontendResults
        .filter(r => r.q3Time != null)
        .sort((a, b) => (a.q3Time || 999) - (b.q3Time || 999));

    return {
        circuitId,
        results: frontendResults,
        sessionTimes: {
            q1: q1Results,
            q2: q2Results,
            q3: q3Results,
        },
    };
}

export function transformLapUpdate(
    frame: LapUpdateFrame,
    bestLapTimes: Record<string, number>,
    pitStopCounts: Record<string, number>,
    previousPositions: Record<string, number>,
    globalFastest: { driver: string; time: number }
): RaceLap {
    const standings: DriverStanding[] = [];
    const lapNum = frame.lap;

    // Collect sector times for sector status classification
    const allSector1 = frame.drivers.map(d => d.sector_times[0] ?? null);
    const allSector2 = frame.drivers.map(d => d.sector_times[1] ?? null);
    const allSector3 = frame.drivers.map(d => d.sector_times[2] ?? null);

    // Sort running drivers by position (position is 1-indexed in frame)
    const sortedRunning = [...frame.drivers].sort((a, b) => a.position - b.position);

    let position = 1;
    for (const dr of sortedRunning) {
        const driverInfo = getDriverInfo(dr.driver_id);
        const gap = dr.gap_to_leader;
        
        // Update best lap time
        if (dr.last_lap_time > 0 && dr.last_lap_time < (bestLapTimes[dr.driver_id] || Infinity)) {
            bestLapTimes[dr.driver_id] = dr.last_lap_time;
        }

        // Update global fastest lap
        if (dr.last_lap_time > 0 && dr.last_lap_time < globalFastest.time) {
            globalFastest.time = dr.last_lap_time;
            globalFastest.driver = dr.driver_id;
        }

        // Track pit stops
        const prevPits = pitStopCounts[dr.driver_id] || 0;
        pitStopCounts[dr.driver_id] = dr.pit_stops;

        const s1 = dr.sector_times[0] ?? 0;
        const s2 = dr.sector_times[1] ?? 0;
        const s3 = dr.sector_times[2] ?? 0;

        const prevPos = previousPositions[dr.driver_id] ?? position;
        const posChange = prevPos - position;
        previousPositions[dr.driver_id] = position; // Update for next lap

        const isPitting = dr.pit_stops > prevPits;

        standings.push({
            position,
            driverCode: dr.driver_id,
            driverName: driverInfo?.name || dr.driver_id,
            driverNumber: driverInfo?.number || 0,
            teamId: getTeamId(driverInfo?.teamId || 'unknown'),
            teamName: getTeamShortName(driverInfo?.teamId || 'unknown'),
            teamColor: getTeamColor(driverInfo?.teamId || 'unknown'),
            gapToLeader: formatGapStr(gap),
            interval: position === 1 ? '---' : `+${dr.interval.toFixed(3)}`,
            lastLapTime: parseFloat(dr.last_lap_time.toFixed(3)),
            bestLapTime: bestLapTimes[dr.driver_id] && bestLapTimes[dr.driver_id] !== Infinity ? parseFloat(bestLapTimes[dr.driver_id].toFixed(3)) : 0,
            isFastestLap: dr.driver_id === globalFastest.driver,
            compound: validCompound(dr.tyre_compound),
            tyreAge: dr.tyre_age,
            pitStops: dr.pit_stops,
            status: isPitting ? 'PIT' : 'RUNNING',
            speed: Math.round(280 + Math.random() * 60),
            sectors: [
                parseFloat(s1.toFixed(3)),
                parseFloat(s2.toFixed(3)),
                parseFloat(s3.toFixed(3)),
            ],
            sectorStatus: [
                classifySector(dr.sector_times[0] ?? null, allSector1),
                classifySector(dr.sector_times[1] ?? null, allSector2),
                classifySector(dr.sector_times[2] ?? null, allSector3),
            ],
            positionChange: posChange,
            driverPhoto: driverInfo?.images.cutout,
        });

        position++;
    }

    // Handle retired drivers
    const participatingDrivers = Object.keys(previousPositions);
    const runningCodes = new Set(sortedRunning.map(d => d.driver_id));
    const retiredCodes = participatingDrivers.filter(code => !runningCodes.has(code));

    for (const code of retiredCodes) {
        const driverInfo = getDriverInfo(code);
        standings.push({
            position,
            driverCode: code,
            driverName: driverInfo?.name || code,
            driverNumber: driverInfo?.number || 0,
            teamId: getTeamId(driverInfo?.teamId || 'unknown'),
            teamName: getTeamShortName(driverInfo?.teamId || 'unknown'),
            teamColor: getTeamColor(driverInfo?.teamId || 'unknown'),
            gapToLeader: 'OUT',
            interval: 'OUT',
            lastLapTime: 0,
            bestLapTime: bestLapTimes[code] && bestLapTimes[code] !== Infinity ? parseFloat(bestLapTimes[code].toFixed(3)) : 0,
            isFastestLap: false,
            compound: 'MEDIUM',
            tyreAge: 0,
            pitStops: pitStopCounts[code] || 0,
            status: 'OUT',
            speed: 0,
            sectors: [0, 0, 0],
            sectorStatus: ['NONE', 'NONE', 'NONE'],
            positionChange: 0,
            driverPhoto: driverInfo?.images.cutout,
        });
        position++;
    }

    // Determine flag
    let flag: RaceFlag = 'GREEN';
    if (frame.sc_status === 'SC') {
        flag = 'SC';
    } else if (frame.sc_status === 'VSC') {
        flag = 'VSC';
    }

    // Generate events
    const events: RaceEvent[] = [];
    
    // Add DNF events for any drivers in frame.dnf
    for (const dnfDriver of frame.dnf) {
        events.push({
            type: 'DNF',
            lap: lapNum,
            description: `${dnfDriver} has retired from the race`,
            drivers: [dnfDriver],
        });
    }

    // Add Pit events if pitting
    for (const dr of sortedRunning) {
        const prevPits = pitStopCounts[dr.driver_id] || 0;
        if (dr.pit_stops > prevPits) {
            events.push({
                type: 'PIT_STOP',
                lap: lapNum,
                description: `${dr.driver_id} pits for new tyres`,
                drivers: [dr.driver_id],
            });
        }
    }

    return {
        lap: lapNum,
        flag,
        standings,
        events,
    };
}
