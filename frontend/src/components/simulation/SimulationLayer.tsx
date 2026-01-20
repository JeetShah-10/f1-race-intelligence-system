import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const HERITAGE = {
    ferrariRosso: '#CF2C28',
    alpineBlue: '#004BFF',
    silverArrow: '#9FA4A8',
    carbonBlack: '#0B0D10',
    asphaltCharcoal: '#15171C',
};

const TECH = {
    turbineBlue: '#1A9FFF',
    signalOrange: '#FF6A00',
    industrialAmber: '#FFAE00',
    neutralGray: '#2C323C',
    steelGray: '#3B424F',
};

const SEMANTICS = {
    sectorBest: '#A020F0',
    personalBest: '#00E676',
    caution: '#F9E300',
    failure: '#E32636',
    ers: '#008CFF',
    neutral: '#FFFFFF',
};

const TEAMS: Record<string, string> = {
    'RBR': '#3671C6',
    'FER': '#E8002D',
    'MER': '#27F4D2',
    'MCL': '#FF8000',
    'ALP': '#FF87BC',
    'AST': '#229971',
    'WIL': '#64C4FF',
    'HAA': '#B6BABD',
    'SAU': '#52E252',
    'RBT': '#6692FF',
};

const TIRES = {
    hard: '#F2F2F2',
    medium: '#E2DD47',
    soft: '#F74141',
    inter: '#1EB53A',
    wet: '#0064E0',
};

const RACE_DATA = [
    { pos: 1, driver: 'VER', team: 'RBR', gap: 'LEADER', tire: 'M', stint: 18, drs: false },
    { pos: 2, driver: 'NOR', team: 'MCL', gap: '+0.847', tire: 'M', stint: 18, drs: true },
    { pos: 3, driver: 'LEC', team: 'FER', gap: '+4.231', tire: 'H', stint: 24, drs: false },
    { pos: 4, driver: 'SAI', team: 'FER', gap: '+6.892', tire: 'H', stint: 24, drs: false },
    { pos: 5, driver: 'HAM', team: 'MER', gap: '+11.456', tire: 'M', stint: 15, drs: false },
    { pos: 6, driver: 'RUS', team: 'MER', gap: '+14.123', tire: 'M', stint: 15, drs: false },
    { pos: 7, driver: 'PIA', team: 'MCL', gap: '+22.567', tire: 'H', stint: 28, drs: false },
    { pos: 8, driver: 'ALO', team: 'AST', gap: '+28.901', tire: 'H', stint: 28, drs: false },
];

const PREMIUM_EASING = [0.17, 0.84, 0.44, 1] as const;

