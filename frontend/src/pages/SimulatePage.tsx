import { useEffect, useCallback } from 'react';
import { useSimulationStore } from '../store/useSimulationStore';
import { CIRCUITS_2026 } from '../data/simulationMockData';
import { CIRCUIT_PATHS, getCircuitImage } from '../components/simulation/CircuitPaths';
import { WeekendIntro } from '../components/simulation/WeekendIntro';
import { QualifyingView } from '../components/simulation/QualifyingView';
import { GridFormation } from '../components/simulation/GridFormation';
import { RaceResults } from '../components/simulation/RaceResults';
import { TrackVisualization } from '../components/simulation/TrackVisualization';
import { Leaderboard } from '../components/simulation/Leaderboard';
import { RaceControl } from '../components/simulation/RaceControl';
import { BroadcastOverlays } from '../components/simulation/BroadcastOverlays';
import { TelemetryPanel } from '../components/simulation/TelemetryPanel';
import { motion } from 'framer-motion';

const CIRCUITS = CIRCUITS_2026.map((c, i) => ({
    id: c.id,
    name: c.name,
    country: c.country,
    flag: getCountryFlag(c.country),
    round: i + 1,
}));

function getCountryFlag(country: string): string {
    const flags: Record<string, string> = {
        'Bahrain': '🇧🇭', 'Saudi Arabia': '🇸🇦', 'Australia': '🇦🇺', 'Japan': '🇯🇵',
        'China': '🇨🇳', 'USA': '🇺🇸', 'Monaco': '🇲🇨', 'Spain': '🇪🇸',
        'Canada': '🇨🇦', 'Austria': '🇦🇹', 'Great Britain': '🇬🇧', 'Hungary': '🇭🇺',
        'Belgium': '🇧🇪', 'Netherlands': '🇳🇱', 'Italy': '🇮🇹', 'Azerbaijan': '🇦🇿',
        'Singapore': '🇸🇬', 'Mexico': '🇲🇽', 'Brazil': '🇧🇷', 'Qatar': '🇶🇦',
        'UAE': '🇦🇪',
    };
    return flags[country] || '🏁';
}

export function SimulatePage() {
    const { phase, selectCircuit, backToCircuits } = useSimulationStore();

    // Keyboard shortcut: Escape goes back
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') backToCircuits();
    }, [backToCircuits]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // ──── PHASE: Circuit Select ────
    if (phase === 'CIRCUIT_SELECT') {
        return <CircuitSelector onSelect={selectCircuit} />;
    }

    // ──── PHASE: Weekend Intro ────
    if (phase === 'WEEKEND_INTRO') {
        return <WeekendIntro />;
    }

    // ──── PHASE: Qualifying ────
    if (phase === 'QUALIFYING') {
        return <QualifyingView />;
    }

    // ──── PHASE: Qualifying Results → Grid ────
    if (phase === 'QUALI_RESULTS') {
        return <QualiResultsTransition />;
    }

    // ──── PHASE: Grid Formation ────
    if (phase === 'GRID_FORMATION') {
        return <GridFormation />;
    }

    // ──── PHASE: Race (Ready / Playing / Paused) ────
    if (phase === 'RACE_READY' || phase === 'RACE_PLAYING' || phase === 'RACE_PAUSED') {
        return <RaceView />;
    }

    // ──── PHASE: Race Finished ────
    if (phase === 'RACE_FINISHED') {
        return <RaceResults />;
    }

    return <CircuitSelector onSelect={selectCircuit} />;
}

