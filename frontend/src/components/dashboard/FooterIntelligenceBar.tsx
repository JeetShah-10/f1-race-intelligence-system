import { useDashboardStore, selectMeta } from '../../store';

export function FooterIntelligenceBar() {
    const meta = useDashboardStore(selectMeta);

    const formatDate = (isoDate: string) => {
        return new Date(isoDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <footer className="bg-[#0D0F12] border-t border-white/5 py-3">
            <div className="max-w-[1600px] mx-auto px-6 flex flex-wrap items-center justify-between gap-4 text-[10px] text-white/30">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${meta.status === 'Operational' ? 'bg-[#00D2BE]' :
                                meta.status === 'Degraded' ? 'bg-[#FF8700]' : 'bg-[#CF2C28]'
                            }`} />
                        <span>{meta.status}</span>
                    </div>
                    <span className="hidden sm:inline">
                        Model: <span className="text-white/50">{meta.modelVersion}</span>
                    </span>
                    <span className="hidden md:inline">
                        Training: <span className="text-white/50">{meta.trainingRange}</span>
                    </span>
                </div>
                <div className="flex items-center gap-6">
                    <span className="hidden lg:inline">
                        Uptime: <span className="text-white/50">{meta.uptime}</span>
                    </span>
                    <span>
                        Last Update: <span className="text-white/50">{formatDate(meta.lastIngest)}</span>
                    </span>
                </div>
            </div>
        </footer>
    );
}
