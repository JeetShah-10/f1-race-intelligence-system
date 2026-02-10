import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface RecentItem {
    id: string;
    type: 'simulation' | 'prediction' | 'analysis';
    title: string;
    circuit?: string;
    timestamp: string;
}

const typeIcons: Record<string, React.ReactNode> = {
    simulation: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21" />
        </svg>
    ),
    prediction: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    ),
    analysis: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 9h.01M15 9h.01M9 15h6" />
        </svg>
    )
};

const typeColors: Record<string, string> = {
    simulation: 'text-emerald-400 bg-emerald-500/10',
    prediction: 'text-blue-400 bg-blue-500/10',
    analysis: 'text-orange-400 bg-orange-500/10'
};

// Mock recent work data - will be replaced by API
const mockRecentWork: RecentItem[] = [
    { id: '1', type: 'simulation', title: 'Monaco GP Simulation', circuit: 'Monaco', timestamp: '2 hours ago' },
    { id: '2', type: 'prediction', title: 'VER vs NOR Analysis', timestamp: '5 hours ago' },
    { id: '3', type: 'analysis', title: 'Tyre Strategy Report', circuit: 'Barcelona', timestamp: 'Yesterday' }
];

export const RecentWorkWidget: React.FC = () => {
    const recentWork = mockRecentWork;

    return (
        <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.08] overflow-hidden">

            <div className="px-4 py-3 border-b border-white/[0.08] flex items-center justify-between">
                <h3 className="text-white/90 font-semibold text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Recent Work
                </h3>
            </div>


            <div className="p-2">
                {recentWork.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Link
                            to={`/${item.type}/${item.id}`}
                            className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-white/[0.05] transition-colors group"
                        >

                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${typeColors[item.type]}`}>
                                {typeIcons[item.type]}
                            </div>


                            <div className="flex-1 min-w-0">
                                <span className="text-white/90 text-sm font-medium truncate block group-hover:text-white transition-colors">
                                    {item.title}
                                </span>
                                <div className="flex items-center gap-2">
                                    {item.circuit && (
                                        <span className="text-white/40 text-xs">
                                            {item.circuit}
                                        </span>
                                    )}
                                    <span className="text-white/30 text-xs">
                                        {item.timestamp}
                                    </span>
                                </div>
                            </div>


                            <svg className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </Link>
                    </motion.div>
                ))}
            </div>


            <div className="px-4 py-2 border-t border-white/[0.08]">
                <button className="w-full text-center text-white/50 text-xs hover:text-white/80 transition-colors">
                    View All Work →
                </button>
            </div>
        </div>
    );
};

export default RecentWorkWidget;
