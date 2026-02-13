import React from 'react';
import { motion } from 'framer-motion';
import { useDashboardStore } from '../../../store/useDashboardStore';

const teamColors: Record<string, string> = {
    'Red Bull': '#3671C6',
    'Ferrari': '#E8002D',
    'McLaren': '#FF8700',
    'Mercedes': '#27F4D2',
    'Aston Martin': '#229971',
    'Alpine': '#FF87BC',
    'Williams': '#64C4FF',
    'Racing Bulls': '#6692FF',
    'Audi': '#52E252',
    'Haas': '#B6BABD',
    'Cadillac': '#1E3D6F'
};

const trendConfig: Record<string, { icon: string; color: string; bgColor: string; label: string }> = {
    dominant: { icon: '', color: 'text-emerald-400', bgColor: 'bg-emerald-400/10', label: 'Dominant' },
    rising: { icon: '', color: 'text-green-400', bgColor: 'bg-green-400/10', label: 'Rising' },
    stable: { icon: '->', color: 'text-white/50', bgColor: 'bg-white/5', label: 'Stable' },
    volatile: { icon: '', color: 'text-amber-400', bgColor: 'bg-amber-400/10', label: 'Volatile' },
    declining: { icon: '', color: 'text-red-400', bgColor: 'bg-red-400/10', label: 'Declining' }
};

export const MomentumTracker: React.FC = () => {
    const momentum = useDashboardStore(state => state.momentum);
    const standings = useDashboardStore(state => state.standings);

    const drivers = momentum.slice(0, 6).map(m => {
        const driver = standings.find(d => d.code === m.driver);
        return { ...m, ...driver, code: m.driver };
    });

    return (
        <div className="h-full bg-white/[0.02] backdrop-blur-sm rounded-xl border border-white/[0.06] overflow-hidden flex flex-col">

            <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between bg-gradient-to-r from-[#E10600]/5 to-transparent">
                <h3 className="text-white/90 font-semibold text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-pulse" />
                    Driver Momentum
                </h3>
                <span className="text-white/40 text-xs font-mono">Last 5 Races</span>
            </div>


            <div className="flex-1 p-4 grid grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto">
                {drivers.map((driver, index) => {
                    const trend = trendConfig[driver.trend || 'stable'];
                    const teamColor = teamColors[driver.team || ''] || '#666';

                    return (
                        <motion.div
                            key={driver.code}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            className="relative p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] cursor-pointer group overflow-hidden hover:border-white/[0.12] transition-all duration-300"
                        >

                            <div
                                className="absolute top-0 left-0 right-0 h-1 opacity-80"
                                style={{ backgroundColor: teamColor }}
                            />


                            <div className="flex items-center gap-2 mb-2">

                                <div
                                    className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0"
                                    style={{
                                        boxShadow: `0 0 0 1.5px ${teamColor}40`,
                                        background: `linear-gradient(135deg, ${teamColor}15, transparent)`
                                    }}
                                >
                                    {driver.image ? (
                                        <img
                                            src={driver.image}
                                            alt={driver.name}
                                            className="w-full h-full object-cover object-top scale-125"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                            }}
                                        />
                                    ) : null}
                                    <div className={`absolute inset-0 flex items-center justify-center text-white font-bold text-[10px] ${driver.image ? 'hidden' : ''}`}
                                        style={{ backgroundColor: teamColor }}
                                    >
                                        {driver.code}
                                    </div>
                                </div>


                                <div className="flex-1 min-w-0">
                                    <span className="text-white font-bold text-base block leading-tight">
                                        {driver.code}
                                    </span>
                                    <span className={`text-[10px] ${trend.color} font-medium`}>
                                        {trend.label}
                                    </span>
                                </div>


                                <div className={`px-1.5 py-0.5 rounded ${trend.bgColor}`}>
                                    <span className={`text-lg ${trend.color}`}>
                                        {trend.icon}
                                    </span>
                                </div>
                            </div>


                            <div className="flex items-center gap-1 mb-2">
                                {(driver.last5 || []).map((pos, i) => {
                                    const posNum = parseInt(pos.replace('P', ''), 10);
                                    return (
                                        <div
                                            key={i}
                                            className={`
                                                w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold font-mono
                                                ${posNum <= 3 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                                    posNum <= 10 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                                        'bg-white/5 text-white/40 border border-white/10'}
                                            `}
                                        >
                                            {pos}
                                        </div>
                                    );
                                })}
                            </div>


                            {driver.delta && (
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-white/30">Gap</span>
                                    <span className={`font-mono font-medium ${driver.delta.startsWith('+') ? 'text-white/60' : 'text-emerald-400'
                                        }`}>
                                        {driver.delta}
                                    </span>
                                </div>
                            )}


                            <div className="absolute bottom-1 right-2 text-[9px] text-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                {driver.name?.split(' ')[1]}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default MomentumTracker;
