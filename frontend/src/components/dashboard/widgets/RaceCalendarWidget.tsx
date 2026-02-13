import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GlassCard } from '../../ui/GlassCard';

import { useDashboardStore, selectCalendar } from '../../../store/useDashboardStore';

export const RaceCalendarWidget: React.FC = () => {
    const races = useDashboardStore(selectCalendar);
    const displayedRaces = races.slice(0, 8);

    const nextRaces = displayedRaces;

    return (
        <GlassCard className="h-full flex flex-col overflow-hidden" blur="sm" padding="none">

            <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between bg-gradient-to-r from-[#E10600]/5 to-transparent flex-shrink-0">
                <h3 className="text-white/90 font-racing text-sm flex items-center gap-2 tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
                    RACE CALENDAR
                </h3>
                <span className="text-white/40 text-xs font-mono">2026 SEASON</span>
            </div>


            <div className="flex-1 overflow-y-auto overscroll-contain" style={{ scrollbarWidth: 'thin', scrollbarColor: '#E10600 transparent' }}>
                {nextRaces.map((race, index) => (
                    <motion.div
                        key={race.round}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center gap-3 px-4 py-2 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer group border-b border-white/[0.03] last:border-0 ${race.status === 'next' ? 'bg-white/[0.02]' : ''
                            }`}
                    >

                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${race.status === 'next'
                            ? 'bg-f1-red text-white'
                            : 'bg-white/[0.05] text-white/40'
                            }`}>
                            {race.round}
                        </div>


                        <span className="text-2xl">{race.flag}</span>


                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-white font-medium text-sm truncate">{race.name}</span>
                                {race.status === 'next' && (
                                    <span className="px-1.5 py-0.5 bg-f1-red/20 text-f1-red text-[9px] font-bold rounded uppercase">
                                        Next
                                    </span>
                                )}
                            </div>
                            <span className="text-white/30 text-[10px] uppercase tracking-wider">
                                {race.country}
                            </span>
                        </div>


                        <div className="text-right">
                            <span className="text-white/60 font-mono text-xs">{race.date}</span>
                        </div>
                    </motion.div>
                ))}
            </div>


            <div className="px-4 py-2 border-t border-white/[0.06] bg-white/[0.01] flex-shrink-0">
                <Link to="/calendar" className="w-full text-center text-white/40 text-xs hover:text-[#E10600] transition-colors font-medium block py-1">
                    View Full Calendar &rarr;
                </Link>
            </div>
        </GlassCard>
    );
};

export default RaceCalendarWidget;
