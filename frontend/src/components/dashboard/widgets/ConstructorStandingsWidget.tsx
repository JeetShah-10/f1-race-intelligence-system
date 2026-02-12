import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GlassCard } from '../../ui/GlassCard';

// Team logos mapping
const teamLogos: Record<string, string> = {
    'Red Bull Racing': '/assets/logos/redbull-logo-small.png',
    'McLaren': '/assets/logos/mclaren-logo-small.webp',
    'Ferrari': '/assets/logos/ferrari-logo-small.webp',
    'Mercedes': '/assets/logos/mercedes-logo-small.webp',
    'Aston Martin': '/assets/logos/aston-martin-small.webp',
    'Alpine': '/assets/logos/alpine-logo-small.webp',
    'Williams': '/assets/logos/williams-logo-2.webp',
    'Racing Bulls': '/assets/logos/racingbulls-logo-small.webp',
    'RB': '/assets/logos/racingbulls-logo-small.webp',
    'Audi': '/assets/logos/audi-logo.webp',
    'Haas': '/assets/logos/haas-logo-small.webp',
    'Cadillac': '/assets/logos/cadillac-logo-small.webp',
};

import { useDashboardStore, selectConstructors } from '../../../store/useDashboardStore';

export const ConstructorStandingsWidget: React.FC = () => {
    const constructors = useDashboardStore(selectConstructors);
    const topConstructors = constructors.slice(0, 8);

    return (
        <GlassCard className="h-full flex flex-col overflow-hidden" blur="sm" padding="none">
            <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between bg-gradient-to-r from-[#E10600]/5 to-transparent flex-shrink-0">
                <h3 className="text-white/90 font-racing text-sm flex items-center gap-2 tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
                    CONSTRUCTORS
                </h3>
                <span className="text-white/40 text-xs font-mono">2026</span>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                {topConstructors.map((team, index) => (
                    <motion.div
                        key={team.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-white/[0.04] transition-all cursor-pointer group border-b border-white/[0.03] last:border-0"
                    >
                        <div className="w-6 text-center flex-shrink-0">
                            <span className={`font-mono font-bold text-lg ${index === 0 ? 'text-yellow-400' :
                                index === 1 ? 'text-gray-300' :
                                    index === 2 ? 'text-amber-600' :
                                        'text-white/40'
                                }`}>
                                {team.position}
                            </span>
                        </div>

                        <div
                            className="w-1 h-8 rounded-full flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity"
                            style={{ backgroundColor: team.color }}
                        />

                        <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-white/[0.05] rounded-lg p-1.5">
                            {teamLogos[team.name] ? (
                                <img
                                    src={teamLogos[team.name]}
                                    alt={team.name}
                                    className="max-w-full max-h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            ) : (
                                <div
                                    className="w-4 h-4 rounded-sm"
                                    style={{ backgroundColor: team.color }}
                                />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <span className="text-white font-bold text-sm uppercase tracking-wider block truncate">
                                {team.name}
                            </span>
                            <span className="text-white/30 text-[10px] uppercase tracking-wider font-mono">
                                {team.drivers}
                            </span>
                        </div>

                        <div className="text-right flex items-baseline gap-1 flex-shrink-0">
                            <span className="text-white font-bold text-sm font-mono">
                                {team.points}
                            </span>
                            <span className="text-white/30 text-[9px] uppercase font-semibold">pts</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="px-4 py-2 border-t border-white/[0.06] bg-white/[0.01] flex-shrink-0">
                <Link to="/standings/constructors" className="w-full text-center text-white/40 text-xs hover:text-[#E10600] transition-colors font-medium flex items-center justify-center gap-1 py-1">
                    View Full Standings
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Link>
            </div>
        </GlassCard>
    );
};

export default ConstructorStandingsWidget;

