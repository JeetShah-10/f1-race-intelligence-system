import { motion } from 'framer-motion';
import { useScroll } from '../../context/ScrollContext';

interface HeroOverlayProps {
    /** Whether to show the overlay */
    visible?: boolean;
}

export function HeroOverlay({ visible = true }: HeroOverlayProps) {
    const { scrollProgress } = useScroll();

    // Fade out as user scrolls past hero section
    const opacity = Math.max(0, 1 - scrollProgress * 3);

    if (!visible || opacity < 0.1) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity }}
            className="fixed inset-0 z-20 pointer-events-none"
        >
            {/* Left Side HUD - Speed & RPM */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-6">
                <SpeedArc speed={287} maxSpeed={350} />
                <GearIndicator gear={7} rpm={11200} maxRpm={12500} />
            </div>

            {/* Right Side HUD - Delta & ERS */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
                <DeltaBar delta={-0.347} />
                <ERSIndicator deploy={78} harvest={12} />
                <TireIndicatorPanel compound="C3" age={14} />
            </div>

            {/* Bottom HUD - Throttle/Brake */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2">
                <ThrottleBrakePanel throttle={92} brake={0} />
            </div>

            {/* Top Corner - Session Info */}
            <div className="absolute top-24 left-8">
                <SessionBadge session="RACE" lap={47} totalLaps={57} />
            </div>
        </motion.div>
    );
}

function SpeedArc({ speed, maxSpeed }: { speed: number; maxSpeed: number }) {
    const percentage = (speed / maxSpeed) * 100;
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (percentage / 100) * circumference * 0.75;

    return (
        <div className="hud-panel p-4 w-32">
            <svg viewBox="0 0 100 100" className="w-full">
                {/* Background Arc */}
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="4"
                    strokeDasharray={circumference * 0.75}
                    strokeDashoffset={circumference * 0.25}
                    strokeLinecap="round"
                    transform="rotate(135 50 50)"
                />
                {/* Progress Arc */}
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#speedGradient)"
                    strokeWidth="4"
                    strokeDasharray={circumference * 0.75}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform="rotate(135 50 50)"
                    className="transition-all duration-200"
                />
                {/* Gradient Definition */}
                <defs>
                    <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00FFFF" />
                        <stop offset="100%" stopColor="#FF00FF" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-square text-3xl font-bold text-white">{speed}</span>
                <span className="font-square text-[10px] text-silver-arrow/60 tracking-widest">KM/H</span>
            </div>
        </div>
    );
}

function GearIndicator({ gear, rpm, maxRpm }: { gear: number; rpm: number; maxRpm: number }) {
    const rpmPercentage = (rpm / maxRpm) * 100;
    const isRedline = rpmPercentage > 90;

    return (
        <div className="hud-panel p-4 text-center">
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                    <span className="font-square text-[10px] text-silver-arrow/60 tracking-widest">GEAR</span>
                    <span
                        className={`font-square text-5xl font-bold ${isRedline ? 'text-ferrari-red neon-glow' : 'text-white'}`}
                    >
                        {gear}
                    </span>
                </div>
                <div className="flex flex-col gap-1">
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-colors ${7 - i < gear
                                ? isRedline
                                    ? 'bg-ferrari-red'
                                    : 'bg-electric-cyan'
                                : 'bg-white/10'
                                }`}
                        />
                    ))}
                </div>
            </div>
            <div className="mt-2 text-center">
                <span className="font-square text-sm text-silver-arrow">{rpm.toLocaleString()}</span>
                <span className="font-square text-[10px] text-silver-arrow/60 ml-1">RPM</span>
            </div>
        </div>
    );
}

function DeltaBar({ delta }: { delta: number }) {
    const isAhead = delta < 0;
    const absValue = Math.abs(delta).toFixed(3);

    return (
        <div className="hud-panel p-4 w-40">
            <div className="flex items-center justify-between mb-2">
                <span className="font-square text-[10px] text-silver-arrow/60 tracking-widest">DELTA</span>
                <span className="font-square text-[10px] text-silver-arrow/60">vs LEADER</span>
            </div>
            <div
                className={`font-square text-2xl font-bold text-center ${isAhead ? 'text-sector-green' : 'text-ferrari-red'
                    }`}
            >
                {isAhead ? '-' : '+'}{absValue}
            </div>
            <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full ${isAhead ? 'bg-sector-green' : 'bg-ferrari-red'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(Math.abs(delta) * 20, 100)}%` }}
                />
            </div>
        </div>
    );
}

