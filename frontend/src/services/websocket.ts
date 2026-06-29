import { WS_BASE_URL } from '../config';
import type { SimulationRequest } from './api';

export interface LapUpdateDriver {
    driver_id: string;
    position: number;
    gap_to_leader: number;
    interval: number;
    last_lap_time: number;
    sector_times: number[];
    tyre_compound: string;
    tyre_age: number;
    pit_stops: number;
}

export interface LapUpdateFrame {
    type: 'LAP_UPDATE';
    lap: number;
    sc_status: 'SC' | 'VSC' | 'NONE';
    weather: string;
    track_temp: number;
    drivers: LapUpdateDriver[];
    dnf: string[];
}

export interface RaceCompleteFrame {
    type: 'RACE_COMPLETE';
    results: any; // BackendSimulationResult
}

export interface ErrorFrame {
    type: 'ERROR';
    message: string;
}

export type WebSocketFrame = LapUpdateFrame | RaceCompleteFrame | ErrorFrame;

export class WebSocketService {
    private ws: WebSocket | null = null;

    connect(
        config: SimulationRequest,
        callbacks: {
            onFrame: (frame: LapUpdateFrame) => void;
            onComplete: (results: any) => void;
            onError: (error: string) => void;
        }
    ) {
        this.disconnect();

        // Target endpoint: ws://localhost:8000/ws/ws/race
        const url = `${WS_BASE_URL}/ws/ws/race`;
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
            console.log('[WS] Connected to race websocket. Sending config...');
            this.ws?.send(JSON.stringify(config));
        };

        this.ws.onmessage = (event) => {
            try {
                const data: WebSocketFrame = JSON.parse(event.data);
                if (data.type === 'LAP_UPDATE') {
                    callbacks.onFrame(data);
                } else if (data.type === 'RACE_COMPLETE') {
                    callbacks.onComplete(data.results);
                    this.disconnect();
                } else if (data.type === 'ERROR') {
                    callbacks.onError(data.message);
                    this.disconnect();
                }
            } catch (err) {
                console.error('[WS] Failed to parse message:', err);
                callbacks.onError(err instanceof Error ? err.message : 'Invalid frame format');
                this.disconnect();
            }
        };

        this.ws.onerror = (event) => {
            console.error('[WS] WebSocket error:', event);
            callbacks.onError('Connection error. Is the backend running?');
            this.disconnect();
        };

        this.ws.onclose = (event) => {
            console.log('[WS] Connection closed:', event.code, event.reason);
        };
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}

export const wsService = new WebSocketService();
