import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { authService } from '../services/auth';

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

export function ResetPasswordPage() {
    const navigate = useNavigate();
    const { initializeAuth } = useAppStore();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    useEffect(() => {
        // Initialize auth to capture the session from the URL hash
        initializeAuth();
    }, [initializeAuth]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await authService.updateUser({ password });
            if (error) throw error;
            setSuccessMessage("Password updated successfully! Redirecting...");
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update password. Your session may have expired.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
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
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
            </div>

            <SpeedLines />

            {/* Ambient Glow */}
            <motion.div
                className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-f1-red/20 rounded-full blur-[200px] pointer-events-none"
                animate={{ opacity: [0.15, 0.25, 0.15], scale: [1, 1.1, 1] }}
                transition={{ duration: 6, repeat: Infinity }}
            />

            <div className="relative z-10 w-full h-full flex items-center justify-center px-6">
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: PREMIUM_EASING }}
                        className="relative p-8 bg-black/40 backdrop-blur-xl border border-white/[0.08] rounded-2xl"
                    >
                        <div className="mb-8 text-center">
                            <Link to="/" className="inline-block mb-6">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <div className="w-10 h-1 bg-f1-red rounded-full" />
                                    <div className="w-5 h-1 bg-f1-red/50 rounded-full" />
                                </div>
                                <span className="font-black text-2xl text-white tracking-tight">APEX</span>
                                <span className="font-extralight text-xl text-white/40 ml-2">Intelligence</span>
                            </Link>
                            <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
                            <p className="text-white/40 text-sm">Create a new secure password for your account</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
                                    >
                                        {error}
                                    </motion.div>
                                )}
                                {successMessage && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm"
                                    >
                                        {successMessage}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Password */}
                            <div>
                                <label className="block text-xs text-white/40 mb-1.5 font-medium uppercase tracking-wider">New Password</label>
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
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors p-1"
                                    >
                                        {showPassword ? (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-xs text-white/40 mb-1.5 font-medium uppercase tracking-wider">Confirm Password</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onFocus={() => setFocusedField('confirmPassword')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="••••••••"
                                    className={`w-full px-4 py-3 bg-white/[0.03] border rounded-xl text-white placeholder-white/20 focus:outline-none transition-all text-sm ${focusedField === 'confirmPassword'
                                        ? 'border-f1-red/50 shadow-[0_0_20px_rgba(207,44,40,0.15)]'
                                        : 'border-white/[0.08] hover:border-white/15'
                                        }`}
                                    required
                                    minLength={6}
                                />
                            </div>

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
                                        Updating...
                                    </>
                                ) : (
                                    'Update Password'
                                )}
                            </motion.button>
                        </form>

                        <p className="mt-5 text-center text-white/40 text-sm">
                            <Link to="/login" className="text-white hover:text-white/80 transition-colors">Back to Login</Link>
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-4 right-4 w-16 h-16 border-t border-r border-white/10 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-16 h-16 border-b border-l border-white/10 pointer-events-none" />
        </div>
    );
}
