
import { motion } from 'framer-motion';
import type { PredictionDriver } from '../../types/prediction';

interface PredictionClassificationProps {
    drivers: PredictionDriver[];
}

const COMPOUND_COLORS: Record<string, { bg: string; text: string }> = {
    SOFT: { bg: '#FF3333', text: '#fff' },
    MEDIUM: { bg: '#FFC906', text: '#000' },
    HARD: { bg: '#FFFFFF', text: '#000' },
    INTER: { bg: '#1EB53A', text: '#fff' },
    WET: { bg: '#0064E0', text: '#fff' },
};

const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.04,
            duration: 0.35,
            ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
        },
    }),
};

export default function PredictionClassification({ drivers }: PredictionClassificationProps) {
    return (
        <div className="w-full">
            {/* Section label */}
            <div className="flex items-center gap-2 mb-4 px-1">
                <div className="h-[2px] w-5 bg-[#E8002D]" />
                <span className="text-[10px] font-mono tracking-[0.3em] text-white/30 uppercase">
                    Full Classification
                </span>
                <div className="ml-auto">
                    <span className="text-[10px] font-mono text-white/20">P1 – P{drivers.length}</span>
                </div>
            </div>

            {/* Header row */}
            <div className="grid grid-cols-[3px_40px_32px_1fr_1fr_90px_auto_50px] items-center gap-2 px-3 py-1.5 mb-1">
                <div />
                <span className="text-[9px] font-mono text-white/20 uppercase">Pos</span>
                <div />
                <span className="text-[9px] font-mono text-white/20 uppercase">Driver</span>
                <span className="text-[9px] font-mono text-white/20 uppercase">Team</span>
                <span className="text-[9px] font-mono text-white/20 uppercase text-right">Gap</span>
                <span className="text-[9px] font-mono text-white/20 uppercase text-center">Tyres</span>
                <span className="text-[9px] font-mono text-white/20 uppercase text-center">Pits</span>
            </div>

            {/* Rows */}
            <div className="space-y-[2px]">
                {drivers.map((driver, i) => {
                    const isTop3 = driver.position <= 3;
                    const isDNF = driver.status === 'DNF';
                    const posClass =
                        driver.position === 1 ? 'position-gold' :
                            driver.position === 2 ? 'position-silver' :
                                driver.position === 3 ? 'position-bronze' : '';

                    return (
                        <motion.div
                            key={driver.driverCode}
                            custom={i}
                            variants={rowVariants}
                            initial="hidden"
                            animate="visible"
                            className={`
                                grid grid-cols-[3px_40px_32px_1fr_1fr_90px_auto_50px] items-center gap-2 
                                px-3 py-2 rounded-lg transition-all duration-200 group cursor-default
                                ${i % 2 === 0 ? 'bg-white/[0.015]' : 'bg-white/[0.03]'}
                                hover:bg-white/[0.06]
                                ${isDNF ? 'opacity-40' : ''}
                            `}
                            style={{
                                background: isTop3 && !isDNF
                                    ? `linear-gradient(90deg, ${driver.teamColor}08, transparent 30%)`
                                    : undefined,
                            }}
                        >
                            {/* Team color bar */}
                            <div
                                className="w-[3px] h-8 rounded-full transition-all group-hover:h-10"
                                style={{ background: driver.teamColor }}
                            />

                            {/* Position */}
                            <div className="flex items-center justify-center">
                                <span
                                    className={`text-lg font-black ${posClass || (driver.position <= 10 ? 'text-white/80' : 'text-white/30')}`}
                                    style={{ fontFamily: '"Raceline Demo", sans-serif' }}
                                >
                                    {driver.position}
                                </span>
                            </div>

                            {/* Driver photo */}
                            <div
                                className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0"
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    boxShadow: `0 0 0 1px ${driver.teamColor}40`,
                                }}
                            >
                                <img
                                    src={driver.driverPhoto}
                                    alt={driver.driverCode}
                                    className="w-full h-full object-cover object-top"
                                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                            </div>

                            {/* Driver name */}
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="text-xs font-bold text-white tracking-wide">
                                    {driver.driverCode}
                                </span>
                                <span className="text-[10px] text-white/25 font-mono">
                                    {driver.driverNumber}
                                </span>
                                {driver.fastestLap && (
                                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#A020F0] text-white tracking-wider">
                                        FL
                                    </span>
                                )}
                            </div>

                            {/* Team */}
                            <span className="text-[11px] text-white/35 truncate">
                                {driver.teamName}
                            </span>

                            {/* Gap */}
                            <span className={`text-xs font-mono text-right ${isDNF ? 'text-red-400/60' : 'text-white/50'}`}>
                                {driver.gap}
                            </span>

                            {/* Tyre strategy */}
                            <div className="flex items-center gap-0.5">
                                {driver.tyreStrategy.map((stint, si) => (
                                    <div
                                        key={si}
                                        className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold"
                                        style={{
                                            background: COMPOUND_COLORS[stint.compound]?.bg || '#666',
                                            color: COMPOUND_COLORS[stint.compound]?.text || '#fff',
                                        }}
                                        title={`${stint.compound} — ${stint.laps} laps`}
                                    >
                                        {stint.compound[0]}
                                    </div>
                                ))}
                            </div>

                            {/* Pit stops */}
                            <div className="text-center">
                                <span className="text-[11px] font-mono text-white/30">
                                    {isDNF ? '—' : driver.pitStops}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
