import { create } from 'zustand';
import type { TimingEntry, RaceEvent } from '../types/simulation';

interface SimulationState {
    // Connection State
    isConnected: boolean;
    isConnecting: boolean;
    error: string | null;

    // Race State
    isRunning: boolean;
    currentLap: number;
    totalLaps: number;
    weather: string;
    trackTemp: number;
    airTemp: number;

    // Data
    standings: TimingEntry[];
    events: RaceEvent[];
    // Telemetry history for charts (key: driverId)
    telemetryHistory: Record<string, { lap: number; time: number }[]>;

    // Actions
    connect: (url: string) => void;
    disconnect: () => void;
    startSimulation: (config: any) => void;
    stopSimulation: () => void;

    // Internal Actions (called by WS)
    updateRaceState: (data: any) => void;
    addEvent: (event: RaceEvent) => void;
}

export const useSimulationStore = create<SimulationState>((set, get) => {
    let socket: WebSocket | null = null;

    return {
        isConnected: false,
        isConnecting: false,
        error: null,
        isRunning: false,
        currentLap: 0,
        totalLaps: 57,
        weather: 'Sunny',
        trackTemp: 35,
        airTemp: 25,
        standings: [],
        events: [],
        telemetryHistory: {},

        connect: (url: string) => {
            if (socket) return;

            set({ isConnecting: true, error: null });

            try {
                socket = new WebSocket(url);

                socket.onopen = () => {
                    set({ isConnected: true, isConnecting: false });
                    console.log('✅ WS Connected');
                };

                socket.onclose = () => {
                    set({ isConnected: false, isConnecting: false, isRunning: false });
                    console.log('❌ WS Disconnected');
                    socket = null;
                };

                socket.onerror = (err) => {
                    set({ error: 'Connection Failed', isConnecting: false });
                    console.error('WS Error', err);
                };

                socket.onmessage = (event) => {
                    try {
                        const msg = JSON.parse(event.data);
                        if (msg.type === 'LAP_UPDATE') {
                            get().updateRaceState(msg.data);
                        } else if (msg.type === 'RACE_COMPLETE') {
                            set({ isRunning: false });
                        } else if (msg.type === 'EVENT') {
                            get().addEvent(msg.data);
                        }
                    } catch (e) {
                        console.error('Failed to parse WS msg', e);
                    }
                };

            } catch (e) {
                set({ error: 'Failed to create WebSocket', isConnecting: false });
            }
        },

        disconnect: () => {
            if (socket) {
                socket.close();
                socket = null;
            }
            set({ isConnected: false, isRunning: false });
        },

        startSimulation: (config) => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                set({ isRunning: true, standings: [], events: [], currentLap: 0, telemetryHistory: {} });
                socket.send(JSON.stringify(config));
            } else {
                console.error("Socket not connected");
            }
        },

        stopSimulation: () => {
            // Optional: Send stop command
            set({ isRunning: false });
        },

        updateRaceState: (data) => {
            set((state) => {
                // Transform backend data to frontend types if needed
                // Assuming data.positions contains { driver_id, gap, time, ... }

                // We need to map the raw positions to TimingEntry[]
                // This mapping depends on the exact backend payload from race_engine.py
                // For now, we assume the backend sends a structure we can map.

                // Mock mapping for now till backend spec is strictly followed
                const newStandings: TimingEntry[] = (data.positions || []).map((p: any, index: number) => ({
                    position: index + 1,
                    driver: {
                        id: p, // p is currently just driver_id in existing backend
                        code: p,
                        firstName: '',
                        lastName: '',
                        number: 0,
                        constructor: { id: 'unk', name: 'Unknown', shortName: 'UNK', color: '#888' },
                        nationality: ''
                    },
                    gap: data.gaps[p] ? `+${data.gaps[p].toFixed(3)}` : 'LEADER',
                    interval: '',
                    lastLap: { lap: data.lap, total: data.times[p], sectors: [], isPersonalBest: false, isSessionBest: false },
                    bestLap: null,
                    currentTire: 'SOFT', // Placeholder
                    tireAge: 0,
                    pitStops: 0,
                    status: 'RUNNING'
                }));

                // Update Telemetry History (Lap Times)
                const newHistory = { ...state.telemetryHistory };
                newStandings.forEach(driver => {
                    const code = driver.driver.code;
                    if (!newHistory[code]) newHistory[code] = [];
                    newHistory[code].push({ lap: data.lap, time: data.times[code] || 0 });
                });

                return {
                    currentLap: data.lap,
                    standings: newStandings,
                    telemetryHistory: newHistory
                };
            });
        },

        addEvent: (event) => set((state) => ({
            events: [event, ...state.events]
        }))
    };
});
