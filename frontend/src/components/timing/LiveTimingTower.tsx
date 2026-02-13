import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';

interface LiveTimingTowerProps {
    className?: string;
}

// Mock Data matching specs
const drivers = [
    { pos: 1, code: "VER", name: "Verstappen", team: "redbull", teamColor: "#0600EF", gapFormatted: "LEADER" },
    { pos: 2, code: "NOR", name: "Norris", team: "mclaren", teamColor: "#FF8700", gapFormatted: "+2.4" },
    { pos: 3, code: "LEC", name: "Leclerc", team: "ferrari", teamColor: "#E8002D", gapFormatted: "+5.8" },
    { pos: 4, code: "HAM", name: "Hamilton", team: "ferrari", teamColor: "#E8002D", gapFormatted: "+8.2" },
    { pos: 5, code: "SAI", name: "Sainz", team: "williams", teamColor: "#005AFF", gapFormatted: "+12.1" }
];

export const LiveTimingTower: React.FC<LiveTimingTowerProps> = ({ className = '' }) => {
    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            className={`bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl ${className}`}
        >
            {/* Header */}
            <div className="bg-white/5 px-4 py-3 border-b border-white/10 flex justify-between items-center">
                <span className="text-xs font-bold text-f1-red tracking-widest uppercase">Live Simulation</span>
                <span className="text-xs font-mono text-white/50">MONACO GP • LAP 52</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-white/5">
                {drivers.map((d, i) => (
                    <motion.div
                        key={d.code}
                        variants={fadeInUp}
                        custom={i}
                        className="flex items-center px-3 py-2 hover:bg-white/5 transition-colors"
                    >
                        {/* Position */}
                        <div className="w-8 text-center">
                            <span className={`font-bold text-sm ${d.pos === 1 ? 'text-yellow-400' : 'text-white/80'}`}>
                                {d.pos}
                            </span>
                        </div>

                        {/* Team Color Bar */}
                        <div
                            className="w-1 h-6 rounded-full mr-3"
                            style={{ backgroundColor: d.teamColor }}
                        />

                        {/* Driver Code */}
                        <div className="flex-1">
                            <span className="font-bold text-white text-sm tracking-wide">{d.code}</span>
                        </div>

                        {/* Gap */}
                        <div className="text-right">
                            <span className={`font-mono text-xs ${d.pos === 1 ? 'text-green-400' : 'text-white/60'}`}>
                                {d.gapFormatted}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Footer CTA */}
            <div className="p-3 bg-white/5 text-center hover:bg-white/10 transition-colors cursor-pointer group">
                <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors">
                    TRY SIMULATION &rarr;
                </span>
            </div>
        </motion.div>
    );
};
