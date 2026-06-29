import { useMemo, useEffect, useRef, useState } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import type { DriverStanding } from '../../types/simulation';
import { getCircuitPath } from './CircuitPaths';

//  Driver Dot Component 
function DriverDot({
    driver,
    x,
    y,
    isSelected,
    onSelect,
}: {
    driver: DriverStanding;
    x: number;
    y: number;
    isSelected: boolean;
    onSelect: () => void;
}) {
    if (driver.status === 'OUT') return null;

    return (
        <div
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
            className="absolute cursor-pointer group"
            style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: isSelected ? 50 : 10,
                transition: 'left 0.4s ease-out, top 0.4s ease-out',
            }}
        >
            {/* Glow ring (selected) */}
            {isSelected && (
                <div
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{
                        width: 28,
                        height: 28,
                        marginLeft: -8,
                        marginTop: -8,
                        backgroundColor: driver.teamColor,
                        opacity: 0.2,
                    }}
                />
            )}

            {/* Driver dot */}
            <div
                className="rounded-full border-2 transition-all duration-200"
                style={{
                    width: isSelected ? 14 : 10,
                    height: isSelected ? 14 : 10,
                    backgroundColor: driver.teamColor,
                    borderColor: isSelected ? '#fff' : 'rgba(0,0,0,0.5)',
                    boxShadow: isSelected
                        ? `0 0 12px ${driver.teamColor}, 0 0 24px ${driver.teamColor}40`
                        : `0 0 6px ${driver.teamColor}60`,
                }}
            />

            {/* Label: visible on hover or when selected */}
            <div
                className={`absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap transition-all duration-200 ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'
                    }`}
            >
                <div className="flex items-center gap-1.5 px-2 py-1 bg-black/90 backdrop-blur-md rounded-md border border-white/10 shadow-xl">
                    <div className="w-[2px] h-3 rounded-full" style={{ backgroundColor: driver.teamColor }} />
                    <span className="text-[11px] font-timing font-bold text-white">{driver.driverCode}</span>
                    <span className="text-[9px] font-ui text-white/40 hidden xl:inline">P{driver.position}</span>
                </div>
            </div>
        </div>
    );
}

