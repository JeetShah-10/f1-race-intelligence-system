
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { GlassCard } from '../../components/ui/GlassCard';

export const ConstructorsStandingsPage = () => {

    const constructors = [
        { position: 1, name: 'Ferrari', points: 0, color: '#FF0000', logo: '/assets/logos/ferrari-logo-small.webp', drivers: ['Hamilton', 'Leclerc'] },
        { position: 2, name: 'Red Bull Racing', points: 0, color: '#1E41FF', logo: '/assets/logos/redbull-logo-small.png', drivers: ['Verstappen', 'Hadjar'] },
        { position: 3, name: 'McLaren', points: 0, color: '#FF8000', logo: '/assets/logos/mclaren-logo-small.webp', drivers: ['Norris', 'Piastri'] },
        { position: 4, name: 'Mercedes', points: 0, color: '#00A19B', logo: '/assets/logos/mercedes-logo-small.webp', drivers: ['Russell', 'Antonelli'] },
        { position: 5, name: 'Aston Martin', points: 0, color: '#006F62', logo: '/assets/logos/aston-martin-small.webp', drivers: ['Alonso', 'Stroll'] },
        { position: 6, name: 'Alpine', points: 0, color: '#0090FF', logo: '/assets/logos/alpine-logo-small.webp', drivers: ['Gasly', 'Colapinto'] },
        { position: 7, name: 'Williams', points: 0, color: '#005AFF', logo: '/assets/logos/williams-logo-2.webp', drivers: ['Sainz', 'Albon'] },
        { position: 8, name: 'Racing Bulls', points: 0, color: '#1B3D8E', logo: '/assets/logos/racingbulls-logo-small.webp', drivers: ['Lawson', 'Lindblad'] },
        { position: 9, name: 'Haas', points: 0, color: '#B6BABD', logo: '/assets/logos/haas-logo-small.webp', drivers: ['Ocon', 'Bearman'] },
        { position: 10, name: 'Audi', points: 0, color: '#FF0000', logo: '/assets/logos/audi-logo.webp', drivers: ['Hulkenberg', 'Bortoleto'] },
        { position: 11, name: 'Cadillac', points: 0, color: '#FFB300', logo: '/assets/logos/cadillac-logo-small.webp', drivers: ['Perez', 'Bottas'] },
    ];

    return (
        <DashboardLayout hideSidebar={true} sidebarOpen={false} onToggleSidebar={() => { }}>

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
                            CONSTRUCTOR STANDINGS
                        </h1>
                        <p className="text-white/40 text-sm mt-1 font-mono pl-4">2026 FORMULA 1 WORLD CHAMPIONSHIP</p>
                    </div>
                </div>
            </div>

            <GlassCard className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/[0.02]">
                                <th className="p-4 text-white/40 text-xs font-mono uppercase tracking-wider w-16 text-center">Pos</th>
                                <th className="p-4 text-white/40 text-xs font-mono uppercase tracking-wider">Team</th>
                                <th className="p-4 text-white/40 text-xs font-mono uppercase tracking-wider hidden md:table-cell">Drivers</th>
                                <th className="p-4 text-white/40 text-xs font-mono uppercase tracking-wider text-right">Points</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.05]">
                            {constructors.map((team, index) => (
                                <motion.tr
                                    key={team.name}
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
                                            {team.position}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-white/5 p-2 border border-white/10 flex items-center justify-center">
                                                <img src={team.logo} alt={team.name} className="w-full h-full object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                                            </div>
                                            <div>
                                                <div className="text-white font-bold text-lg tracking-wide">{team.name}</div>
                                                <div className="h-0.5 w-12 mt-1 rounded-full" style={{ backgroundColor: team.color }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 hidden md:table-cell">
                                        <div className="flex items-center gap-2">
                                            {team.drivers.map(driver => (
                                                <span key={driver} className="px-2 py-1 rounded bg-white/5 text-white/70 text-xs font-medium border border-white/10">
                                                    {driver}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="font-mono font-bold text-[#E10600] text-lg">{team.points}</div>
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

export default ConstructorsStandingsPage;
