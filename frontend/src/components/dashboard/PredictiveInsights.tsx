import { motion } from 'framer-motion';
import { useDashboardStore, selectInsights, selectNextRace } from '../../store';

export function PredictiveInsights() {
    const insights = useDashboardStore(selectInsights);
    const nextRace = useDashboardStore(selectNextRace);

    const insightCards = [
        {
            label: 'Overcut Probability',
            value: `${(insights.overcutSuccessProbability * 100).toFixed(0)}%`,
            badge: insights.overcutSuccessProbability > 0.6 ? 'HIGH' : null
        },
        {
            label: 'Undercut Strength',
            value: insights.undercutStrength,
            badge: insights.undercutStrength === 'Weak' ? 'LOW' : null
        },
        {
            label: 'Safety Car',
            value: `${(insights.safetyCarProbability * 100).toFixed(0)}%`,
            badge: insights.safetyCarProbability > 0.3 ? 'WATCH' : null
        },
        {
            label: 'Pit Loss',
            value: `${insights.pitLoss}s`,
            badge: null
        },
        {
            label: 'Track Evolution',
            value: insights.trackEvolution,
            badge: insights.trackEvolution === 'High' ? 'ACTIVE' : null
        },
        {
            label: 'Strategy',
            value: insights.strategyRecommendation,
            badge: 'REC'
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-7"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-[#CF2C28]" />
                <span className="text-xs text-white/40 uppercase tracking-widest">Model Insights</span>
                <span className="ml-auto text-[10px] text-white/20 font-mono">{nextRace.circuit}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {insightCards.map((insight, i) => (
                    <motion.div
                        key={insight.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.35 + i * 0.05 }}
                        whileHover={{ y: -2 }}
                        className="p-4 bg-[#131518] border border-white/10 relative overflow-hidden"
                    >
                        {insight.badge && (
                            <span className={`absolute top-2 right-2 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${insight.badge === 'HIGH' || insight.badge === 'ACTIVE' ? 'bg-[#00D2BE]/20 text-[#00D2BE]' :
                                    insight.badge === 'WATCH' ? 'bg-[#FF8700]/20 text-[#FF8700]' :
                                        insight.badge === 'LOW' ? 'bg-[#CF2C28]/20 text-[#CF2C28]' :
                                            'bg-white/10 text-white/50'
                                }`}>
                                {insight.badge}
                            </span>
                        )}
                        <div className="text-white/40 text-[10px] uppercase tracking-wider">{insight.label}</div>
                        <div className="text-xl md:text-2xl font-mono font-medium text-white mt-1">
                            {insight.value}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Tyre Degradation Row */}
            <div className="mt-3 p-4 bg-[#131518] border border-white/10">
                <div className="text-white/40 text-[10px] uppercase tracking-wider mb-2">Tyre Degradation</div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#FF3333]" />
                        <span className="text-white text-xs">Soft: {insights.tyreDegradation.soft}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#FFD700]" />
                        <span className="text-white text-xs">Medium: {insights.tyreDegradation.medium}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#FFFFFF]" />
                        <span className="text-white text-xs">Hard: {insights.tyreDegradation.hard}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
