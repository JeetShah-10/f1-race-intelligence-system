import { useSimulationStore } from '../../store/useSimulationStore';
import { useEffect } from 'react';

const SPEED_OPTIONS = [0.5, 1, 2, 4] as const;

// ─── Playback Controls ───────────────────────────────────────────────────
export function RaceControl() {
    const {
        status,
        isPlaying,
        currentLap,
        raceConfig,
        togglePlayPause,
        seekToLap,
        currentFlag,
        playbackSpeed,
        setPlaybackSpeed,
    } = useSimulationStore();


    const totalLaps = raceConfig?.totalLaps || 57;
    const progress = totalLaps > 0 ? (currentLap / totalLaps) * 100 : 0;
    const isReady = status !== 'IDLE' && status !== 'LOADING';

    // Keyboard shortcuts
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement) return;
            switch (e.key) {
                case ' ':
                    e.preventDefault();
                    togglePlayPause();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    seekToLap(Math.min(currentLap + 1, totalLaps));
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    seekToLap(Math.max(currentLap - 1, 0));
                    break;
                case 'r':
                case 'R':
                    seekToLap(0);
                    break;
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [currentLap, totalLaps, togglePlayPause, seekToLap]);

    return (
        <div className="flex items-center gap-3 w-full max-w-3xl px-4">
            {/* Restart */}
            <button
                onClick={() => seekToLap(0)}
                disabled={!isReady}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                title="Restart (R)"
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
            </button>

            {/* Skip Back */}
            <button
                onClick={() => seekToLap(Math.max(currentLap - 1, 0))}
                disabled={!isReady}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                title="Previous Lap (←)"
            >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 20L9 12l10-8v16zM7 19V5H5v14h2z" />
                </svg>
            </button>

            {/* Play / Pause */}
            <button
                onClick={togglePlayPause}
                disabled={!isReady}
                className={`
                    w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200
                    ${isReady
                        ? 'bg-f1-red hover:bg-f1-red/80 text-white cursor-pointer active:scale-95 shadow-lg shadow-f1-red/20'
                        : 'bg-white/5 text-white/20 cursor-not-allowed'
                    }
                `}
                title="Play/Pause (Space)"
            >
                {status === 'FINISHED' ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="1 4 1 10 7 10" />
                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                    </svg>
                ) : isPlaying ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                        <rect x="1" y="0" width="3.5" height="12" rx="1" />
                        <rect x="7.5" y="0" width="3.5" height="12" rx="1" />
                    </svg>
                ) : (
                    <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
                        <path d="M0 0l12 7-12 7V0z" />
                    </svg>
                )}
            </button>

            {/* Skip Forward */}
            <button
                onClick={() => seekToLap(Math.min(currentLap + 1, totalLaps))}
                disabled={!isReady}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                title="Next Lap (→)"
            >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 4l10 8-10 8V4zm12-1v18h2V3h-2z" />
                </svg>
            </button>

            {/* Lap Counter */}
            <div className="flex items-baseline gap-1 flex-shrink-0 w-[72px]">
                <span className="font-timing text-[16px] text-white font-bold tabular-nums">{currentLap}</span>
                <span className="text-[10px] font-ui text-white/30">/ {totalLaps}</span>
            </div>

            {/* Progress Bar / Scrubber */}
            <div className="flex-1 group relative h-8 flex items-center">
                {/* Background track */}
                <div className="absolute inset-x-0 h-[4px] bg-white/[0.06] rounded-full overflow-hidden top-1/2 -translate-y-1/2">
                    {/* Progress fill */}
                    <div
                        className="h-full rounded-full transition-all duration-300 ease-out"
                        style={{
                            width: `${progress}%`,
                            background: currentFlag === 'SC' || currentFlag === 'VSC'
                                ? 'linear-gradient(90deg, #FF9800, #FFB74D)'
                                : currentFlag === 'RED'
                                    ? 'linear-gradient(90deg, #FF1744, #FF5252)'
                                    : 'linear-gradient(90deg, #E10600, #FF4444)',
                        }}
                    />
                </div>

                {/* Scrubber handle */}
                <div
                    className="absolute w-3 h-3 bg-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 top-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ left: `${progress}%` }}
                />

                {/* Click area */}
                <input
                    type="range"
                    min={0}
                    max={totalLaps}
                    value={currentLap}
                    onChange={(e) => seekToLap(parseInt(e.target.value))}
                    disabled={!isReady}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
            </div>

            {/* Speed Control */}
            <div className="flex items-center gap-1 shrink-0">
                {SPEED_OPTIONS.map(s => (
                    <button
                        key={s}
                        onClick={() => setPlaybackSpeed(s)}
                        className={`px-2 py-0.5 rounded text-[10px] font-ui font-bold transition-all ${playbackSpeed === s
                            ? 'bg-white/15 text-white border border-white/20'
                            : 'text-white/30 hover:text-white/60 hover:bg-white/5'
                            }`}
                    >
                        {s}x
                    </button>
                ))}
            </div>

            {/* Flag indicator */}
            {currentFlag !== 'GREEN' && (
                <div className={`
                    flex-shrink-0 px-2 py-0.5 rounded text-[8px] font-bold font-ui uppercase tracking-wider
                    ${currentFlag === 'SC' ? 'bg-orange-500/20 text-orange-400' :
                        currentFlag === 'VSC' ? 'bg-orange-400/20 text-orange-300' :
                            currentFlag === 'RED' ? 'bg-red-500/20 text-red-400' :
                                currentFlag === 'YELLOW' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'text-white/30'}
                `}>
                    {currentFlag}
                </div>
            )}
        </div>
    );
}
