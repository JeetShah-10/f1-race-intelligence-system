import { motion } from 'framer-motion';
import { useDashboardStore, selectMeta, selectNextRace } from '../../store';

export function IntelligenceStrip() {
    const meta = useDashboardStore(selectMeta);
    const nextRace = useDashboardStore(selectNextRace);

    const formatLastIngest = (isoDate: string) => {
        const date = new Date(isoDate);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 60) return `${diffMins} min ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hrs ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="bg-[#0D0F12] border-b border-white/5">
            <div className="max-w-[1600px] mx-auto px-6 py-2 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-6 text-white/40">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${meta.status === 'Operational' ? 'bg-[#00D2BE]' :
                                meta.status === 'Degraded' ? 'bg-[#FF8700]' : 'bg-[#CF2C28]'
                            }`} />
                        <span>{meta.status}</span>
                    </div>
                    <span className="hidden sm:inline">
                        Source: <span className="text-white/60">{meta.dataSource}</span>
                    </span>
                    <span className="hidden md:inline">
                        Last Ingest: <span className="text-white/60">{formatLastIngest(meta.lastIngest)}</span>
                    </span>
                    <span className="hidden lg:inline">
                        Training: <span className="text-white/60">{meta.trainingRange}</span>
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-white/40">Model Confidence</span>
                    <div className="flex items-center gap-1">
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-[#00D2BE]"
                                initial={{ width: 0 }}
                                animate={{ width: `${nextRace.modelConfidence * 100}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                        </div>
                        <span className="text-[#00D2BE] font-mono font-bold">
                            {(nextRace.modelConfidence * 100).toFixed(1)}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
