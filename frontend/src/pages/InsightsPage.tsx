import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { useDashboardStore, selectInsights, selectSidebarOpen } from '../store/useDashboardStore';

const InsightsPage: React.FC = () => {
    const sidebarOpen = useDashboardStore(selectSidebarOpen);
    const toggleSidebar = useDashboardStore(state => state.toggleSidebar);
    const insights = useDashboardStore(selectInsights);
    const navigate = useNavigate();


    const insightIcons: Record<string, React.ReactNode> = {
        strategy: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
            </svg>
        ),
        prediction: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
            </svg>
        ),
        alert: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
        )
    };

    const insightColors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
        strategy: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', gradient: 'from-blue-500/10 to-transparent' },
        prediction: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', gradient: 'from-purple-500/10 to-transparent' },
        alert: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', gradient: 'from-amber-500/10 to-transparent' }
    };

    const allInsights = [
        { type: 'strategy', title: 'Strategy Recommendation', text: insights.strategyRecommendation, confidence: 0.85 },
        { type: 'prediction', title: 'Safety Car Probability', text: `${Math.round(insights.safetyCarProbability * 100)}% chance of safety car deployment`, confidence: insights.safetyCarProbability },
        { type: 'alert', title: 'Overcut Analysis', text: `Overcut success rate: ${Math.round(insights.overcutSuccessProbability * 100)}%`, confidence: insights.overcutSuccessProbability },
        { type: 'strategy', title: 'Undercut Strength', text: `Undercut effectiveness: ${insights.undercutStrength}`, confidence: 0.75 },
        { type: 'prediction', title: 'Track Evolution', text: `Expected track evolution: ${insights.trackEvolution}`, confidence: 0.80 },
        { type: 'alert', title: 'Pit Loss Time', text: `Estimated pit loss: ${insights.pitLoss} seconds`, confidence: 0.92 },
        { type: 'strategy', title: 'Tyre Degradation - Soft', text: `Soft compound degradation: ${insights.tyreDegradation.soft}`, confidence: 0.78 },
        { type: 'strategy', title: 'Tyre Degradation - Medium', text: `Medium compound degradation: ${insights.tyreDegradation.medium}`, confidence: 0.82 },
        { type: 'strategy', title: 'Tyre Degradation - Hard', text: `Hard compound degradation: ${insights.tyreDegradation.hard}`, confidence: 0.88 },
    ];

    return (
        <DashboardLayout sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar}>
            <div className="p-6 md:p-8 space-y-8 min-h-screen bg-[#0B0D10]">

                <div className="flex flex-col gap-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-white/50 hover:text-white transition-colors w-fit group"
                    >
                        <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-sm font-medium">Back to Dashboard</span>
                    </button>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">Race Intelligence</h1>
                            <p className="text-white/40 text-sm mt-1">Real-time predictive analytics and strategy recommendations</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            <span className="text-white/80 text-sm font-mono">Live Model v3.1 Active</span>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {allInsights.map((insight, index) => {
                        const colors = insightColors[insight.type] || insightColors.strategy;
                        const Icon = insightIcons[insight.type];

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`group p-6 rounded-2xl bg-[#121214] border border-white/5 hover:border-white/10 transition-all duration-300 relative overflow-hidden`}
                            >


                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 rounded-xl ${colors.bg} ${colors.text} ring-1 ring-inset ${colors.border}`}>
                                            {Icon}
                                        </div>
                                        {insight.confidence !== undefined && (
                                            <div className="flex flex-col items-end">
                                                <span className={`text-2xl font-bold ${colors.text} font-mono`}>
                                                    {Math.round(insight.confidence * 100)}%
                                                </span>
                                                <span className="text-white/30 text-[10px] uppercase tracking-wider">Confidence</span>
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-white font-semibold text-lg mb-2">{insight.title}</h3>
                                    <p className="text-white/60 text-sm leading-relaxed">{insight.text}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>


                <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                        <span className="block text-white/30 text-xs uppercase tracking-wider mb-1">Data Source</span>
                        <span className="text-white text-sm font-mono">FIA Official Timing</span>
                    </div>
                    <div>
                        <span className="block text-white/30 text-xs uppercase tracking-wider mb-1">Latency</span>
                        <span className="text-emerald-400 text-sm font-mono">~120ms</span>
                    </div>
                    <div>
                        <span className="block text-white/30 text-xs uppercase tracking-wider mb-1">Prediction Window</span>
                        <span className="text-white text-sm font-mono">Next 5 Laps</span>
                    </div>
                    <div>
                        <span className="block text-white/30 text-xs uppercase tracking-wider mb-1">Last Sync</span>
                        <span className="text-white text-sm font-mono">Just now</span>
                    </div>
                </div>
            </div>
        </DashboardLayout >
    );
};

export default InsightsPage;
