import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store';

interface HeaderProps {
    transparent?: boolean;
}

const navLinks = [
    { label: 'Technology', href: '/technology' },
    { label: 'Drivers', href: '/drivers' },
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
            setIsScrolled(window.scrollY > 50);
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
        if (href.startsWith('#')) {
            const element = document.querySelector(href);
            element?.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate(href);
        }
    };

    const isLandingPage = location.pathname === '/';
    const showTransparent = transparent && !isScrolled && isLandingPage;

    return (
        <>
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.17, 0.84, 0.44, 1] }}
                className={`
                    fixed top-0 left-0 right-0 z-50
                    transition-all duration-300 ease-[cubic-bezier(0.32,0.725,0.25,1)]
                    ${showTransparent
                        ? 'bg-transparent backdrop-blur-none border-b border-transparent shadow-none pt-4'
                        : 'bg-[#0A0A0A]/95 backdrop-blur-3xl backdrop-saturate-150 border-b border-white/5 shadow-2xl pt-0'
                    }
                `}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">

                        <Link
                            to="/"
                            className="flex items-center gap-2 group"
                        >
                            <div className="flex gap-0.5">
                                <div className="w-6 h-1 bg-f1-red group-hover:w-8 transition-all duration-300" />
                                <div className="w-4 h-1 bg-f1-red/60" />
                                <div className="w-2 h-1 bg-f1-red/30" />
                            </div>
                            <span className="font-racing text-xl text-white tracking-wider">
                                APEX
                            </span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <button
                                    key={link.label}
                                    onClick={() => handleNavClick(link.href)}
                                    className="text-white/70 hover:text-white text-sm font-medium tracking-wide transition-colors relative group"
                                >
                                    {link.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-f1-red group-hover:w-full transition-all duration-300" />
                                </button>
                            ))}
                        </nav>

                        <div className="hidden md:flex items-center gap-4">
                            {isAuthenticated ? (
                                <div className="flex items-center gap-4">
                                    <Link
                                        to="/dashboard"
                                        className="text-white/70 hover:text-white text-sm font-medium transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-f1-red to-neon-orange flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">
                                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="text-white/50 hover:text-white text-sm transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-white/70 hover:text-white text-sm font-medium transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="px-5 py-2 bg-f1-red hover:bg-f1-red/90 text-white text-sm font-semibold rounded-lg transition-all hover:shadow-[0_0_20px_rgba(207,44,40,0.4)]"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
                        >
                            <motion.span
                                animate={isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                                className="w-6 h-0.5 bg-white block"
                            />
                            <motion.span
                                animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                                className="w-6 h-0.5 bg-white block"
                            />
                            <motion.span
                                animate={isMobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                                className="w-6 h-0.5 bg-white block"
                            />
                        </button>
                    </div>
                </div>
            </motion.header>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ duration: 0.3, ease: [0.17, 0.84, 0.44, 1] }}
                        className="fixed inset-0 z-40 md:hidden"
                    >
                        <div
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="absolute right-0 top-0 bottom-0 w-72 bg-[#0a0a0a] border-l border-white/10 p-6 pt-20"
                        >
                            <nav className="flex flex-col gap-4">
                                {navLinks.map((link) => (
                                    <button
                                        key={link.label}
                                        onClick={() => handleNavClick(link.href)}
                                        className="text-white/70 hover:text-white text-lg font-medium text-left py-2 border-b border-white/5"
                                    >
                                        {link.label}
                                    </button>
                                ))}

                                <div className="mt-6 pt-6 border-t border-white/10">
                                    {isAuthenticated ? (
                                        <>
                                            <Link
                                                to="/dashboard"
                                                className="block w-full py-3 text-center bg-white/5 text-white rounded-lg mb-3"
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
                                                className="block w-full py-3 text-center bg-white/5 text-white rounded-lg mb-3"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                Log in
                                            </Link>
                                            <Link
                                                to="/signup"
                                                className="block w-full py-3 text-center bg-f1-red text-white font-semibold rounded-lg"
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
