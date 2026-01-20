import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDashboardStore, selectStandings } from '../../store';

export function CompetitiveContext() {
    const standings = useDashboardStore(selectStandings);
    const [hoveredDriver, setHoveredDriver] = useState<string | null>(null);

    const topStandings = standings.slice(0, 5);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 bg-[#131518] border border-white/10 overflow-hidden"
        >
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <span className="text-white font-bold text-sm uppercase tracking-wider">Championship</span>
                <span className="text-white/30 text-xs font-mono">2026</span>
            </div>
            <div>
                {topStandings.map((driver, i: number) => {
                    const pointsDiff = i === 0 ? 'Leader' : `-${topStandings[0].points - driver.points}`;

                    return (
                        <motion.div
                            key={driver.code}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 + i * 0.05 }}
                            onMouseEnter={() => setHoveredDriver(driver.code)}
                            onMouseLeave={() => setHoveredDriver(null)}
                            className={`flex items-center px-5 py-3 border-b border-white/5 cursor-pointer transition-all ${hoveredDriver === driver.code ? 'bg-white/5' : ''
                                }`}
                        >
                            <span className="text-white/30 font-mono text-xs w-5">{driver.position}</span>
                            <motion.div
                                className="w-1 h-8 mx-3"
                                style={{ backgroundColor: driver.teamColor }}
                                animate={{
                                    height: hoveredDriver === driver.code ? 12 : 8,
                                    width: hoveredDriver === driver.code ? 3 : 2
                                }}
                            />
                            <div className="flex-1 min-w-0">
                                <div
                                    className="text-white font-bold text-sm uppercase tracking-wide"
                                    style={{
                                        color: hoveredDriver === driver.code ? driver.teamColor : undefined,
                                        fontFamily: 'NeoSpeed, Rajdhani, sans-serif'
                                    }}
                                >
                                    {driver.code}
                                </div>
                                <div className="text-white/40 text-xs truncate">{driver.team}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-white font-mono text-sm">{driver.points}</div>
                                <div className="text-white/30 text-[10px]">{pointsDiff}</div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
