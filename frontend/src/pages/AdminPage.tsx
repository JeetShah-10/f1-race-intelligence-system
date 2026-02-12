import { Link, useLocation } from 'react-router-dom';
import { useDashboardStore, selectMeta } from '../store';

export function AdminPage() {
    const location = useLocation();
    const meta = useDashboardStore(selectMeta);
    const currentTab = location.pathname.split('/').pop();

    return (
        <div className="min-h-screen bg-[#0B0D10] text-white">
            <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#CF2C28]/20 border-b border-[#CF2C28]/50">
                <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#CF2C28] flex items-center justify-center">
                                <span className="text-white font-bold text-xs">A</span>
                            </div>
                            <span className="font-bold text-lg" style={{ fontFamily: 'NeoSpeed, sans-serif' }}>APEX</span>
                        </Link>
                        <span className="px-2 py-1 bg-[#CF2C28] text-xs font-bold uppercase">Admin</span>
                    </div>
                    <div className="text-sm text-white/70">
                        Model: {meta.modelVersion} · Status: {meta.status}
                    </div>
                </div>
            </header>

            <div className="pt-16 flex min-h-screen">
                <aside className="w-56 bg-black/40 border-r border-white/10">
                    <nav className="p-4 space-y-1">
                        <Link
                            to="/admin/data"
                            className={`block px-4 py-2 rounded text-sm ${currentTab === 'data' ? 'bg-[#CF2C28] text-white' : 'text-white/70 hover:bg-white/5'
                                }`}
                        >
                            Data Browser
                        </Link>
                        <Link
                            to="/admin/system"
                            className={`block px-4 py-2 rounded text-sm ${currentTab === 'system' ? 'bg-[#CF2C28] text-white' : 'text-white/70 hover:bg-white/5'
                                }`}
                        >
                            System Status
                        </Link>
                    </nav>
                </aside>

                <main className="flex-1 p-8">
                    {currentTab === 'data' && (
                        <div>
                            <h1 className="text-2xl font-bold mb-6">Data Browser</h1>
                            <div className="glass-card p-6 space-y-4">
                                <div className="flex items-center justify-between py-3 border-b border-white/10">
                                    <span>FastF1 Session Ingestion</span>
                                    <span className="text-[#00D2BE]">Ready</span>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-white/10">
                                    <span>Historical Data Range</span>
                                    <span className="font-mono">{meta.trainingRange}</span>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-white/10">
                                    <span>Last Ingest</span>
                                    <span className="font-mono">{meta.lastIngest}</span>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <span>Dataset Validation</span>
                                    <span className="text-[#00D2BE]">Passed</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentTab === 'system' && (
                        <div>
                            <h1 className="text-2xl font-bold mb-6">System Status</h1>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="glass-card p-6">
                                    <div className="text-white/40 text-sm mb-2">Model Status</div>
                                    <div className="text-2xl font-bold text-[#00D2BE]">{meta.status}</div>
                                </div>
                                <div className="glass-card p-6">
                                    <div className="text-white/40 text-sm mb-2">Uptime</div>
                                    <div className="text-2xl font-mono">{meta.uptime}</div>
                                </div>
                                <div className="glass-card p-6">
                                    <div className="text-white/40 text-sm mb-2">Model Version</div>
                                    <div className="text-2xl font-mono">{meta.modelVersion}</div>
                                </div>
                                <div className="glass-card p-6">
                                    <div className="text-white/40 text-sm mb-2">Data Source</div>
                                    <div className="text-2xl">{meta.dataSource}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!['data', 'system'].includes(currentTab || '') && (
                        <div className="text-center py-20">
                            <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
                            <p className="text-white/50">Select a section from the sidebar</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
