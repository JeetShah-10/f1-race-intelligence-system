import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store';
import { Gauge } from 'lucide-react';

interface HeaderProps {
    transparent?: boolean;
}

const navLinks = [
    { label: 'Home', href: '/' },
    { label: '2026 Era', href: '/season-2026' },
    { label: 'Pricing', href: '/pricing' },
];

export const Header: React.FC<HeaderProps> = ({ transparent = true }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const isAuthenticated = useAppStore((state) => state.isAuthenticated);
    const user = useAppStore((state) => state.user);
    const logout = useAppStore((state) => state.logout);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleNavClick = (href: string) => {
        setIsMobileMenuOpen(false);
        navigate(href);
    };

    const isLandingPage = location.pathname === '/';
    const showTransparent = transparent && !isScrolled && isLandingPage;
    const isActive = (href: string) => {
        if (href === '/') return location.pathname === '/';
        return location.pathname.startsWith(href);
    };

    return (
        <>
            {/* Top Racing Stripe */}
            <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-gradient-to-r from-f1-red via-orange-500 to-f1-red" />

            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`
                    fixed top-[2px] left-0 right-0 z-50
                    transition-all duration-500 ease-out
                    ${showTransparent
                        ? 'bg-transparent'
                        : 'bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/[0.06]'
                    }
                `}
            >
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center h-16">

                        {/* Logo - Fixed width */}
                        <Link to="/" className="flex items-center gap-3 group w-28">
                            <div className="flex gap-[2px]">
                                <div className="w-1 h-5 bg-f1-red rounded-sm" />
                                <div className="w-1 h-5 bg-f1-red/60 rounded-sm" />
                                <div className="w-1 h-5 bg-f1-red/30 rounded-sm" />
                            </div>
                            <span className="font-racing text-lg text-white tracking-wider">
                                APEX
                            </span>
                        </Link>

                        {/* Desktop Navigation - Centered with absolute positioning */}
                        <nav className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
                            <div className="flex items-center gap-1">
                                {navLinks.map((link) => (
                                    <button
                                        key={link.label}
                                        onClick={() => handleNavClick(link.href)}
                                        className={`
                                            relative px-4 py-2 text-sm font-medium transition-colors rounded-lg
                                            ${isActive(link.href)
                                                ? 'text-white'
                                                : 'text-white/50 hover:text-white hover:bg-white/5'
                                            }
                                        `}
                                    >
                                        {link.label}
                                        {isActive(link.href) && (
                                            <motion.div
                                                layoutId="activeNav"
                                                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-f1-red rounded-full"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </nav>

                        {/* Spacer to push actions to the right */}
                        <div className="flex-1" />

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center gap-3">
                            {isAuthenticated ? (
                                <div className="flex items-center gap-3">
                                    <Link
                                        to="/dashboard"
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-white/60 hover:text-white transition-colors"
                                    >
                                        <Gauge className="w-4 h-4" />
                                        Dashboard
                                    </Link>
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-f1-red to-orange-500 flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">
                                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-white/40 hover:text-white text-sm transition-colors"
                                    >
                                        Exit
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="px-4 py-2 bg-f1-red hover:bg-f1-red/90 text-white text-sm font-medium rounded-lg transition-all hover:shadow-[0_0_20px_rgba(225,6,0,0.3)]"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
                            aria-label="Toggle menu"
                        >
                            <motion.span
                                animate={isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                                className="w-5 h-0.5 bg-white block origin-center"
                            />
                            <motion.span
                                animate={isMobileMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                                className="w-5 h-0.5 bg-white block"
                            />
                            <motion.span
                                animate={isMobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                                className="w-5 h-0.5 bg-white block origin-center"
                            />
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 md:hidden"
                    >
                        <div
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="absolute right-0 top-0 bottom-0 w-72 bg-[#0A0A0A] border-l border-white/[0.06] p-6 pt-20"
                        >
                            <nav className="flex flex-col gap-2">
                                {navLinks.map((link) => (
                                    <button
                                        key={link.label}
                                        onClick={() => handleNavClick(link.href)}
                                        className={`
                                            text-left py-3 px-4 rounded-lg transition-colors
                                            ${isActive(link.href)
                                                ? 'text-white bg-white/5'
                                                : 'text-white/60 hover:text-white hover:bg-white/5'
                                            }
                                        `}
                                    >
                                        {link.label}
                                    </button>
                                ))}

                                <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
                                    {isAuthenticated ? (
                                        <>
                                            <Link
                                                to="/dashboard"
                                                className="block w-full py-3 px-4 text-center bg-white/5 text-white rounded-lg"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                Dashboard
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full py-3 text-center text-white/50 hover:text-white"
                                            >
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                to="/login"
                                                className="block w-full py-3 px-4 text-center bg-white/5 text-white rounded-lg"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                Sign In
                                            </Link>
                                            <Link
                                                to="/signup"
                                                className="block w-full py-3 px-4 text-center bg-f1-red text-white font-medium rounded-lg"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                Get Started
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </nav>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
