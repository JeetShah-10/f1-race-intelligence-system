import { NavLink, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';

interface ModeTab {
    id: string;
    path: string;
    label: string;
    premium?: boolean;
}

const MODES: ModeTab[] = [
    { id: 'view', path: '/dashboard/view', label: 'View' },
    { id: 'simulate', path: '/dashboard/simulate', label: 'Simulate' },
    { id: 'compare', path: '/dashboard/compare', label: 'Compare', premium: true },
];

export function ModeTabs() {
    const { mode: urlMode } = useParams<{ mode?: string }>();
    const currentMode = urlMode || 'view';
    const { user } = useAppStore();
    const isPremium = user.tier === 'premium';

    return (
        <div className="flex items-center gap-0.5 bg-white/5 p-1">
            {MODES.map((mode) => {
                const isActive = currentMode === mode.id;
                const isLocked = mode.premium && !isPremium;

                if (isLocked) {
                    return (
                        <motion.button
                            key={mode.id}
                            whileHover={{ scale: 1.02 }}
                            className="px-3 md:px-5 py-2 text-xs md:text-sm font-medium uppercase tracking-wider text-white/30 cursor-not-allowed"
                            disabled
                        >
                            {mode.label}
                        </motion.button>
                    );
                }

                return (
                    <NavLink key={mode.id} to={mode.path}>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`px-3 md:px-5 py-2 text-xs md:text-sm font-medium uppercase tracking-wider transition-all ${isActive
                                    ? 'bg-[#CF2C28] text-white'
                                    : 'text-white/50 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {mode.label}
                        </motion.div>
                    </NavLink>
                );
            })}
        </div>
    );
}
