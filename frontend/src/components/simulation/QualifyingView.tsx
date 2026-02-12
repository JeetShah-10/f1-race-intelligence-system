import { motion, AnimatePresence } from 'framer-motion';
import { useSimulationStore } from '../../store/useSimulationStore';
import type { QualifyingResult, QualifyingSession } from '../../types/simulation';
import { getCircuitById } from '../../data/simulationMockData';
import { CIRCUIT_PATHS } from './CircuitPaths';

const SESSION_CONFIG: Record<QualifyingSession, { total: number; eliminated: number; label: string; color: string }> = {
    Q1: { total: 22, eliminated: 5, label: 'Q1', color: '#E10600' },
    Q2: { total: 17, eliminated: 5, label: 'Q2', color: '#FF8000' },
    Q3: { total: 10, eliminated: 0, label: 'Q3', color: '#A020F0' },
};

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toFixed(3).padStart(6, '0')}`;
}

function formatGap(best: number, time: number): string {
    if (time <= best) return '';
    const gap = time - best;
    return `+${gap.toFixed(3)}`;
}

export function QualifyingView() {
    const {
        qualifyingData,
        qualifyingSession,
        qualifyingRevealIndex,
        selectedCircuitId,
        finishQualifying,
    } = useSimulationStore();

    if (!qualifyingData || !qualifyingSession) return null;

    const circuit = selectedCircuitId ? getCircuitById(selectedCircuitId) : null;
    const circuitPath = selectedCircuitId ? CIRCUIT_PATHS[selectedCircuitId] : null;

    const sessionConfig = SESSION_CONFIG[qualifyingSession];
    const sessionResults = qualifyingData.sessionTimes[qualifyingSession.toLowerCase() as 'q1' | 'q2' | 'q3'];

    // Get revealed results
    const revealedResults = sessionResults.slice(0, qualifyingRevealIndex);
    const sortedRevealed = [...revealedResults].sort((a, b) => {
        const timeA = qualifyingSession === 'Q3' ? a.q3Time : qualifyingSession === 'Q2' ? a.q2Time : a.q1Time;
        const timeB = qualifyingSession === 'Q3' ? b.q3Time : qualifyingSession === 'Q2' ? b.q2Time : b.q1Time;
        return (timeA || 999) - (timeB || 999);
    });

    const bestTime = sortedRevealed.length > 0
        ? Math.min(...sortedRevealed.map(r => {
            if (qualifyingSession === 'Q3') return r.q3Time || 999;
            if (qualifyingSession === 'Q2') return r.q2Time || 999;
            return r.q1Time || 999;
        }))
        : 0;

    const eliminationZone = sessionConfig.total - sessionConfig.eliminated;

    return (
        <div className="fixed inset-0 z-50 flex" style={{ background: '#0a0a0f' }}>

            {/* Background track viz */}
            {circuitPath && (
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.06]">
                    <svg viewBox={circuitPath.viewBox} className="w-[70%] h-[70%]">
                        <path d={circuitPath.path} fill="none" stroke="white" strokeWidth="10" strokeLinecap="round" />
                    </svg>
                </div>
            )}

            {/* Left panel: Session info + track */}
            <div className="flex-1 flex flex-col items-center justify-center relative px-8">

                {/* Session badge */}
                <motion.div
                    key={qualifyingSession}
                    className="mb-8"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="flex items-center gap-4">
                        {(['Q1', 'Q2', 'Q3'] as QualifyingSession[]).map(q => {
                            const isActive = q === qualifyingSession;
                            const isPast = qualifyingSession === 'Q3' ? q !== 'Q3' :
                                qualifyingSession === 'Q2' ? q === 'Q1' : false;
                            return (
                                <div key={q} className="flex items-center gap-2">
                                    <div
                                        className="px-4 py-2 rounded text-sm font-black tracking-wider transition-all duration-500"
                                        style={{
                                            background: isActive ? SESSION_CONFIG[q].color : isPast ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                                            color: isActive ? '#fff' : isPast ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)',
                                            boxShadow: isActive ? `0 0 20px ${SESSION_CONFIG[q].color}40` : 'none',
                                        }}
                                    >
                                        {q}
                                    </div>
                                    {q !== 'Q3' && (
                                        <div className="w-8 h-[1px]" style={{ background: 'rgba(255,255,255,0.1)' }} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Circuit name */}
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-black uppercase text-white/90 tracking-tight">
                        {circuit?.name || 'Qualifying'}
                    </h2>
                    <div className="text-xs text-white/30 tracking-[0.3em] mt-1">QUALIFYING SESSION</div>
                </div>

                {/* Progress bar */}
                <div className="w-72 h-1 rounded-full overflow-hidden mb-8" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div
                        className="h-full rounded-full"
                        style={{ background: sessionConfig.color }}
                        animate={{ width: `${(qualifyingRevealIndex / sessionConfig.total) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                {/* Drivers remaining */}
                <div className="text-white/30 text-sm tracking-wider">
                    {qualifyingRevealIndex} / {sessionConfig.total} DRIVERS
                </div>

                {/* Skip button */}
                <motion.button
                    onClick={finishQualifying}
                    className="mt-8 px-6 py-2 rounded text-white/40 hover:text-white/80 text-sm tracking-wider transition-colors"
                    style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                    whileHover={{ borderColor: 'rgba(255,255,255,0.3)' }}
                >
                    SKIP TO RESULTS →
                </motion.button>
            </div>

            {/* Right panel: Timing tower */}
            <div className="w-[380px] flex flex-col" style={{ background: 'rgba(0,0,0,0.6)', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>

                {/* Header */}
                <div className="shrink-0 px-4 py-3" style={{ background: sessionConfig.color }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-[10px] font-bold tracking-[0.15em] text-white/70">QUALIFYING</div>
                            <div className="text-lg font-black text-white">{sessionConfig.label}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] text-white/60 tracking-wider">ELIMINATED</div>
                            <div className="text-lg font-black text-white">{sessionConfig.eliminated}</div>
                        </div>
                    </div>
                </div>

                {/* Timing rows */}
                <div className="flex-1 min-h-0 overflow-y-auto">
                    <AnimatePresence mode="popLayout">
                        {sortedRevealed.map((result, idx) => {
                            const time = qualifyingSession === 'Q3' ? result.q3Time :
                                qualifyingSession === 'Q2' ? result.q2Time : result.q1Time;
                            const isInEliminationZone = idx >= eliminationZone && sessionConfig.eliminated > 0;

                            return (
                                <QualiRow
                                    key={result.driverCode}
                                    result={result}
                                    position={idx + 1}
                                    time={time || 0}
                                    bestTime={bestTime}
                                    isEliminated={isInEliminationZone}
                                    isPole={idx === 0 && qualifyingSession === 'Q3'}
                                />
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Elimination zone label */}
                {sessionConfig.eliminated > 0 && sortedRevealed.length > eliminationZone && (
                    <div className="shrink-0 px-4 py-1.5 text-center" style={{ background: 'rgba(255,23,68,0.15)' }}>
                        <span className="text-[10px] font-bold tracking-[0.2em] text-[#FF1744]">
                            ▼ ELIMINATION ZONE ▼
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

function QualiRow({
    result,
    position,
    time,
    bestTime,
    isEliminated,
    isPole,
}: {
    result: QualifyingResult;
    position: number;
    time: number;
    bestTime: number;
    isEliminated: boolean;
    isPole: boolean;
}) {
    const gap = formatGap(bestTime, time);
    const isPersonalBest = time <= bestTime;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex items-center px-3 py-[7px] border-b transition-colors"
            style={{
                borderColor: 'rgba(255,255,255,0.04)',
                background: isPole ? 'rgba(160,32,240,0.08)' :
                    isEliminated ? 'rgba(255,23,68,0.06)' :
                        'transparent',
            }}
        >
            {/* Position */}
            <div className="w-8 text-center">
                <span className="text-sm font-black" style={{
                    color: isPole ? '#A020F0' : isEliminated ? '#FF1744' : position <= 3 ? '#fff' : 'rgba(255,255,255,0.5)',
                }}>
                    {position}
                </span>
            </div>

            {/* Team color bar */}
            <div className="w-[3px] h-6 rounded-full mx-2" style={{ background: result.teamColor }} />

            {/* Driver name */}
            <div className="flex-1 min-w-0">
                <span className="text-sm font-bold text-white tracking-wide">{result.driverCode}</span>
                <span className="text-xs text-white/25 ml-2">{result.teamName}</span>
            </div>

            {/* Time / Gap */}
            <div className="text-right ml-2">
                {isPersonalBest ? (
                    <span className="text-sm font-mono font-bold" style={{ color: '#A020F0' }}>
                        {formatTime(time)}
                    </span>
                ) : (
                    <span className="text-sm font-mono" style={{ color: isEliminated ? '#FF1744' : '#FFC107' }}>
                        {gap}
                    </span>
                )}
            </div>
        </motion.div>
    );
}
