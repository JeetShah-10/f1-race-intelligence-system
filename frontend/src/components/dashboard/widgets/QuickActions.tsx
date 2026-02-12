import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const actions = [
    {
        id: 'simulate',
        title: 'Simulate',
        description: 'Run race scenarios & what-ifs',
        path: '/simulate',
        icon: (
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
            </svg>
        ),
        texture: '/assets/textures/Screenshot 2026-02-11 202112.png'
    },
    {
        id: 'predict',
        title: 'Predict',
        description: 'AI-powered race predictions',
        path: '/predict',
        icon: (
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
        ),
        texture: '/assets/textures/Screenshot 2026-02-11 202444.png'
    },
    {
        id: 'analyze',
        title: 'Analyze',
        description: 'Deep telemetry analysis',
        path: '/analyze',
        icon: (
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
            </svg>
        ),
        texture: '/assets/textures/Screenshot 2026-02-11 201617.png'
    }
];

export const QuickActions: React.FC = () => {
    return (
        <div className="flex flex-col gap-3 h-full">
            {actions.map((action, index) => (
                <motion.div
                    key={action.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-1"
                >
                    <Link to={action.path} className="block h-full group">
                        <motion.div
                            whileHover={{ scale: 1.03, y: -2 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                            className="relative h-full rounded-xl overflow-hidden bg-black/80 backdrop-blur-md border border-white/[0.08] hover:border-[#E10600]/40 transition-all duration-300"
                            style={{
                                boxShadow: '0 0 0 rgba(225,6,0,0)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = '0 0 25px rgba(225,6,0,0.25), inset 0 1px 0 rgba(225,6,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '0 0 0 rgba(225,6,0,0)';
                            }}
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center opacity-[0.07] group-hover:opacity-[0.14] transition-opacity duration-500"
                                style={{ backgroundImage: `url(${action.texture})` }}
                            />

                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E10600]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            </div>

                            <div className="relative z-10 flex items-center gap-4 p-4 h-full">
                                <div className="p-2.5 rounded-lg bg-[#E10600]/10 text-[#E10600] border border-[#E10600]/20 flex-shrink-0">
                                    {action.icon}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-bold text-lg leading-tight tracking-wide">
                                        {action.title}
                                    </h3>
                                    <p className="text-white/50 text-sm truncate">
                                        {action.description}
                                    </p>
                                </div>

                                <div className="text-white/30 group-hover:text-[#E10600] group-hover:translate-x-1 transition-all duration-300 flex-shrink-0">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
};

export default QuickActions;
