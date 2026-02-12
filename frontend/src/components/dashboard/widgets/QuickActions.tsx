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
            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
            </svg>
        ),
        gradient: 'from-emerald-500 to-teal-600',
        iconBg: 'bg-emerald-400/20'
    },
    {
        id: 'predict',
        title: 'Predict',
        description: 'AI-powered race predictions',
        path: '/predict',
        icon: (
            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
        ),
        gradient: 'from-blue-500 to-indigo-600',
        iconBg: 'bg-blue-400/20'
    },
    {
        id: 'analyze',
        title: 'Analyze',
        description: 'Deep telemetry analysis',
        path: '/analyze',
        icon: (
            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
            </svg>
        ),
        gradient: 'from-orange-500 to-red-600',
        iconBg: 'bg-orange-400/20'
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
                    <Link
                        to={action.path}
                        className={`
                            block h-full p-4 rounded-xl
                            bg-gradient-to-br ${action.gradient}
                            transform hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20
                            transition-all duration-300
                            group relative overflow-hidden
                        `}
                    >

                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </div>

                        <div className="flex items-center gap-4 relative z-10">

                            <div className={`p-2 rounded-lg ${action.iconBg} text-white/90`}>
                                {action.icon}
                            </div>


                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-bold text-lg leading-tight">
                                    {action.title}
                                </h3>
                                <p className="text-white/70 text-sm truncate">
                                    {action.description}
                                </p>
                            </div>


                            <div className="text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
};

export default QuickActions;

