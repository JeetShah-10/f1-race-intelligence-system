import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';

const PREMIUM_EASING = [0.17, 0.84, 0.44, 1] as const;

export function SignupPage() {
    const navigate = useNavigate();
    const login = useAppStore((state) => state.login);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        login(email, name);
        setIsLoading(false);
        navigate('/dashboard');
    };

    return (
        <div className="h-screen w-full flex bg-[#0B0D10] overflow-hidden">
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: PREMIUM_EASING }}
                className="w-full lg:w-[40%] flex flex-col justify-center px-12 lg:px-16"
            >
                <Link to="/" className="mb-8">
                    <div className="flex gap-1 mb-3">
                        <div className="w-8 h-1 bg-[#CF2C28]" />
                        <div className="w-5 h-1 bg-[#CF2C28]/60" />
                        <div className="w-3 h-1 bg-[#CF2C28]/30" />
                    </div>
                    <span className="font-bold text-xl text-white">APEX</span>
                    <span className="font-light text-lg text-white/40 ml-2">Intelligence</span>
                </Link>

                <h1 className="text-3xl font-bold text-white mb-1">Create account</h1>
                <p className="text-white/50 mb-8">Join the grid and start predicting</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-white/60 mb-2">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#CF2C28] focus:outline-none transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-white/60 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#CF2C28] focus:outline-none transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-white/60 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min 8 characters"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#CF2C28] focus:outline-none transition-colors"
                            required
                            minLength={8}
                        />
                    </div>

                    <p className="text-white/30 text-xs">
                        By signing up, you agree to our{' '}
                        <a href="#" className="text-[#CF2C28]">Terms</a> and{' '}
                        <a href="#" className="text-[#CF2C28]">Privacy Policy</a>
                    </p>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 bg-[#CF2C28] text-white font-semibold hover:brightness-110 transition-all disabled:opacity-50"
                    >
                        {isLoading ? 'Creating account...' : 'Sign up'}
                    </button>
                </form>

                <div className="mt-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-white/30 text-xs">or continue with</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>
                    <div className="flex gap-3">
                        <button className="flex-1 py-2.5 bg-white/5 border border-white/10 text-white hover:bg-white/10 transition flex items-center justify-center gap-2 text-sm">
                            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                            Google
                        </button>
                        <button className="flex-1 py-2.5 bg-white/5 border border-white/10 text-white hover:bg-white/10 transition flex items-center justify-center gap-2 text-sm">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                            GitHub
                        </button>
                    </div>
                </div>

                <p className="mt-5 text-center text-white/50 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#CF2C28] hover:underline font-medium">Sign in</Link>
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden lg:block w-[60%] relative overflow-hidden"
            >
                <div className="absolute inset-0">
                    <motion.img
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        src="/assets/circuits/monaco-circuit.png"
                        alt="Monaco Grand Prix Circuit"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D10] via-[#0B0D10]/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] via-transparent to-[#0B0D10]/40" />
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30">
                    <img
                        src="/assets/circuits/monaco-map.png"
                        alt="Monaco Map"
                        className="w-64 h-auto invert"
                    />
                </div>

                <div className="absolute bottom-8 left-8 right-8 grid grid-cols-3 gap-4">
                    {[
                        { value: '22', label: 'Circuits' },
                        { value: '10', label: 'Teams' },
                        { value: '99.2%', label: 'Accuracy' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + i * 0.1 }}
                            className="p-4 bg-black/60 backdrop-blur-xl border border-white/10 text-center"
                        >
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <div className="text-white/40 text-xs uppercase">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-[#CF2C28]/40" />
            </motion.div>
        </div>
    );
}