function ERSIndicator({ deploy, harvest }: { deploy: number; harvest: number }) {
    return (
        <div className="hud-panel p-4 w-40">
            <div className="flex items-center justify-between mb-2">
                <span className="font-square text-[10px] text-electric-cyan tracking-widest">ERS</span>
                <span className="font-square text-[10px] text-silver-arrow/60">{deploy}%</span>
            </div>
            <div className="space-y-2">
                {/* Deploy Bar */}
                <div className="flex items-center gap-2">
                    <span className="font-square text-[8px] text-silver-arrow/40 w-8">DPLY</span>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-turbine-blue to-electric-cyan"
                            style={{ width: `${deploy}%` }}
                        />
                    </div>
                </div>
                {/* Harvest Bar */}
                <div className="flex items-center gap-2">
                    <span className="font-square text-[8px] text-silver-arrow/40 w-8">HRVT</span>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-sector-green to-sector-yellow"
                            style={{ width: `${harvest}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function TireIndicatorPanel({ compound, age }: { compound: string; age: number }) {
    const compoundColors: Record<string, string> = {
        C1: '#F2F2F2',
        C2: '#E2DD47',
        C3: '#F74141',
        INTER: '#1EB53A',
        WET: '#0064E0',
    };

    return (
        <div className="hud-panel p-4 w-40">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div
                        className="w-6 h-6 rounded-full border-2 border-white/20"
                        style={{ backgroundColor: compoundColors[compound] || '#fff' }}
                    />
                    <div>
                        <span className="font-square text-lg font-bold text-white">{compound}</span>
                        <span className="font-square text-[10px] text-silver-arrow/60 block">COMPOUND</span>
                    </div>
                </div>
                <div className="text-right">
                    <span className="font-square text-lg font-bold text-white">{age}</span>
                    <span className="font-square text-[10px] text-silver-arrow/60 block">LAPS</span>
                </div>
            </div>
        </div>
    );
}

function ThrottleBrakePanel({ throttle, brake }: { throttle: number; brake: number }) {
    return (
        <div className="hud-panel p-4 flex gap-6">
            {/* Throttle */}
            <div className="flex flex-col items-center">
                <div className="w-4 h-24 bg-white/10 rounded-full overflow-hidden flex flex-col-reverse">
                    <motion.div
                        className="w-full bg-gradient-to-t from-sector-green to-electric-cyan"
                        style={{ height: `${throttle}%` }}
                    />
                </div>
                <span className="font-square text-[10px] text-sector-green mt-2">THR</span>
                <span className="font-square text-sm text-white">{throttle}%</span>
            </div>
            {/* Brake */}
            <div className="flex flex-col items-center">
                <div className="w-4 h-24 bg-white/10 rounded-full overflow-hidden flex flex-col-reverse">
                    <motion.div
                        className="w-full bg-gradient-to-t from-ferrari-red to-signal-orange"
                        style={{ height: `${brake}%` }}
                    />
                </div>
                <span className="font-square text-[10px] text-ferrari-red mt-2">BRK</span>
                <span className="font-square text-sm text-white">{brake}%</span>
            </div>
        </div>
    );
}

function SessionBadge({ session, lap, totalLaps }: { session: string; lap: number; totalLaps: number }) {
    return (
        <div className="hud-panel px-4 py-2 flex items-center gap-4">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-sector-green rounded-full animate-pulse" />
                <span className="font-square text-sm font-bold text-white tracking-wider">{session}</span>
            </div>
            <div className="h-4 w-[1px] bg-white/20" />
            <div>
                <span className="font-square text-lg font-bold text-white">{lap}</span>
                <span className="font-square text-sm text-silver-arrow/60">/{totalLaps}</span>
            </div>
        </div>
    );
}