// Las Vegas GP Track - Premium Telemetry Style
function VegasCircuitMap({ progress }: { progress: number }) {
    return (
        <svg viewBox="0 0 480 300" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
                <filter id="trackGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Track base */}
            <g transform="translate(40, 30)">
                {/* Track surface outline */}
                <path
                    d="M 40 220 
                       L 40 70 
                       Q 40 30 80 30 
                       L 280 30 
                       Q 320 30 320 70 
                       L 320 130 
                       Q 320 170 360 170 
                       L 380 170 
                       Q 400 170 400 190 
                       L 400 230 
                       Q 400 250 380 250 
                       L 80 250 
                       Q 40 250 40 220 
                       Z"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="28"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* SECTOR 1 - Yellow (Caution) */}
                <motion.path
                    d="M 40 220 L 40 70 Q 40 30 80 30 L 160 30"
                    fill="none"
                    stroke={SEMANTICS.caution}
                    strokeWidth="5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: progress }}
                    transition={{ duration: 1.2, ease: PREMIUM_EASING }}
                    filter="url(#trackGlow)"
                />

                {/* SECTOR 2 - Red (Failure/Heritage) */}
                <motion.path
                    d="M 160 30 L 280 30 Q 320 30 320 70 L 320 130 Q 320 170 360 170"
                    fill="none"
                    stroke={HERITAGE.ferrariRosso}
                    strokeWidth="5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: progress }}
                    transition={{ duration: 1.2, delay: 0.3, ease: PREMIUM_EASING }}
                    filter="url(#trackGlow)"
                />

                {/* SECTOR 3 - Purple (Sector Best) */}
                <motion.path
                    d="M 360 170 L 380 170 Q 400 170 400 190 L 400 230 Q 400 250 380 250 L 80 250 Q 40 250 40 220"
                    fill="none"
                    stroke={SEMANTICS.sectorBest}
                    strokeWidth="5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: progress }}
                    transition={{ duration: 1.2, delay: 0.6, ease: PREMIUM_EASING }}
                    filter="url(#trackGlow)"
                />

                {/* Pit Lane */}
                <motion.path
                    d="M 90 210 L 90 190 L 280 190 L 280 210"
                    fill="none"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="2"
                    strokeDasharray="8 4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: progress > 0.5 ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: PREMIUM_EASING }}
                />
                <motion.text
                    x="185" y="205"
                    textAnchor="middle"
                    className="text-[11px] fill-white/40 font-medium tracking-wider"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: progress > 0.5 ? 1 : 0 }}
                >
                    PIT LANE
                </motion.text>

                {/* DRS Zones - Green */}
                <motion.path
                    d="M 100 250 L 320 250"
                    fill="none"
                    stroke={SEMANTICS.personalBest}
                    strokeWidth="8"
                    opacity="0.35"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: progress > 0.7 ? 1 : 0 }}
                    transition={{ duration: 0.6, ease: PREMIUM_EASING }}
                />

                {/* Start/Finish */}
                <rect x="36" y="210" width="8" height="4" fill="white" />

                {/* Car positions */}
                {progress > 0.4 && RACE_DATA.slice(0, 5).map((driver, i) => {
                    const positions = [
                        { x: 40, y: 150, label: 'P1' },
                        { x: 40, y: 175, label: 'P2' },
                        { x: 120, y: 30, label: 'P3' },
                        { x: 200, y: 30, label: 'P4' },
                        { x: 320, y: 100, label: 'P5' },
                    ];
                    return (
                        <motion.g
                            key={driver.driver}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 + i * 0.1, duration: 0.4, ease: PREMIUM_EASING }}
                        >
                            <circle
                                cx={positions[i].x}
                                cy={positions[i].y}
                                r="10"
                                fill={TEAMS[driver.team]}
                                stroke="rgba(0,0,0,0.6)"
                                strokeWidth="2"
                            />
                            <text
                                x={positions[i].x}
                                y={positions[i].y + 4}
                                textAnchor="middle"
                                className="text-[10px] font-bold fill-white"
                            >
                                {driver.pos}
                            </text>
                        </motion.g>
                    );
                })}

                {/* Sector Labels */}
                <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: progress > 0.9 ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <text x="30" y="130" className="text-[12px] font-bold" fill={SEMANTICS.caution}>S1</text>
                    <text x="250" y="20" className="text-[12px] font-bold" fill={HERITAGE.ferrariRosso}>S2</text>
                    <text x="390" y="220" className="text-[12px] font-bold" fill={SEMANTICS.sectorBest}>S3</text>
                </motion.g>
            </g>
        </svg>
    );
}

