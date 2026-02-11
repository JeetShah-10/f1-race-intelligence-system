import { create } from 'zustand';
import type {
    RaceLap,
    RaceConfig,
    DriverStanding,
    RaceEvent,
    RaceFlag,
    FullRaceData,
    SimulationPhase,
    QualifyingData,
    GridPosition,
} from '../types/simulation';
import { generateMockRace, generateMockQualifying, generateGrid } from '../data/simulationMockData';

// ─── Adaptive Speed Config ────────────────────────────────────────────────
const SPEED = {
    NORMAL: 800,
    SC: 2200,
    VSC: 1800,
    EVENT: 1500,
    FIRST_LAP: 1400,
    LAST_3_LAPS: 1200,
} as const;

function getAdaptiveInterval(lap: RaceLap, totalLaps: number): number {
    if (lap.lap === 1) return SPEED.FIRST_LAP;
    if (lap.lap >= totalLaps - 2) return SPEED.LAST_3_LAPS;
    if (lap.flag === 'SC') return SPEED.SC;
    if (lap.flag === 'VSC') return SPEED.VSC;
    if (lap.events.length > 0) return SPEED.EVENT;
    return SPEED.NORMAL;
}

// ─── Store Interface ──────────────────────────────────────────────────────
interface SimulationStore {
    // Phase state machine
    phase: SimulationPhase;

    // Circuit
    selectedCircuitId: string | null;

    // Qualifying data
    qualifyingData: QualifyingData | null;
    qualifyingSession: 'Q1' | 'Q2' | 'Q3' | null;
    qualifyingRevealIndex: number;  // how many drivers' times have been revealed
    isQualifyingRunning: boolean;

    // Grid
    gridOrder: GridPosition[];

    // Race data (full pre-computed race)
    fullRaceData: FullRaceData | null;
    raceConfig: RaceConfig | null;

    // Current playback state
    currentLap: number;
    currentStandings: DriverStanding[];
    currentFlag: RaceFlag;
    currentEvents: RaceEvent[];
    allPastEvents: RaceEvent[];

    // Playback control
    isPlaying: boolean;
    playbackSpeed: number;
    adaptiveInterval: number;

    // Selected driver for detail panel
    selectedDriver: string | null;

    // ────── Actions ──────

    // Phase navigation
    selectCircuit: (circuitId: string) => void;
    goToWeekendIntro: () => void;

    // Qualifying
    startQualifying: () => void;
    advanceQualiSession: () => void;
    revealNextQualiDriver: () => void;
    finishQualifying: () => void;

    // Grid
    showGrid: () => void;

    // Race
    startRace: () => void;
    play: () => void;
    pause: () => void;
    togglePlayPause: () => void;
    seekToLap: (lap: number) => void;
    setPlaybackSpeed: (speed: number) => void;
    setSelectedDriver: (code: string | null) => void;
    tick: () => void;

    // Navigation
    backToCircuits: () => void;
    reset: () => void;

    // Legacy compat
    status: 'IDLE' | 'LOADING' | 'READY' | 'PLAYING' | 'PAUSED' | 'FINISHED';
    loadRace: (circuitId: string) => void;
}

// ─── Playback Timer ──────────────────────────────────────────────────────
let playbackTimer: ReturnType<typeof setTimeout> | null = null;
let qualiTimer: ReturnType<typeof setInterval> | null = null;

function clearTimer() {
    if (playbackTimer) { clearTimeout(playbackTimer); playbackTimer = null; }
}
function clearQualiTimer() {
    if (qualiTimer) { clearInterval(qualiTimer); qualiTimer = null; }
}



