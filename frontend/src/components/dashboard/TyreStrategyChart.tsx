import { useDashboardStore, selectInsights } from '../../store';
import { useEffect, useState } from 'react';

const DEGRADATION_LEVELS: Record<string, number> = {
    'High': 85,
    'Medium': 55,
    'Low': 25,
};

export function TyreStrategyChart() {
    const insights = useDashboardStore(selectInsights);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const compounds = [
        { name: 'Soft', level: insights.tyreDegradation.soft, color: 'tyre-bar-soft' },
        { name: 'Medium', level: insights.tyreDegradation.medium, color: 'tyre-bar-medium' },
        { name: 'Hard', level: insights.tyreDegradation.hard, color: 'tyre-bar-hard' },
    ];

    return (
        <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-4">
                <span className="text-white/40 text-[10px] uppercase tracking-wider">Tyre Degradation</span>
                <span className="text-[10px] text-white/20 font-mono">{insights.pitLoss}s pit loss</span>
            </div>

            <div className="space-y-4">
                {compounds.map((compound) => {
                    const width = mounted ? DEGRADATION_LEVELS[compound.level] || 50 : 0;

                    return (
                        <div key={compound.name} className="gpu-accelerated">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`w-3 h-3 rounded-full ${compound.name === 'Soft' ? 'bg-[#FF3333]' :
                                                compound.name === 'Medium' ? 'bg-[#FFD700]' : 'bg-white'
                                            }`}
                                    />
                                    <span className="text-white text-xs font-medium">{compound.name}</span>
                                </div>
                                <span className={`text-xs font-mono ${compound.level === 'High' ? 'text-[#CF2C28]' :
                                        compound.level === 'Medium' ? 'text-[#FF8700]' : 'text-[#00D2BE]'
                                    }`}>
                                    {compound.level}
                                </span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className={`tyre-bar ${compound.color} progress-fill`}
                                    style={{ width: `${width}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                    <span className="text-white/40 text-[10px] uppercase">Strategy</span>
                    <span className="text-[#00D2BE] text-xs font-medium">{insights.strategyRecommendation}</span>
                </div>
            </div>
        </div>
    );
}
