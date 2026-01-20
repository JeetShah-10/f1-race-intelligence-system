export function Footer() {
    return (
        <footer className="border-t border-white/5 pt-16 pb-8" style={{ backgroundColor: '#0B0D10' }}>
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="md:col-span-1 space-y-4">
                        <div>
                            <span className="font-bold text-xl text-white tracking-tight">APEX</span>
                            <span className="font-light text-xl text-white/40 tracking-tight ml-1">INTEL</span>
                        </div>
                        <p className="text-white/30 text-sm leading-relaxed">
                            Professional motorsport intelligence platform for teams, analysts, and strategists.
                        </p>
                        <div className="flex gap-1 pt-2">
                            <div className="w-6 h-0.5 bg-[#E10600]" />
                            <div className="w-4 h-0.5 bg-[#E10600]/60" />
                            <div className="w-2 h-0.5 bg-[#E10600]/30" />
                        </div>
                    </div>

                    <div>
                        <h6 className="font-bold text-white/60 mb-4 uppercase tracking-[0.2em] text-[10px]">Platform</h6>
                        <ul className="space-y-3 text-white/40 text-sm">
                            <li className="hover:text-white transition-colors cursor-pointer">Live Simulation</li>
                            <li className="hover:text-white transition-colors cursor-pointer">Strategy Engine</li>
                            <li className="hover:text-white transition-colors cursor-pointer">Telemetry Suite</li>
                            <li className="hover:text-white transition-colors cursor-pointer">API Documentation</li>
                        </ul>
                    </div>

                    <div>
                        <h6 className="font-bold text-white/60 mb-4 uppercase tracking-[0.2em] text-[10px]">Company</h6>
                        <ul className="space-y-3 text-white/40 text-sm">
                            <li className="hover:text-white transition-colors cursor-pointer">About</li>
                            <li className="hover:text-white transition-colors cursor-pointer">Careers</li>
                            <li className="hover:text-white transition-colors cursor-pointer">Press</li>
                            <li className="hover:text-white transition-colors cursor-pointer">Contact</li>
                        </ul>
                    </div>

                    <div>
                        <h6 className="font-bold text-white/60 mb-4 uppercase tracking-[0.2em] text-[10px]">Legal</h6>
                        <ul className="space-y-3 text-white/40 text-sm">
                            <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
                            <li className="hover:text-white transition-colors cursor-pointer">Terms of Service</li>
                            <li className="hover:text-white transition-colors cursor-pointer">Cookie Settings</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-white/20">
                    <span>© 2026 APEX Intelligence. All rights reserved.</span>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Systems Operational
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
