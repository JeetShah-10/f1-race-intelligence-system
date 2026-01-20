import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store';
import { ModeTabs } from './ModeTabs';

export function DashboardHeader() {
    const { user } = useAppStore();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B0D10]/95 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                    <motion.div className="flex gap-0.5" whileHover={{ scale: 1.05 }}>
                        <div className="w-5 h-1 bg-[#CF2C28]" />
                        <div className="w-3 h-1 bg-[#CF2C28]/60" />
                        <div className="w-2 h-1 bg-[#CF2C28]/30" />
                    </motion.div>
                    <span className="font-bold text-lg text-white tracking-tight" style={{ fontFamily: 'NeoSpeed, Rajdhani, sans-serif' }}>APEX</span>
                    <span className="text-white/30 text-sm hidden sm:inline">Intelligence</span>
                </Link>

                <ModeTabs />

                <div className="flex items-center gap-4">
                    <span className="text-white/40 text-xs hidden md:block font-mono">2026</span>
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-9 h-9 rounded-full bg-gradient-to-br from-[#CF2C28] to-[#8B1A1A] flex items-center justify-center cursor-pointer"
                    >
                        <span className="text-white text-sm font-bold">
                            {user.name ? user.name[0].toUpperCase() : 'U'}
                        </span>
                    </motion.div>
                </div>
            </div>
        </header>
    );
}
