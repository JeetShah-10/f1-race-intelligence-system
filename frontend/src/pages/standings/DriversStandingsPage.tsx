
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useDashboardStore } from '../../store/useDashboardStore';
import { GlassCard } from '../../components/ui/GlassCard';

export const DriversStandingsPage = () => {
    const standings = useDashboardStore(state => state.standings);

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
                            DRIVER STANDINGS
                        </h1>
                        <p className="text-white/40 text-sm mt-1 font-mono pl-4">2026 FORMULA 1 WORLD CHAMPIONSHIP</p>
                    </div>
                </div>
            </div>

            {/* Standings Table */}
            <GlassCard className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/[0.02]">
                                <th className="p-4 text-white/40 text-xs font-mono uppercase tracking-wider w-16 text-center">Pos</th>
                                <th className="p-4 text-white/40 text-xs font-mono uppercase tracking-wider">Driver</th>
                                <th className="p-4 text-white/40 text-xs font-mono uppercase tracking-wider">Team</th>
                                <th className="p-4 text-white/40 text-xs font-mono uppercase tracking-wider text-right">Points</th>
                                <th className="p-4 text-white/40 text-xs font-mono uppercase tracking-wider text-right hidden md:table-cell">Wins</th>
                                <th className="p-4 text-white/40 text-xs font-mono uppercase tracking-wider text-right hidden md:table-cell">Podiums</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.05]">
                            {standings.map((driver, index) => (
                                <motion.tr
                                    key={driver.code}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="group hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="p-4">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm mx-auto
                                            ${index === 0 ? 'bg-[#E10600] text-white' :
                                                index === 1 ? 'bg-white/20 text-white' :
                                                    index === 2 ? 'bg-white/10 text-white' : 'text-white/40'}`}>
                                            {driver.position}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            {driver.image && (
                                                <div className="w-10 h-10 rounded-full overflow-hidden bg-white/5 border border-white/10 hidden sm:block">
                                                    <img src={driver.image} alt={driver.name} className="w-full h-full object-cover object-top" />
                                                </div>
                                            )}
                                            <div>
                                                <div className="text-white font-medium flex items-center gap-2">
                                                    {driver.name.split(' ')[0]} <span className="uppercase font-bold">{driver.name.split(' ').slice(1).join(' ')}</span>
                                                </div>
                                                <div className="text-white/40 text-xs font-mono sm:hidden">{driver.team}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-white/80 text-sm hidden sm:block">{driver.team}</span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="font-mono font-bold text-[#E10600] text-lg">{driver.points}</div>
                                    </td>
                                    <td className="p-4 text-right hidden md:table-cell">
                                        <span className="text-white/60 font-mono">-</span>
                                    </td>
                                    <td className="p-4 text-right hidden md:table-cell">
                                        <span className="text-white/60 font-mono">-</span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </DashboardLayout>
    );
};

export default DriversStandingsPage;