// ─── Circuit Selector ───────────────────────────────────────────────────
function CircuitSelector({ onSelect }: { onSelect: (id: string) => void }) {
    return (
        <div className="h-screen flex flex-col" style={{ background: '#0a0a0f' }}>

            {/* Header */}
            <div className="shrink-0 px-6 py-5 text-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-[10px] text-white/30 tracking-[0.3em] font-medium mb-1">F1 INTELLIGENCE</div>
                <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                    Select Circuit
                </h1>
                <div className="text-xs text-white/20 tracking-widest mt-1">2026 RACE CALENDAR</div>
            </div>

            {/* Scrollable grid */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
                    {CIRCUITS.map((circuit, idx) => {
                        const circuitPath = CIRCUIT_PATHS[circuit.id];
                        const bgImage = circuitPath?.mapImage || getCircuitImage(circuit.id)?.photo;

                        return (
                            <motion.button
                                key={circuit.id}
                                onClick={() => onSelect(circuit.id)}
                                className="group relative rounded-lg overflow-hidden text-left transition-all"
                                style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    aspectRatio: '16/10',
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                whileHover={{ scale: 1.02, borderColor: 'rgba(225,6,0,0.3)' }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {/* Background image */}
                                {bgImage && (
                                    <img
                                        src={bgImage}
                                        alt=""
                                        className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity"
                                    />
                                )}
                                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.8) 100%)' }} />

                                {/* Content */}
                                <div className="relative h-full flex flex-col justify-end p-3">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <span className="text-[10px] text-white/30 font-bold">R{circuit.round.toString().padStart(2, '0')}</span>
                                        <span className="text-sm">{circuit.flag}</span>
                                    </div>
                                    <div className="text-sm font-bold text-white leading-tight line-clamp-2">
                                        {circuit.name}
                                    </div>
                                    <div className="text-[10px] text-white/30 mt-0.5 tracking-wider">{circuit.country}</div>
                                </div>

                                {/* Hover glow */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    style={{ background: 'radial-gradient(circle at center, rgba(225,6,0,0.06) 0%, transparent 70%)' }} />
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ─── Qualifying Results Transition ──────────────────────────────────────
function QualiResultsTransition() {
    const { qualifyingData, showGrid } = useSimulationStore();

    if (!qualifyingData) return null;
    const pole = qualifyingData.results[0];

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center" style={{ background: '#0a0a0f' }}>
            <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-[10px] text-white/30 tracking-[0.3em] mb-3">QUALIFYING COMPLETE</div>

                {/* Pole sitter */}
                <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 ring-2"
                        style={{ background: 'rgba(255,255,255,0.05)', outline: `2px solid ${pole.teamColor}`, outlineOffset: '-2px' }}>
                        {pole.driverPhoto && (
                            <img src={pole.driverPhoto} alt="" className="w-full h-full object-cover object-top" />
                        )}
                    </div>
                    <div className="text-2xl font-black text-white">{pole.driverName}</div>
                    <div className="text-sm text-white/40 mt-1">{pole.teamName}</div>
                </motion.div>

                <motion.div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
                    style={{ background: 'rgba(160,32,240,0.12)', border: '1px solid rgba(160,32,240,0.3)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 }}
                >
                    <span className="text-[#A020F0] text-sm font-black tracking-wider">POLE POSITION</span>
                </motion.div>

                <motion.button
                    onClick={showGrid}
                    className="block mx-auto px-8 py-3 rounded-lg text-white font-bold tracking-wider"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    whileHover={{ scale: 1.03 }}
                >
                    VIEW STARTING GRID →
                </motion.button>
            </motion.div>
        </div>
    );
}

// ─── Race View (Running) ────────────────────────────────────────────────
function RaceView() {
    const { raceConfig, status } = useSimulationStore();

    if (status === 'LOADING') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: '#0a0a0f' }}>
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="w-8 h-8 border-2 border-[#E10600] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <div className="text-white/50 text-sm tracking-wider">GENERATING RACE DATA...</div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col" style={{ background: '#0a0a0f' }}>

            {/* Top: Race info bar */}
            <div className="shrink-0 flex items-center justify-between px-4 py-2"
                style={{ background: 'rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] text-[#E10600] font-black tracking-wider">F1</span>
                    <span className="text-xs text-white/50">{raceConfig?.circuitName || 'Grand Prix'}</span>
                </div>
                <div className="text-xs text-white/30 tracking-wider">{raceConfig?.year || 2026}</div>
            </div>

            {/* Main content */}
            <div className="flex-1 min-h-0 flex">

                {/* Leaderboard (left) */}
                <div className="w-[280px] shrink-0 border-r" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    <Leaderboard />
                </div>

                {/* Center: Track + Overlays */}
                <div className="flex-1 relative min-w-0">
                    <TrackVisualization />
                    <BroadcastOverlays />
                </div>

                {/* Telemetry (right) */}
                <div className="w-[260px] shrink-0 border-l" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    <TelemetryPanel />
                </div>
            </div>

            {/* Bottom: Race control */}
            <div className="shrink-0">
                <RaceControl />
            </div>
        </div>
    );
}
