
import { useSimulationStore } from '../../store/useSimulationStore';
import { motion, AnimatePresence } from 'framer-motion';

export function Leaderboard() {
    const { standings } = useSimulationStore();

    return (
        <div className="w-full h-full p-4 overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between text-[10px] text-white/40 uppercase tracking-widest mb-4 sticky top-0 bg-[#0B0D10]/95 backdrop-blur z-10 py-2 border-b border-white/10">
                <span className="w-8 text-center">Pos</span>
                <span className="flex-1 pl-2">Driver</span>
                <span className="w-16 text-right">Gap</span>
            </div>

            <div className="space-y-2">
                <AnimatePresence>
                    {standings.map((entry) => (
                        <motion.div
                            key={entry.driver.code}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="group flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                        >
                            {/* Position */}
                            <div className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-bold font-mono
                                ${entry.position <= 3 ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'text-white/50'}
                            `}>
                                {entry.position}
                            </div>

                            {/* Team Color Bar */}
                            <div
                                className="w-1 h-8 rounded-full shadow-[0_0_8px_currentColor]"
                                style={{ backgroundColor: entry.driver.constructor.color, color: entry.driver.constructor.color }}
                            />

                            {/* Driver Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-base tracking-tight truncate text-white">
                                        {entry.driver.code}
                                    </span>
                                    {entry.currentTire && (
                                        <div className={`w-2 h-2 rounded-full border border-white/20 ml-2
                                            ${entry.currentTire === 'SOFT' ? 'bg-[#FF3333]' :
                                                entry.currentTire === 'MEDIUM' ? 'bg-[#FFC906]' :
                                                    entry.currentTire === 'HARD' ? 'bg-white' :
                                                        entry.currentTire === 'INTER' ? 'bg-[#47C839]' : 'bg-[#0390FC]'}
                                        `} />
                                    )}
                                </div>
                                <div className="text-[10px] text-white/40 truncate uppercase tracking-wider">
                                    {entry.driver.constructor.name || "Team"}
                                </div>
                            </div>

                            {/* Timing */}
                            <div className="text-right flex flex-col items-end">
                                <div className={`font-mono text-sm font-bold ${entry.gap === 'LEADER' ? 'text-[#00D2BE]' : 'text-white'}`}>
                                    {entry.gap}
                                </div>
                                {entry.interval && (
                                    <div className="text-[10px] font-mono text-white/40">
                                        {entry.interval}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
