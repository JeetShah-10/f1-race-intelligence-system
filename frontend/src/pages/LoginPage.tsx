import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';

const PREMIUM_EASING = [0.17, 0.84, 0.44, 1] as const;

// Speed lines (more subtle, premium)
function SpeedLines() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
                    style={{
                        width: '200%',
                        left: '-50%',
                        top: `${20 + i * 15}%`,
                        transform: 'rotate(-3deg)',
                    }}
                    animate={{
                        x: ['-50%', '50%'],
                        opacity: [0, 0.6, 0]
                    }}
                    transition={{
                        duration: 6 + i * 0.8,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: 'linear'
                    }}
                />
            ))}
        </div>
    );
}

export function LoginPage() {
    const navigate = useNavigate();
    const login = useAppStore((state) => state.login);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        login(email, email.split('@')[0]);
        setIsLoading(false);
        navigate('/dashboard');
    };

    return (
        <div className="h-screen w-screen overflow-hidden bg-[#030405] relative flex">
            {/* Background Image - More Visible */}
            <div className="absolute inset-0">
                <img
                    src="/assets/cars/head-to-head.jpg"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Lighter overlays for more visibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
            </div>

            {/* Animated Effects */}
            <SpeedLines />

            {/* Ambient Glow */}
            <motion.div
                className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-f1-red/20 rounded-full blur-[200px] pointer-events-none"
                animate={{ opacity: [0.15, 0.25, 0.15], scale: [1, 1.1, 1] }}
                transition={{ duration: 6, repeat: Infinity }}
            />

            {/* Content Grid */}
            <div className="relative z-10 w-full h-full flex items-center justify-center px-6">
                <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left - Branding */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, ease: PREMIUM_EASING }}
                        className="hidden lg:block"
                    >
                        <Link to="/" className="inline-block mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-10 h-1 bg-f1-red rounded-full" />
                                <div className="w-5 h-1 bg-f1-red/50 rounded-full" />
                            </div>
                            <span className="font-black text-3xl text-white tracking-tight">APEX</span>
                            <span className="font-extralight text-2xl text-white/40 ml-2">Intelligence</span>
                        </Link>

                        <h1 className="text-5xl xl:text-6xl font-bold text-white leading-[1.05] mb-5">
                            Precision
                            <br />
                            <span className="bg-gradient-to-r from-f1-red to-orange-500 bg-clip-text text-transparent">
                                Strategy Intelligence
                            </span>
                        </h1>

                        <p className="text-lg text-white/50 max-w-md leading-relaxed mb-8">
                            AI-powered race predictions and strategic insights to gain the competitive edge.
                        </p>

                        <div className="space-y-3">
                            {[
                                { text: 'Real-time race simulations' },
                                { text: 'Advanced telemetry analysis' },
                                { text: 'Championship predictions' },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    className="flex items-center gap-3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                >
                                    <div className="w-2 h-2 bg-f1-red/80 rounded-full" />
                                    <span className="text-white/60">{item.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right - Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="flex justify-center lg:justify-end"
                    >
                        <div className="w-full max-w-md">
                            <div className="relative p-8 bg-black/40 backdrop-blur-xl border border-white/[0.08] rounded-2xl">
                                {/* Mobile Branding */}
                                <div className="lg:hidden mb-6 text-center">
                                    <div className="flex gap-1 justify-center mb-2">
                                        <div className="w-6 h-0.5 bg-f1-red" />
                                        <div className="w-4 h-0.5 bg-f1-red/50" />
                                    </div>
                                    <Link to="/">
                                        <span className="font-bold text-lg text-white">APEX</span>
                                        <span className="font-light text-white/40 ml-1.5">Intelligence</span>
                                    </Link>
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
                                <p className="text-white/40 mb-6 text-sm">Sign in to access your dashboard</p>

                                {/* OAuth */}
                                <div className="grid grid-cols-2 gap-3 mb-5">
                                    <motion.button
                                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
                                        whileTap={{ scale: 0.98 }}
                                        className="py-3 bg-white/[0.04] border border-white/[0.08] text-white rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                                            <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#4285F4" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Google
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
                                        whileTap={{ scale: 0.98 }}
                                        className="py-3 bg-white/[0.04] border border-white/[0.08] text-white rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                        GitHub
                                    </motion.button>
                                </div>

                                <div className="flex items-center gap-3 mb-5">
                                    <div className="flex-1 h-px bg-white/10" />
                                    <span className="text-white/25 text-xs uppercase tracking-wider">or</span>
                                    <div className="flex-1 h-px bg-white/10" />
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Email */}
                                    <div>
                                        <label className="block text-xs text-white/40 mb-1.5 font-medium uppercase tracking-wider">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="you@example.com"
                                            className={`w-full px-4 py-3 bg-white/[0.03] border rounded-xl text-white placeholder-white/20 focus:outline-none transition-all text-sm ${focusedField === 'email'
                                                ? 'border-f1-red/50 shadow-[0_0_20px_rgba(207,44,40,0.15)]'
                                                : 'border-white/[0.08] hover:border-white/15'
                                                }`}
                                            required
                                        />
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="block text-xs text-white/40 mb-1.5 font-medium uppercase tracking-wider">Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                onFocus={() => setFocusedField('password')}
                                                onBlur={() => setFocusedField(null)}
                                                placeholder="••••••••"
                                                className={`w-full px-4 py-3 pr-11 bg-white/[0.03] border rounded-xl text-white placeholder-white/20 focus:outline-none transition-all text-sm ${focusedField === 'password'
                                                    ? 'border-f1-red/50 shadow-[0_0_20px_rgba(207,44,40,0.15)]'
                                                    : 'border-white/[0.08] hover:border-white/15'
                                                    }`}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors p-1"
                                            >
                                                <AnimatePresence mode="wait">
                                                    {showPassword ? (
                                                        <motion.svg key="hide" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                        </motion.svg>
                                                    ) : (
                                                        <motion.svg key="show" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </motion.svg>
                                                    )}
                                                </AnimatePresence>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Remember & Forgot */}
                                    <div className="flex items-center justify-between text-sm">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${rememberMe ? 'bg-f1-red border-f1-red' : 'border-white/20 group-hover:border-white/40'
                                                }`}>
                                                {rememberMe && (
                                                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="sr-only" />
                                            <span className="text-white/40 group-hover:text-white/60">Remember me</span>
                                        </label>
                                        <a href="#" className="text-f1-red hover:text-f1-red/80 transition-colors font-medium">Forgot?</a>
                                    </div>

                                    {/* Submit */}
                                    <motion.button
                                        type="submit"
                                        disabled={isLoading}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        className="w-full py-3.5 mt-2 bg-f1-red text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-f1-red/20 hover:shadow-f1-red/30"
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Signing in...
                                            </>
                                        ) : (
                                            'Sign In'
                                        )}
                                    </motion.button>
                                </form>

                                <p className="mt-5 text-center text-white/40 text-sm">
                                    New here?{' '}
                                    <Link to="/signup" className="text-f1-red hover:text-f1-red/80 font-semibold transition-colors">Create account</Link>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-4 right-4 w-16 h-16 border-t border-r border-white/10 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-16 h-16 border-b border-l border-white/10 pointer-events-none" />
        </div>
    );
}