// ─── Store ────────────────────────────────────────────────────────────────
export const useSimulationStore = create<SimulationStore>((set, get) => ({
    // Initial state
    phase: 'CIRCUIT_SELECT',
    selectedCircuitId: null,
    qualifyingData: null,
    qualifyingSession: null,
    qualifyingRevealIndex: 0,
    isQualifyingRunning: false,
    gridOrder: [],
    fullRaceData: null,
    raceConfig: null,
    currentLap: 0,
    currentStandings: [],
    currentFlag: 'GREEN',
    currentEvents: [],
    allPastEvents: [],
    isPlaying: false,
    playbackSpeed: 1,
    adaptiveInterval: SPEED.NORMAL,
    selectedDriver: null,
    status: 'IDLE',

    // ────── Phase Navigation ──────

    selectCircuit: (circuitId: string) => {
        set({
            selectedCircuitId: circuitId,
            phase: 'WEEKEND_INTRO',
            status: 'IDLE',
        });
    },

    goToWeekendIntro: () => {
        set({ phase: 'WEEKEND_INTRO' });
    },

    // ────── Qualifying ──────

    startQualifying: () => {
        const { selectedCircuitId } = get();
        if (!selectedCircuitId) return;

        const qualData = generateMockQualifying(selectedCircuitId);

        set({
            phase: 'QUALIFYING',
            qualifyingData: qualData,
            qualifyingSession: 'Q1',
            qualifyingRevealIndex: 0,
            isQualifyingRunning: true,
            status: 'PLAYING',
        });

        // Auto-reveal drivers one by one
        clearQualiTimer();
        let revealCount = 0;
        const totalDrivers = qualData.results.length;

        qualiTimer = setInterval(() => {
            revealCount++;


            if (revealCount >= totalDrivers) {
                clearQualiTimer();
                // Move to Q2 after brief pause
                setTimeout(() => {
                    const s = get();
                    if (s.phase !== 'QUALIFYING') return;
                    if (s.qualifyingSession === 'Q1') {
                        set({ qualifyingSession: 'Q2', qualifyingRevealIndex: 0 });
                        // Continue revealing Q2
                        let q2Count = 0;
                        qualiTimer = setInterval(() => {
                            q2Count++;
                            if (q2Count >= 17) {
                                clearQualiTimer();
                                setTimeout(() => {
                                    const s2 = get();
                                    if (s2.phase !== 'QUALIFYING') return;
                                    if (s2.qualifyingSession === 'Q2') {
                                        set({ qualifyingSession: 'Q3', qualifyingRevealIndex: 0 });
                                        // Q3
                                        let q3Count = 0;
                                        qualiTimer = setInterval(() => {
                                            q3Count++;
                                            if (q3Count >= 10) {
                                                clearQualiTimer();
                                                setTimeout(() => get().finishQualifying(), 1500);
                                                return;
                                            }
                                            set({ qualifyingRevealIndex: q3Count });
                                        }, 400);
                                    }
                                }, 2000);
                                return;
                            }
                            set({ qualifyingRevealIndex: q2Count });
                        }, 450);
                    }
                }, 2000);
                return;
            }

            set({ qualifyingRevealIndex: revealCount });
        }, 350);
    },

    advanceQualiSession: () => {
        const { qualifyingSession } = get();
        if (qualifyingSession === 'Q1') set({ qualifyingSession: 'Q2', qualifyingRevealIndex: 0 });
        else if (qualifyingSession === 'Q2') set({ qualifyingSession: 'Q3', qualifyingRevealIndex: 0 });
        else get().finishQualifying();
    },

    revealNextQualiDriver: () => {
        set(state => ({ qualifyingRevealIndex: state.qualifyingRevealIndex + 1 }));
    },

    finishQualifying: () => {
        clearQualiTimer();
        set({
            phase: 'QUALI_RESULTS',
            isQualifyingRunning: false,
            status: 'PAUSED',
        });
    },

    // ────── Grid ──────

    showGrid: () => {
        const { qualifyingData } = get();
        if (!qualifyingData) return;

        const grid = generateGrid(qualifyingData);
        set({
            phase: 'GRID_FORMATION',
            gridOrder: grid,
            status: 'READY',
        });
    },

    // ────── Race ──────

    startRace: () => {
        const { selectedCircuitId, gridOrder } = get();
        if (!selectedCircuitId) return;

        set({ phase: 'RACE_READY', status: 'LOADING' });

        setTimeout(() => {
            const data = generateMockRace(selectedCircuitId, gridOrder.length > 0 ? gridOrder : undefined);
            const firstLap = data.laps[0];

            set({
                phase: 'RACE_READY',
                fullRaceData: data,
                raceConfig: data.config,
                currentLap: 0,
                currentStandings: firstLap?.standings || [],
                currentFlag: 'GREEN',
                currentEvents: [],
                allPastEvents: [],
                isPlaying: false,
                selectedDriver: null,
                status: 'READY',
            });
        }, 600);
    },

    play: () => {
        const state = get();
        if (!state.fullRaceData) return;
        if (state.phase === 'RACE_FINISHED') return;

        clearTimer();
        set({ isPlaying: true, phase: 'RACE_PLAYING', status: 'PLAYING' });

        const scheduleNext = () => {
            const s = get();
            if (!s.isPlaying || !s.fullRaceData) return;

            const nextLap = s.currentLap + 1;
            if (nextLap > s.fullRaceData.config.totalLaps) {
                set({ isPlaying: false, phase: 'RACE_FINISHED', status: 'FINISHED' });
                clearTimer();
                return;
            }

            const lapData = s.fullRaceData.laps[nextLap - 1];
            if (!lapData) return;

            const interval = getAdaptiveInterval(lapData, s.fullRaceData.config.totalLaps);
            set({ adaptiveInterval: interval });

            playbackTimer = setTimeout(() => {
                get().tick();
                scheduleNext();
            }, interval / s.playbackSpeed);
        };

        scheduleNext();
    },

    pause: () => {
        clearTimer();
        set({ isPlaying: false, phase: 'RACE_PAUSED', status: 'PAUSED' });
    },

    togglePlayPause: () => {
        const state = get();
        if (state.isPlaying) {
            get().pause();
        } else {
            if (state.phase === 'RACE_FINISHED') {
                get().seekToLap(0);
                setTimeout(() => get().play(), 100);
            } else {
                get().play();
            }
        }
    },

    seekToLap: (lap: number) => {
        const state = get();
        if (!state.fullRaceData) return;

        const wasPlaying = state.isPlaying;
        clearTimer();

        const clampedLap = Math.max(0, Math.min(lap, state.fullRaceData.config.totalLaps));

        if (clampedLap === 0) {
            const firstLap = state.fullRaceData.laps[0];
            set({
                currentLap: 0,
                currentStandings: firstLap?.standings || [],
                currentFlag: 'GREEN',
                currentEvents: [],
                allPastEvents: [],
                isPlaying: false,
                phase: 'RACE_READY',
                status: 'READY',
            });
            return;
        }

        const lapData = state.fullRaceData.laps[clampedLap - 1];
        if (!lapData) return;

        const pastEvents: RaceEvent[] = [];
        for (let i = 0; i < clampedLap; i++) {
            pastEvents.push(...state.fullRaceData.laps[i].events);
        }

        set({
            currentLap: clampedLap,
            currentStandings: lapData.standings,
            currentFlag: lapData.flag,
            currentEvents: lapData.events,
            allPastEvents: pastEvents,
            phase: clampedLap >= state.fullRaceData.config.totalLaps ? 'RACE_FINISHED' : 'RACE_PAUSED',
            status: clampedLap >= state.fullRaceData.config.totalLaps ? 'FINISHED' : 'PAUSED',
            isPlaying: false,
        });

        if (wasPlaying && clampedLap < state.fullRaceData.config.totalLaps) {
            setTimeout(() => get().play(), 50);
        }
    },

    setPlaybackSpeed: (speed: number) => {
        set({ playbackSpeed: speed });
        // Restart playback with new speed if playing
        const state = get();
        if (state.isPlaying) {
            get().pause();
            setTimeout(() => get().play(), 50);
        }
    },

    setSelectedDriver: (code: string | null) => {
        set({ selectedDriver: code });
    },

    tick: () => {
        const state = get();
        if (!state.fullRaceData) return;

        const nextLap = state.currentLap + 1;
        if (nextLap > state.fullRaceData.config.totalLaps) {
            clearTimer();
            set({ isPlaying: false, phase: 'RACE_FINISHED', status: 'FINISHED' });
            return;
        }

        const lapData = state.fullRaceData.laps[nextLap - 1];
        if (!lapData) return;

        set({
            currentLap: nextLap,
            currentStandings: lapData.standings,
            currentFlag: lapData.flag,
            currentEvents: lapData.events,
            allPastEvents: [...state.allPastEvents, ...lapData.events],
        });
    },

    // ────── Navigation ──────

    backToCircuits: () => {
        clearTimer();
        clearQualiTimer();
        set({
            phase: 'CIRCUIT_SELECT',
            selectedCircuitId: null,
            qualifyingData: null,
            qualifyingSession: null,
            qualifyingRevealIndex: 0,
            isQualifyingRunning: false,
            gridOrder: [],
            fullRaceData: null,
            raceConfig: null,
            currentLap: 0,
            currentStandings: [],
            currentFlag: 'GREEN',
            currentEvents: [],
            allPastEvents: [],
            isPlaying: false,
            selectedDriver: null,
            status: 'IDLE',
        });
    },

    reset: () => {
        get().backToCircuits();
    },

    // ────── Legacy compat ──────
    loadRace: (circuitId: string) => {
        get().selectCircuit(circuitId);
    },
}));
