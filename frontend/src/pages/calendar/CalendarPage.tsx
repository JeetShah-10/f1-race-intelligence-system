
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useDashboardStore, selectCalendar } from '../../store/useDashboardStore';
import { GlassCard } from '../../components/ui/GlassCard';

export const CalendarPage = () => {
    const calendar = useDashboardStore(selectCalendar);

    return (
        <DashboardLayout hideSidebar={true} sidebarOpen={false} onToggleSidebar={() => { }}>

            {/* Header Area */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-4">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium w-fit"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Back to Dashboard
                    </Link>
                    <div>
                        <h1 className="text-3xl font-racing text-white flex items-center gap-3">
                            <span className="w-1.5 h-8 rounded-full bg-[#E10600]" />
                            2026 SEASON CALENDAR
                        </h1>
                        <p className="text-white/40 text-sm mt-1 font-mono pl-4">24 RACES · MARCH - DECEMBER</p>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {calendar.map((race, index) => (
                    <motion.div
                        key={race.round}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                    >
                        <GlassCard className="h-full relative overflow-hidden group hover:border-[#E10600]/30 transition-colors">
                            {/* Round Number Background */}
                            <div className="absolute -right-4 -top-4 text-[120px] font-racing text-white/[0.02] group-hover:text-[#E10600]/[0.05] transition-colors pointer-events-none select-none">
                                {race.round}
                            </div>

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="px-3 py-1 rounded bg-white/5 border border-white/10 text-white/60 text-xs font-mono">
                                        ROUND {race.round}
                                    </div>
                                    <div className="text-2xl">{race.flag}</div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-1 line-clamp-1" title={race.name}>{race.name}</h3>
                                <div className="text-[#E10600] text-sm font-medium uppercase tracking-wider mb-4">{race.circuit}</div>

                                <div className="mt-auto space-y-2 border-t border-white/5 pt-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-white/40">Location</span>
                                        <span className="text-white/80">{race.country}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-white/40">Date</span>
                                        <span className="text-white font-mono">{race.date}</span>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>
        </DashboardLayout>
    );
};

export default CalendarPage;