//  Main Track Visualization 
export function TrackVisualization() {
    const { currentStandings, selectedDriver, setSelectedDriver, raceConfig, currentLap, currentFlag } = useSimulationStore();
    const svgRef = useRef<SVGSVGElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [pathLength, setPathLength] = useState(0);
    const [tick, setTick] = useState(0);

    const circuitConfig = useMemo(
        () => getCircuitPath(raceConfig?.circuitId || 'fallback'),
        [raceConfig?.circuitId]
    );

    // Parse viewBox dimensions for coordinate normalization
    const viewBoxDims = useMemo(() => {
        const parts = circuitConfig.viewBox.split(' ').map(Number);
        return { x: parts[0], y: parts[1], w: parts[2], h: parts[3] };
    }, [circuitConfig.viewBox]);

    // Measure SVG path length
    useEffect(() => {
        if (pathRef.current) {
            setPathLength(pathRef.current.getTotalLength());
        }
    }, [circuitConfig]);

    // Animation tick for continuous dot movement
    useEffect(() => {
        const timer = setInterval(() => setTick(t => t + 1), 60); // ~16fps
        return () => clearInterval(timer);
    }, []);

    const runningDrivers = useMemo(
        () => currentStandings.filter(d => d.status !== 'OUT'),
        [currentStandings]
    );

    // Calculate driver positions as percentage coordinates
    const driverPositions = useMemo(() => {
        if (!pathRef.current || pathLength === 0) return [];

        const now = Date.now();
        return runningDrivers.map(driver => {
            // Stagger drivers based on position (leader at front, backmarkers behind)
            const stagger = (driver.position - 1) / Math.max(runningDrivers.length, 1);
            // Add time-based movement so dots travel around the track
            const timeOffset = (now / 8000) % 1;
            const t = (1 - stagger * 0.8 + timeOffset) % 1;

            const point = pathRef.current!.getPointAtLength(pathLength * t);
            // Normalize SVG coordinates to percentages
            const xPercent = ((point.x - viewBoxDims.x) / viewBoxDims.w) * 100;
            const yPercent = ((point.y - viewBoxDims.y) / viewBoxDims.h) * 100;

            return { driver, x: xPercent, y: yPercent };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [runningDrivers, pathLength, tick, viewBoxDims]);

    // Flag colors for track border glow
    const flagGlow = useMemo(() => {
        switch (currentFlag) {
            case 'SC': return 'rgba(255, 152, 0, 0.3)';
            case 'VSC': return 'rgba(255, 152, 0, 0.2)';
            case 'RED': return 'rgba(255, 23, 68, 0.3)';
            case 'YELLOW': return 'rgba(255, 193, 7, 0.2)';
            default: return 'rgba(0, 230, 118, 0.05)';
        }
    }, [currentFlag]);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            onClick={() => setSelectedDriver(null)}
        >
            {/* Background radial glow */}
            <div
                className="absolute inset-0 pointer-events-none transition-all duration-1000"
                style={{
                    background: `radial-gradient(circle at center, ${flagGlow} 0%, transparent 60%)`,
                }}
            />

            {/* Circuit Info Overlay - Top Left */}
            {raceConfig && (
                <div className="absolute top-4 left-4 z-20">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-ui uppercase tracking-[0.2em] text-f1-red font-bold">
                            LIVE SIMULATION
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-f1-red animate-pulse" />
                    </div>
                    <div className="text-[22px] font-racing text-white uppercase tracking-tight leading-none">
                        {raceConfig.circuitName.replace(' Grand Prix', '')}
                    </div>
                    <div className="text-[11px] font-ui text-white/35 font-medium uppercase tracking-widest mt-0.5">
                        {raceConfig.country}
                    </div>
                </div>
            )}

            {/* Lap Counter - Top Right */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
                {currentFlag !== 'GREEN' && (
                    <div className={`px-2 py-1 rounded text-[10px] font-bold font-ui uppercase tracking-wider ${currentFlag === 'SC' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                        currentFlag === 'VSC' ? 'bg-orange-400/20 text-orange-300 border border-orange-400/30' :
                            currentFlag === 'RED' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                        {currentFlag === 'SC' ? 'SAFETY CAR' : currentFlag}
                    </div>
                )}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 rounded-full border border-white/10 backdrop-blur-md">
                    <span className="text-[10px] font-ui uppercase tracking-widest text-white/40">LAP</span>
                    <span className="text-[14px] font-timing font-bold text-white tabular-nums">
                        {currentLap}
                    </span>
                    <span className="text-[10px] font-ui text-white/30">/ {raceConfig?.totalLaps}</span>
                </div>
            </div>

            {/* Track Map Layer - visible background */}
            <div className="relative w-[85%] h-[85%] flex items-center justify-center">
                {/* Map Image — only for circuits WITHOUT accurate path */}
                {circuitConfig.mapImage && !circuitConfig.hasAccuratePath && (
                    <img
                        src={circuitConfig.mapImage}
                        alt="Circuit Map"
                        className="absolute w-full h-full object-contain opacity-70 drop-shadow-[0_0_20px_rgba(255,255,255,0.08)]"
                        style={{
                            filter: 'invert(1) grayscale(1) brightness(1.8) contrast(1.1)',
                        }}
                    />
                )}

                {/* Hidden SVG for path calculations only */}
                <svg
                    ref={svgRef}
                    viewBox={circuitConfig.viewBox}
                    className="absolute w-full h-full opacity-0 pointer-events-none"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <path
                        ref={pathRef}
                        d={circuitConfig.path}
                        fill="none"
                        stroke="transparent"
                    />
                </svg>

                {/* Accurate SVG Track Outline — visible for circuits with real path data */}
                {circuitConfig.hasAccuratePath && (
                    <svg
                        viewBox={circuitConfig.viewBox}
                        className="absolute w-full h-full"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <defs>
                            <linearGradient id="accurateTrackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="rgba(0,230,118,0.6)" />
                                <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
                                <stop offset="100%" stopColor="rgba(0,176,255,0.6)" />
                            </linearGradient>
                            <filter id="trackGlow">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        {/* Outer ambient glow */}
                        <path
                            d={circuitConfig.path}
                            fill="none"
                            stroke="rgba(0,230,118,0.06)"
                            strokeWidth={22}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ filter: 'blur(8px)' }}
                        />
                        {/* Track surface (wide, dark) */}
                        <path
                            d={circuitConfig.path}
                            fill="none"
                            stroke="rgba(255,255,255,0.08)"
                            strokeWidth={14}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        {/* Track center line (neon) */}
                        <path
                            d={circuitConfig.path}
                            fill="none"
                            stroke="url(#accurateTrackGradient)"
                            strokeWidth={3}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter="url(#trackGlow)"
                        />
                    </svg>
                )}

                {/* Fallback SVG Track outline (when no map image and no accurate path) */}
                {!circuitConfig.mapImage && !circuitConfig.hasAccuratePath && (
                    <svg
                        viewBox={circuitConfig.viewBox}
                        className="absolute w-full h-full"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <defs>
                            <linearGradient id="trackOutline" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                                <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
                            </linearGradient>
                        </defs>
                        {/* Outer glow */}
                        <path
                            d={circuitConfig.path}
                            fill="none"
                            stroke="rgba(255,255,255,0.03)"
                            strokeWidth={28}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ filter: 'blur(6px)' }}
                        />
                        {/* Track line */}
                        <path
                            d={circuitConfig.path}
                            fill="none"
                            stroke="url(#trackOutline)"
                            strokeWidth={12}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}

                {/* Driver Dots - positioned via CSS percentages */}
                {driverPositions.map(({ driver, x, y }) => (
                    <DriverDot
                        key={driver.driverCode}
                        driver={driver}
                        x={x}
                        y={y}
                        isSelected={selectedDriver === driver.driverCode}
                        onSelect={() => setSelectedDriver(
                            selectedDriver === driver.driverCode ? null : driver.driverCode
                        )}
                    />
                ))}
            </div>

            {/* Selected Driver Detail - Bottom Left */}
            {selectedDriver && (() => {
                const d = currentStandings.find(s => s.driverCode === selectedDriver);
                if (!d || d.status === 'OUT') return null;
                return (
                    <div className="absolute bottom-4 left-4 z-30">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl">
                            <div className="flex flex-col items-center justify-center w-10">
                                <div className="text-[24px] font-racing leading-none text-white">{d.position}</div>
                                <div className="text-[8px] font-ui uppercase text-white/40 tracking-wider">POS</div>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="w-[3px] h-[14px] rounded-full" style={{ backgroundColor: d.teamColor }} />
                                    <div className="text-[16px] font-bold font-timing text-white leading-none">{d.driverCode}</div>
                                </div>
                                <div className="text-[10px] font-ui text-white/50 uppercase tracking-wider mt-0.5">{d.teamName}</div>
                            </div>
                            <div className="w-px h-8 bg-white/10 ml-2" />
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                <div className="flex flex-col items-end">
                                    <div className="text-[14px] font-bold font-timing text-white tabular-nums leading-none">{d.speed}</div>
                                    <div className="text-[8px] font-ui uppercase text-white/40">KM/H</div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="text-[14px] font-bold font-timing text-white tabular-nums leading-none">{d.interval}</div>
                                    <div className="text-[8px] font-ui uppercase text-white/40">INT</div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}
