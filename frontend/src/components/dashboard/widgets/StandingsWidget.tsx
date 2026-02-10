import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDashboardStore, selectStandings } from '../../../store/useDashboardStore';
import { GlassCard } from '../../ui/GlassCard';

const teamColors: Record<string, string> = {
    'Red Bull Racing': '#3671C6',
    'Red Bull': '#3671C6',
    'Ferrari': '#E8002D',
    'McLaren': '#FF8000',
    'Mercedes': '#27F4D2',
    'Aston Martin': '#229971',
    'Alpine': '#0093CC',
    'Williams': '#64C4FF',
    'Racing Bulls': '#6692FF',
    'RB': '#6692FF',
    'Audi': '#000000',
    'Haas': '#B6BABD',
    'Cadillac': '#1E3264',
};



export const StandingsWidget: React.FC = () => {
    const standings = useDashboardStore(selectStandings);
    const top5 = standings.slice(0, 8);

    return (
        <>
            <GlassCard className="h-full flex flex-col overflow-hidden" blur="sm" padding="none">

                <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between bg-gradient-to-r from-[#E10600]/5 to-transparent flex-shrink-0">
                    <h3 className="text-white/90 font-racing text-sm flex items-center gap-2 tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
                        DRIVER STANDINGS
                    </h3>
                    <span className="text-white/40 text-xs font-mono">2026</span>
                </div>


                <div className="flex-1 overflow-y-auto">
                    {top5.map((driver, index) => {
                        const teamColor = teamColors[driver.team] || '#666';

                        return (
                            <motion.div
                                key={driver.code}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center gap-3 px-4 py-2 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer group border-b border-white/[0.03] last:border-0"
                            >

                                <div className="w-6 text-center">
                                    <span className={`font-mono font-bold text-lg ${index === 0 ? 'text-yellow-400' :
                                        index === 1 ? 'text-gray-300' :
                                            index === 2 ? 'text-amber-600' :
                                                'text-white/40'
                                        }`}>
                                        {driver.position}
                                    </span>
                                </div>


                                <div
                                    className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0"
                                    style={{
                                        boxShadow: `0 0 0 2px ${teamColor}`,
                                        background: `linear-gradient(135deg, ${teamColor}20, transparent)`
                                    }}
                                >
                                    {driver.image ? (
                                        <img
                                            src={driver.image}
                                            alt={driver.name}
                                            className="w-full h-full object-cover object-top scale-110"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                            }}
                                        />
                                    ) : null}
                                    <div className={`absolute inset-0 flex items-center justify-center text-white font-bold text-xs ${driver.image ? 'hidden' : ''}`}
                                        style={{ backgroundColor: teamColor }}
                                    >
                                        {driver.code}
                                    </div>
                                </div>


                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-racing text-sm tracking-wide">
                                            {driver.code}
                                        </span>
                                        <span className="text-white/40 text-[10px] truncate opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider font-medium">
                                            {driver.name.split(' ')[1]}
                                        </span>
                                    </div>
                                    <span className="text-white/30 text-[10px] uppercase tracking-wider font-mono">
                                        {driver.team}
                                    </span>
                                </div>


                                <div className="text-right flex items-center gap-1">
                                    <span className="text-white font-bold text-sm">
                                        {driver.points}
                                    </span>
                                    <span className="text-white/40 text-[10px] uppercase font-medium">PTS</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>


                <div className="px-4 py-2 border-t border-white/[0.06] bg-white/[0.01] flex-shrink-0">
                    <Link
                        to="/standings/drivers"
                        className="w-full text-center text-white/40 text-xs hover:text-[#E10600] transition-colors font-medium flex items-center justify-center gap-1 py-1"
                    >
                        View Full Standings
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                </div>
            </GlassCard>


        </>
    );
};

export default StandingsWidget;
