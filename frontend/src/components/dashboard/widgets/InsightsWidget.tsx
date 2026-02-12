import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDashboardStore, selectInsights } from '../../../store/useDashboardStore';

interface InsightCard {
    type: 'strategy' | 'prediction' | 'alert';
    title: string;
    text: string;
    confidence?: number;
}

const insightIcons: Record<string, React.ReactNode> = {
    strategy: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
        </svg>
    ),
    prediction: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
        </svg>
    ),
    alert: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    )
};

const insightColors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
    strategy: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', gradient: 'from-blue-500/20 to-transparent' },
    prediction: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', gradient: 'from-purple-500/20 to-transparent' },
    alert: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', gradient: 'from-amber-500/20 to-transparent' }
};


export const InsightsWidget: React.FC = () => {
    const insights = useDashboardStore(selectInsights);
    const navigate = useNavigate();

    const insightCards: InsightCard[] = [
        { type: 'strategy', title: 'Strategy', text: insights.strategyRecommendation, confidence: 0.85 },
        { type: 'prediction', title: 'Safety Car', text: `${Math.round(insights.safetyCarProbability * 100)}% probability`, confidence: insights.safetyCarProbability },
        { type: 'alert', title: 'Pit Strategy', text: `Overcut: ${Math.round(insights.overcutSuccessProbability * 100)}% | Undercut: ${insights.undercutStrength}`, confidence: insights.overcutSuccessProbability }
    ];

    return (
        <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.08] overflow-hidden">

            <div className="px-4 py-3 border-b border-white/[0.08] flex items-center justify-between">
                <h3 className="text-white/90 font-semibold text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-pulse" />
                    AI Insights
                </h3>
                <span className="text-[#E10600]/60 text-xs">Live</span>
            </div>


            <div className="p-3 space-y-2">
                {insightCards.map((insight, index) => {
                    const colors = insightColors[insight.type] || insightColors.strategy;
                    const Icon = insightIcons[insight.type] || insightIcons.strategy;

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-3 rounded-lg ${colors.bg} border ${colors.border} cursor-pointer hover:scale-[1.02] transition-transform`}
                        >
                            <div className="flex items-start gap-2">
                                <span className={colors.text}>
                                    {Icon}
                                </span>
                                <div className="flex-1">
                                    <span className={`text-xs font-medium ${colors.text}`}>{insight.title}</span>
                                    <p className="text-white/80 text-xs leading-relaxed mt-0.5">
                                        {insight.text}
                                    </p>
                                </div>
                            </div>
                            {insight.confidence !== undefined && (
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${insight.confidence * 100}%` }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                            className={`h-full ${colors.text.replace('text-', 'bg-').replace('-400', '-500/40')}`}
                                        />
                                    </div>
                                    <span className={`text-[10px] ${colors.text}`}>
                                        {Math.round(insight.confidence * 100)}%
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>


            <div className="px-4 py-2 border-t border-white/[0.08]">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/insights')}
                    className="w-full text-center text-white/50 text-xs hover:text-[#E10600] transition-colors flex items-center justify-center gap-1 py-1"
                >
                    View All Insights
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </motion.button>
            </div>
        </div>
    );
};

export default InsightsWidget;
