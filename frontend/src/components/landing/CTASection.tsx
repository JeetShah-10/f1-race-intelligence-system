import { motion } from 'framer-motion';

export function CTASection() {
    return (
        <section className="relative w-full py-24 overflow-hidden" style={{ backgroundColor: '#0B0D10' }}>
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E10600]/5 blur-[200px] rounded-full" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="flex gap-1 mb-8 justify-center"
                    >
                        <div className="w-8 h-1 bg-[#E10600]" />
                        <div className="w-5 h-1 bg-[#E10600]/60" />
                        <div className="w-3 h-1 bg-[#E10600]/30" />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4"
                    >
                        JOIN THE <span className="text-[#E10600]">GRID</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 0.5 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-white/40 text-lg mb-12 max-w-lg mx-auto"
                    >
                        Get early access to the most advanced motorsport intelligence platform.
                        Limited beta available for professional teams and analysts.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
                    >
                        <button className="group relative px-8 py-4 bg-[#E10600] text-white font-bold uppercase tracking-wider text-sm overflow-hidden transition-all hover:bg-[#ff1a1a]">
                            <span className="relative z-10">Request Beta Access</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        </button>
                        <button className="px-8 py-4 border border-white/20 text-white/70 font-bold uppercase tracking-wider text-sm hover:bg-white/5 hover:border-white/30 hover:text-white transition-all">
                            View Demo
                        </button>
                        <button className="px-8 py-4 text-white/40 font-bold uppercase tracking-wider text-sm hover:text-white/70 transition-colors">
                            Documentation
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="grid grid-cols-3 gap-8 max-w-md mx-auto"
                    >
                        {[
                            { value: '10M+', label: 'Data Points/Race' },
                            { value: '<50ms', label: 'Latency' },
                            { value: '99.2%', label: 'Accuracy' },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-2xl font-mono font-bold text-white">{stat.value}</div>
                                <div className="text-[10px] text-white/30 uppercase tracking-wider mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 }}
                        className="mt-16 pt-8 border-t border-white/5"
                    >
                        <div className="text-[10px] text-white/20 uppercase tracking-[0.3em]">
                            Built for professional motorsport intelligence
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