export function SimulationLayer() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentLap, setCurrentLap] = useState(42);
    const totalLaps = 57;

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Layer transforms - smoother transitions
    const headerOpacity = useTransform(scrollYProgress, [0.05, 0.15], [0, 1]);
    const minimapProgress = useTransform(scrollYProgress, [0.1, 0.35], [0, 1]);
    const towerX = useTransform(scrollYProgress, [0.15, 0.3], [-200, 0]);
    const towerOpacity = useTransform(scrollYProgress, [0.15, 0.25], [0, 1]);
    const battleOpacity = useTransform(scrollYProgress, [0.28, 0.4], [0, 1]);
    const battleY = useTransform(scrollYProgress, [0.28, 0.4], [40, 0]);
    const dataOpacity = useTransform(scrollYProgress, [0.32, 0.45], [0, 1]);

    // Track minimap progress for reactive updates
    const [minimapProgressValue, setMinimapProgressValue] = useState(0);
    useMotionValueEvent(minimapProgress, "change", (latest) => {
        setMinimapProgressValue(latest);
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentLap(prev => prev < totalLaps ? prev + 1 : 42);
        }, 12000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative w-full min-h-[150vh]"
            style={{ backgroundColor: HERITAGE.carbonBlack }}
        >
            <div className="sticky top-0 h-screen overflow-hidden">
                <div className="absolute inset-0 p-8 md:p-12 lg:p-16">

                    {/* HEADER */}
                    <motion.div
                        style={{ opacity: headerOpacity }}
                        className="flex items-center justify-between mb-8"
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: HERITAGE.ferrariRosso }} />
                                <span
                                    className="text-sm font-bold tracking-[0.25em] uppercase"
                                    style={{ color: HERITAGE.ferrariRosso }}
                                >
                                    Live Simulation
                                </span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                                LAS VEGAS <span style={{ color: HERITAGE.silverArrow }}>GP</span>
                            </h2>
                        </div>
                        <div className="text-right">
                            <div className="text-sm uppercase tracking-widest mb-1" style={{ color: HERITAGE.silverArrow }}>
                                Lap
                            </div>
                            <div className="text-4xl font-mono font-bold text-white">
                                {currentLap}<span className="text-white/30">/{totalLaps}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* MAIN GRID */}
                    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">

                        {/* TIMING TOWER */}
                        <motion.div
                            style={{ opacity: towerOpacity, x: towerX }}
                            className="col-span-12 lg:col-span-3 xl:col-span-2"
                        >
                            <div
                                className="h-full border border-white/10"
                                style={{ backgroundColor: HERITAGE.asphaltCharcoal }}
                            >
                                <div className="px-4 py-3 border-b border-white/10">
                                    <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: HERITAGE.silverArrow }}>
                                        Positions
                                    </span>
                                </div>
                                <div className="overflow-y-auto max-h-[calc(100%-50px)]">
                                    {RACE_DATA.map((driver, i) => (
                                        <motion.div
                                            key={driver.driver}
                                            initial={{ opacity: 0, x: -30 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.08, duration: 0.4, ease: PREMIUM_EASING }}
                                            className="px-4 py-3 flex items-center gap-3 border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                                        >
                                            {/* Position */}
                                            <span className={`w-6 text-base font-mono font-bold ${driver.pos === 1 ? 'text-[#FFD700]' :
                                                driver.pos === 2 ? 'text-[#C0C0C0]' :
                                                    driver.pos === 3 ? 'text-[#CD7F32]' : 'text-white/60'
                                                }`}>
                                                {driver.pos}
                                            </span>

                                            {/* Team stripe */}
                                            <div
                                                className="w-1 h-6 rounded-sm"
                                                style={{ backgroundColor: TEAMS[driver.team] }}
                                            />

                                            {/* Driver code */}
                                            <span className="text-white text-sm font-bold tracking-wide flex-1">
                                                {driver.driver}
                                            </span>

                                            {/* Tire */}
                                            <div
                                                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                                                style={{
                                                    backgroundColor: driver.tire === 'M' ? TIRES.medium : TIRES.hard,
                                                    color: driver.tire === 'H' ? '#000' : '#fff'
                                                }}
                                            >
                                                {driver.tire}
                                            </div>

                                            {/* DRS */}
                                            {driver.drs && (
                                                <span
                                                    className="text-[10px] font-bold px-1.5 py-0.5"
                                                    style={{
                                                        backgroundColor: `${SEMANTICS.personalBest}20`,
                                                        color: SEMANTICS.personalBest
                                                    }}
                                                >
                                                    DRS
                                                </span>
                                            )}

                                            {/* Gap */}
                                            <span className="text-sm font-mono text-white/50 min-w-[60px] text-right">
                                                {driver.gap === 'LEADER' ? '—' : driver.gap}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* CENTER - MINIMAP + BATTLE */}
                        <div className="col-span-12 lg:col-span-6 xl:col-span-7 flex flex-col gap-4">

                            {/* Circuit Map */}
                            <div
                                className="flex-1 border border-white/10 p-6"
                                style={{ backgroundColor: HERITAGE.asphaltCharcoal }}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm font-bold tracking-[0.2em] uppercase" style={{ color: HERITAGE.silverArrow }}>
                                        Track Position
                                    </span>
                                    <span className="text-sm" style={{ color: TECH.steelGray }}>
                                        Las Vegas Strip • 6.201 km
                                    </span>
                                </div>
                                <div className="h-[calc(100%-40px)]">
                                    <VegasCircuitMap progress={minimapProgressValue} />
                                </div>
                            </div>

                            {/* Battle Focus */}
                            <motion.div
                                style={{ opacity: battleOpacity, y: battleY }}
                                className="border border-white/10 p-6"
                                initial={false}
                            >
                                <div
                                    className="text-sm font-bold tracking-[0.2em] uppercase mb-6"
                                    style={{ color: HERITAGE.silverArrow }}
                                >
                                    Battle for P1
                                </div>

                                <div className="flex items-center justify-between">
                                    {/* Leader */}
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg"
                                            style={{ backgroundColor: TEAMS.RBR }}
                                        >
                                            1
                                        </div>
                                        <div>
                                            <div className="text-white font-bold text-xl">VER</div>
                                            <div className="text-sm" style={{ color: HERITAGE.silverArrow }}>Red Bull Racing</div>
                                        </div>
                                    </div>

                                    {/* Delta */}
                                    <div className="text-center px-12">
                                        <div className="text-5xl font-mono font-bold text-white tracking-tight">
                                            +0.847
                                        </div>
                                        <div className="text-sm mt-2" style={{ color: HERITAGE.silverArrow }}>
                                            INTERVAL
                                        </div>
                                        <div className="mt-4 flex items-center justify-center gap-3">
                                            <span
                                                className="text-sm font-bold px-3 py-1"
                                                style={{
                                                    backgroundColor: `${SEMANTICS.personalBest}15`,
                                                    color: SEMANTICS.personalBest
                                                }}
                                            >
                                                DRS ENABLED
                                            </span>
                                        </div>
                                    </div>

                                    {/* Chaser */}
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <div className="text-white font-bold text-xl text-right">NOR</div>
                                            <div className="text-sm text-right" style={{ color: HERITAGE.silverArrow }}>McLaren</div>
                                        </div>
                                        <div
                                            className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg"
                                            style={{ backgroundColor: TEAMS.MCL }}
                                        >
                                            2
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* RIGHT SIDEBAR */}
                        <motion.div
                            style={{ opacity: dataOpacity }}
                            className="col-span-12 lg:col-span-3 xl:col-span-3 space-y-4"
                        >
                            {/* Sector Times */}
                            <div
                                className="border border-white/10 p-5"
                                style={{ backgroundColor: HERITAGE.asphaltCharcoal }}
                            >
                                <div className="text-sm font-bold tracking-[0.2em] uppercase mb-4" style={{ color: HERITAGE.silverArrow }}>
                                    Sector Times — VER
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { sector: 'S1', time: '28.234', color: SEMANTICS.caution, status: 'pb' },
                                        { sector: 'S2', time: '35.123', color: HERITAGE.ferrariRosso, status: 'green' },
                                        { sector: 'S3', time: '—', color: SEMANTICS.sectorBest, status: 'active' },
                                    ].map((s) => (
                                        <div key={s.sector} className="text-center">
                                            <div className="text-sm font-bold mb-2" style={{ color: s.color }}>
                                                {s.sector}
                                            </div>
                                            <div className={`font-mono text-base ${s.status === 'pb' ? 'px-2 py-1' : ''
                                                }`} style={{
                                                    color: s.status === 'pb' ? SEMANTICS.sectorBest :
                                                        s.status === 'green' ? SEMANTICS.personalBest : 'rgba(255,255,255,0.4)',
                                                    backgroundColor: s.status === 'pb' ? `${SEMANTICS.sectorBest}15` :
                                                        s.status === 'green' ? `${SEMANTICS.personalBest}15` : 'transparent'
                                                }}>
                                                {s.time}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tire Strategy */}
                            <div
                                className="border border-white/10 p-5"
                                style={{ backgroundColor: HERITAGE.asphaltCharcoal }}
                            >
                                <div className="text-sm font-bold tracking-[0.2em] uppercase mb-4" style={{ color: HERITAGE.silverArrow }}>
                                    Tire Strategy
                                </div>
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-black"
                                        style={{ backgroundColor: TIRES.medium }}
                                    >
                                        M
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-white text-base font-bold">MEDIUM</div>
                                        <div className="text-sm" style={{ color: HERITAGE.silverArrow }}>
                                            Lap 18 • 24 laps old
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span style={{ color: HERITAGE.silverArrow }}>Pit Window</span>
                                        <span className="font-mono text-white">LAP 45-48</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${(currentLap / totalLaps) * 100}%`,
                                                background: `linear-gradient(90deg, ${HERITAGE.ferrariRosso}, ${TECH.signalOrange})`
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Weather */}
                            <div
                                className="border border-white/10 p-5"
                                style={{ backgroundColor: HERITAGE.asphaltCharcoal }}
                            >
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    {[
                                        { label: 'TRACK', value: '28°C' },
                                        { label: 'AIR', value: '22°C' },
                                        { label: 'RAIN', value: '0%', color: SEMANTICS.personalBest },
                                    ].map((item) => (
                                        <div key={item.label}>
                                            <div className="text-xs uppercase tracking-wider mb-1" style={{ color: HERITAGE.silverArrow }}>
                                                {item.label}
                                            </div>
                                            <div
                                                className="text-lg font-mono font-bold"
                                                style={{ color: item.color || 'white' }}
                                            >
                                                {item.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Flag Status */}
                            <div
                                className="p-4 flex items-center gap-3"
                                style={{
                                    backgroundColor: `${SEMANTICS.personalBest}10`,
                                    border: `1px solid ${SEMANTICS.personalBest}40`
                                }}
                            >
                                <div className="w-8 h-5" style={{ backgroundColor: SEMANTICS.personalBest }} />
                                <span
                                    className="text-sm font-bold tracking-widest"
                                    style={{ color: SEMANTICS.personalBest }}
                                >
                                    GREEN FLAG
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
