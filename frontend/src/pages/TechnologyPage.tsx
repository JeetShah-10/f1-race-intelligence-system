import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Network, Cpu, Database } from 'lucide-react';

export const TechnologyPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-f1-dark text-white overflow-x-hidden selection:bg-neon-cyan selection:text-black">
            <Header />

            <main className="relative pt-32 pb-20">
                {/* Dark Poly Background (User Provided) */}
                <div
                    className="fixed inset-0 pointer-events-none opacity-30 bg-cover bg-center z-0"
                    style={{ backgroundImage: "url('/assets/backgrounds/bg-image-2.png')" }}
                />

                <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center mb-20"
                    >
                        <span className="px-4 py-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan text-sm tracking-widest uppercase mb-6 inline-block">
                            System Architecture
                        </span>
                        <h1 className="text-5xl md:text-8xl font-stats font-bold text-white mb-6">
                            NEURAL <span className="text-outline">CORE</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Our proprietary tech stack combines real-time stream processing with deep reinforcement learning models.
                        </p>
                    </motion.div>

                    {/* Tech Tree / Node Visualization */}
                    <div className="relative">
                        {/* Connecting Lines (CSS or SVG) */}
                        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent hidden lg:block" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                            {/* Node 1: Ingestion */}
                            <TechNode
                                icon={Database}
                                title="Data Ingestion"
                                desc="Processing 5GB/s from trackside sensors."
                                color="text-neon-cyan"
                                delay={0}
                            />
                            {/* Node 2: Processing */}
                            <TechNode
                                icon={Cpu}
                                title="Neural Engine"
                                desc="Transformer models predicting strategy deltas."
                                color="text-neon-purple"
                                delay={0.2}
                            />
                            {/* Node 3: Output */}
                            <TechNode
                                icon={Network}
                                title="Edge Delivery"
                                desc="Sub-20ms latency to pit wall dashboards."
                                color="text-f1-red"
                                delay={0.4}
                            />
                        </div>
                    </div>

                    {/* Detailed Specs Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-32">
                        <div className="space-y-8">
                            <h2 className="text-4xl font-racing text-white">Full Specifications</h2>
                            <div className="space-y-4">
                                <SpecRow label="Inference Time" value="12ms" />
                                <SpecRow label="Model Parameters" value="70B" />
                                <SpecRow label="Training Data" value="2005-2025" />
                                <SpecRow label="Precision" value="FP16" />
                            </div>
                        </div>
                        <div className="bg-glass rounded-2xl p-8 border border-white/10 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('/assets/textures/carbon-forged.png')] opacity-20 mix-blend-overlay" />
                            <pre className="font-mono text-xs text-neon-cyan/80 overflow-hidden">
                                {`
class RaceStrategy(nn.Module):
    def __init__(self):
        super().__init__()
        self.encoder = TransformerEncoder(...)
        self.tire_model = ThermalDegradation(...)
        
    def forward(self, telemetry):
        # Real-time state estimation
        x = self.encoder(telemetry)
        degradation = self.tire_model(x)
        return self.policy_head(x, degradation)
                                 `}
                            </pre>
                            <div className="absolute bottom-4 right-4 text-xs text-white/30">v2.5.0-alpha</div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

interface TechNodeProps {
    icon: React.ElementType;
    title: string;
    desc: string;
    color: string;
    delay: number;
}

const TechNode: React.FC<TechNodeProps> = ({ icon: Icon, title, desc, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.5 }}
        className="relative p-8 rounded-2xl bg-f1-dark border border-white/10 hover:border-white/20 transition-all z-10 group"
    >
        <div className={`w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${color}`}>
            <Icon className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-stats font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{desc}</p>

        {/* Glow Effect */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-current ${color} rounded-2xl`} />
    </motion.div>
);

interface SpecRowProps {
    label: string;
    value: string;
}

const SpecRow: React.FC<SpecRowProps> = ({ label, value }) => (
    <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <span className="text-gray-400 font-mono text-sm uppercase tracking-wider">{label}</span>
        <span className="text-white font-stats font-bold text-xl">{value}</span>
    </div>
);
