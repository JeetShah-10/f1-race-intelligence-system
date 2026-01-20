import { motion } from 'framer-motion';
import { useDashboardStore, selectScenarios } from '../../store';
import { useAppStore } from '../../store';

// SVG Icon Components
const IconChaos = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 9v4m0 4h.01M5.07 19H19a2 2 0 001.75-2.97L13.76 4a2 2 0 00-3.52 0L3.32 16.03A2 2 0 005.07 19z" />
    </svg>
);

const IconTyre = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <line x1="12" y1="3" x2="12" y2="8" />
        <line x1="12" y1="16" x2="12" y2="21" />
        <line x1="3" y1="12" x2="8" y2="12" />
        <line x1="16" y1="12" x2="21" y2="12" />
    </svg>
);

const IconRain = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25" />
        <line x1="8" y1="16" x2="8.01" y2="21" />
        <line x1="12" y1="18" x2="12.01" y2="23" />
        <line x1="16" y1="16" x2="16.01" y2="21" />
    </svg>
);

const IconStrategy = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <line x1="6.5" y1="6.5" x2="6.5" y2="6.51" />
        <line x1="17.5" y1="6.5" x2="17.5" y2="6.51" />
        <line x1="6.5" y1="17.5" x2="6.5" y2="17.51" />
        <line x1="17.5" y1="17.5" x2="17.5" y2="17.51" />
    </svg>
);

const IconLock = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
);

const SCENARIO_ICONS: Record<string, React.FC> = {
    'chaos': IconChaos,
    'high-deg': IconTyre,
    'rain': IconRain,
    'strategy-opt': IconStrategy,
    'multi-compare': IconLock,
};

const SCENARIO_COLORS: Record<string, string> = {
    'chaos': '#CF2C28',
    'high-deg': '#FF8700',
    'rain': '#0090FF',
    'strategy-opt': '#00D2BE',
    'multi-compare': '#9FA4A8',
};

export function ScenarioShortcuts() {
    const scenarios = useDashboardStore(selectScenarios);
    const { user } = useAppStore();
    const isPremium = user.tier === 'premium';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-5"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-[#CF2C28]" />
                <span className="text-xs text-white/40 uppercase tracking-widest">Scenarios</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
                {scenarios.map((scenario, i) => {
                    const isLocked = scenario.premium && !isPremium;
                    const IconComponent = SCENARIO_ICONS[scenario.id] || IconStrategy;
                    const iconColor = SCENARIO_COLORS[scenario.id] || '#9FA4A8';

                    return (
                        <motion.div
                            key={scenario.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.45 + i * 0.05 }}
                            whileHover={{ scale: isLocked ? 1 : 1.02 }}
                            className={`p-4 border border-white/10 cursor-pointer transition-all ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5'
                                }`}
                        >
                            <div className="mb-2" style={{ color: iconColor }}>
                                <IconComponent />
                            </div>
                            <div
                                className="text-white font-bold text-sm uppercase"
                                style={{ fontFamily: 'Raceburst, Rajdhani, sans-serif' }}
                            >
                                {scenario.name}
                            </div>
                            <div className="text-white/40 text-[10px] mt-1">{scenario.description}</div>

                            {isLocked && (
                                <div className="mt-2 text-[10px] text-[#FF8700] uppercase tracking-wider flex items-center gap-1">
                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0110 0v4" />
                                    </svg>
                                    Premium
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
