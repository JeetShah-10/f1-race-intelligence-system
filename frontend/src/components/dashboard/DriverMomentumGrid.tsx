import { motion } from 'framer-motion';
import { useDashboardStore, selectStandings, selectMomentum } from '../../store';

const TREND_STYLES: Record<string, { color: string; label: string }> = {
    dominant: { color: '#00D2BE', label: '▲ Dominant' },
    rising: { color: '#00D2BE', label: '▲ Rising' },
    stable: { color: '#FF8700', label: '— Stable' },
    volatile: { color: '#CF2C28', label: '↕ Volatile' },
    declining: { color: '#CF2C28', label: '▼ Declining' },
};

export function DriverMomentumGrid() {
    const standings = useDashboardStore(selectStandings);
    const momentum = useDashboardStore(selectMomentum);

    const momentumDrivers = momentum.slice(0, 4).map(m => {
        const driver = standings.find(d => d.code === m.driver);
        if (!driver) return null;
        return { ...driver, ...m };
    }).filter(Boolean) as Array<{
        code: string;
        name: string;
        team: string;
        teamColor?: string;
        image?: string;
        driver: string;
        trend: string;
        delta: string;
        last5: string[];
    }>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-12"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-[#CF2C28]" />
                <span className="text-xs text-white/40 uppercase tracking-widest">Driver Momentum</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {momentumDrivers.map((driver, i) => {
                    const trendStyle = TREND_STYLES[driver.trend] || TREND_STYLES.stable;

                    return (
                        <motion.div
                            key={driver.code}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 + i * 0.05 }}
                            whileHover={{ scale: 1.02, y: -4 }}
                            className="relative overflow-hidden border border-white/10 p-5 cursor-pointer group"
                            style={{ background: `linear-gradient(160deg, ${driver.teamColor}20 0%, transparent 40%)` }}
                        >
                            {driver.image && (
                                <div className="absolute -right-6 -bottom-6 w-36 h-44 opacity-20 group-hover:opacity-40 transition-opacity">
                                    <img src={driver.image} alt={driver.name} className="w-full h-full object-cover object-top" />
                                </div>
                            )}

                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-3 h-3" style={{ backgroundColor: driver.teamColor }} />
                                    <span className="text-white font-bold" style={{ fontFamily: 'NeoSpeed, Rajdhani, sans-serif' }}>{driver.code}</span>
                                    <span className="text-white/30 text-xs ml-auto">{driver.team}</span>
                                </div>

                                <div className="mb-4">
                                    <div className="text-3xl font-mono font-medium" style={{ color: trendStyle.color }}>
                                        {driver.delta}
                                    </div>
                                    <div className="text-white/40 text-[10px] uppercase tracking-wider mt-1" style={{ color: trendStyle.color }}>
                                        {trendStyle.label}
                                    </div>
                                </div>

                                <div className="flex gap-1">
                                    {driver.last5.map((pos, idx) => (
                                        <span
                                            key={idx}
                                            className={`text-[10px] px-1.5 py-0.5 ${pos === 'P1' ? 'bg-[#FFD700]/20 text-[#FFD700]' :
                                                pos === 'P2' ? 'bg-[#C0C0C0]/20 text-[#C0C0C0]' :
                                                    pos === 'P3' ? 'bg-[#CD7F32]/20 text-[#CD7F32]' :
                                                        'bg-white/10 text-white/50'
                                                }`}
                                        >
                                            {pos}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
