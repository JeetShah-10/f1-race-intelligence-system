import { create } from 'zustand';
import { api } from '../services/api';

export interface Driver {
    code: string;
    name: string;
    team: string;
    teamColor: string;
    number: number;
    country: string;
    image: string;
    points: number;
    position: number;
    gap: string;
}

export interface DriverMomentum {
    code: string;
    form: number;
    qualiDelta: string;
    overtakes: number;
    pace: 'Dominant' | 'Rising' | 'Stable' | 'Adapting' | 'Struggling';
    trend: 'up' | 'down' | 'stable';
}

interface DriverState {
    standings: Driver[];
    setStandings: (drivers: Driver[]) => void;
    updateDriver: (code: string, updates: Partial<Driver>) => void;
    momentum: Record<string, DriverMomentum>;
    setMomentum: (code: string, data: DriverMomentum) => void;
    setAllMomentum: (data: Record<string, DriverMomentum>) => void;
    selectedDriver: string | null;
    setSelectedDriver: (code: string | null) => void;
    isLoading: boolean;
    setLoading: (loading: boolean) => void;
    loadDrivers: () => Promise<void>;
}

const defaultStandings: Driver[] = [
    { code: 'VER', name: 'Max Verstappen', team: 'Red Bull', teamColor: '#3671C6', number: 1, country: 'NL', image: '/assets/drivers/max-verstappen-removebg-preview.png', points: 575, position: 1, gap: 'Leader' },
    { code: 'NOR', name: 'Lando Norris', team: 'McLaren', teamColor: '#FF8700', number: 4, country: 'GB', image: '/assets/drivers/lando-norris-removebg-preview.png', points: 374, position: 2, gap: '+201' },
    { code: 'LEC', name: 'Charles Leclerc', team: 'Ferrari', teamColor: '#DC0000', number: 16, country: 'MC', image: '/assets/drivers/charles-leclerc-removebg-preview.png', points: 319, position: 3, gap: '+256' },
    { code: 'PIA', name: 'Oscar Piastri', team: 'McLaren', teamColor: '#FF8700', number: 81, country: 'AU', image: '/assets/drivers/oscar-piastri-removebg-preview.png', points: 291, position: 4, gap: '+284' },
    { code: 'HAM', name: 'Lewis Hamilton', team: 'Ferrari', teamColor: '#DC0000', number: 44, country: 'GB', image: '/assets/drivers/lewis-hamilton-removebg-preview.png', points: 211, position: 5, gap: '+364' },
    { code: 'RUS', name: 'George Russell', team: 'Mercedes', teamColor: '#00D2BE', number: 63, country: 'GB', image: '/assets/drivers/george-russell.png', points: 189, position: 6, gap: '+386' },
    { code: 'SAI', name: 'Carlos Sainz', team: 'Williams', teamColor: '#005AFF', number: 55, country: 'ES', image: '/assets/drivers/carlos-sainz.png', points: 165, position: 7, gap: '+410' },
    { code: 'PER', name: 'Sergio Perez', team: 'Red Bull', teamColor: '#3671C6', number: 11, country: 'MX', image: '/assets/drivers/sergio-perez.png', points: 143, position: 8, gap: '+432' },
];

const defaultMomentum: Record<string, DriverMomentum> = {
    VER: { code: 'VER', form: 2.4, qualiDelta: '+0.143s', overtakes: 12, pace: 'Dominant', trend: 'up' },
    NOR: { code: 'NOR', form: 1.8, qualiDelta: '+0.089s', overtakes: 18, pace: 'Rising', trend: 'up' },
    LEC: { code: 'LEC', form: -0.3, qualiDelta: '-0.054s', overtakes: 8, pace: 'Stable', trend: 'down' },
    HAM: { code: 'HAM', form: 0.9, qualiDelta: '+0.201s', overtakes: 15, pace: 'Adapting', trend: 'up' },
    PIA: { code: 'PIA', form: 1.2, qualiDelta: '+0.067s', overtakes: 14, pace: 'Rising', trend: 'up' },
    RUS: { code: 'RUS', form: -0.5, qualiDelta: '-0.112s', overtakes: 6, pace: 'Struggling', trend: 'down' },
};

export const useDriverStore = create<DriverState>((set) => ({
    standings: defaultStandings,
    setStandings: (drivers) => set({ standings: drivers }),
    updateDriver: (code, updates) => set((state) => ({
        standings: state.standings.map((d) =>
            d.code === code ? { ...d, ...updates } : d
        )
    })),

    momentum: defaultMomentum,
    setMomentum: (code, data) => set((state) => ({
        momentum: { ...state.momentum, [code]: data }
    })),
    setAllMomentum: (data) => set({ momentum: data }),

    selectedDriver: null,
    setSelectedDriver: (code) => set({ selectedDriver: code }),

    isLoading: false,
    setLoading: (loading) => set({ isLoading: loading }),

    loadDrivers: async () => {
        set({ isLoading: true });
        try {
            const backendDrivers = await api.getDrivers(2025);
            if (backendDrivers && backendDrivers.length > 0) {
                const TEAM_COLORS: Record<string, string> = {
                    'Red Bull Racing': '#3671C6', 'Red Bull': '#3671C6',
                    'Ferrari': '#E8002D', 'McLaren': '#FF8000',
                    'Mercedes': '#27F4D2', 'Aston Martin': '#229971',
                    'Alpine': '#0093CC', 'Williams': '#64C4FF',
                    'Racing Bulls': '#6692FF', 'Audi': '#000000',
                    'Haas': '#B6BABD', 'Cadillac': '#1E3264',
                };
                const drivers: Driver[] = backendDrivers.map((d: any, idx: number) => ({
                    code: d.code || d.driver_code || '',
                    name: d.name || d.full_name || `${d.givenName || ''} ${d.familyName || ''}`.trim(),
                    team: d.team || d.constructor || '',
                    teamColor: TEAM_COLORS[d.team || d.constructor || ''] || '#FFFFFF',
                    number: d.number || d.driver_number || parseInt(d.permanentNumber) || 0,
                    country: d.country || d.nationality || '',
                    image: d.image || `/assets/drivers/${(d.code || '').toLowerCase()}-removebg-preview.png`,
                    points: d.points || 0,
                    position: d.position || idx + 1,
                    gap: d.gap || (idx === 0 ? 'Leader' : ''),
                }));
                set({ standings: drivers });
                console.log('[Drivers] \u2705 Loaded from backend');
            }
        } catch (err) {
            console.warn('[Drivers] \u26a0\ufe0f Backend unavailable, using mock data:', err);
        } finally {
            set({ isLoading: false });
        }
    },
}));
