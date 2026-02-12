import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { UserProfileDropdown } from './UserProfileDropdown';
import { useDashboardStore, selectStandings, selectNextRace } from '../../store/useDashboardStore';

interface SearchResult {
    type: 'driver' | 'circuit' | 'action' | 'page';
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    action: () => void;
    teamColor?: string;
    image?: string;
}

const searchIcons = {
    driver: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    ),
    circuit: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z" />
        </svg>
    ),
    action: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5,3 19,12 5,21" />
        </svg>
    ),
    page: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16v16H4z M4 9h16 M9 4v5" />
        </svg>
    )
};

const teamColors: Record<string, string> = {
    'Red Bull Racing': '#3671C6',
    'Ferrari': '#E8002D',
    'McLaren': '#FF8000',
    'Mercedes': '#27F4D2',
    'Aston Martin': '#229971',
    'Alpine': '#0093CC',
    'Williams': '#64C4FF',
    'Racing Bulls': '#6692FF',
    'Audi': '#000000',
    'Haas': '#B6BABD',
    'Cadillac': '#1E3264',
};

export const DashboardHeader: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const standings = useDashboardStore(selectStandings);
    const nextRace = useDashboardStore(selectNextRace);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setShowSearch(true);
            }
            if (e.key === 'Escape') {
                setShowSearch(false);
                setSearchQuery('');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (showSearch && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [showSearch]);

    const searchResults = useMemo<SearchResult[]>(() => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) {
            return [
                { type: 'page', title: 'Dashboard', subtitle: 'Main dashboard', icon: searchIcons.page, action: () => navigate('/dashboard') },
                { type: 'action', title: 'Run Simulation', subtitle: 'Simulate race scenarios', icon: searchIcons.action, action: () => navigate('/simulate') },
                { type: 'action', title: 'Predictions', subtitle: 'AI race predictions', icon: searchIcons.action, action: () => navigate('/predict') },
                { type: 'action', title: 'Analysis', subtitle: 'Deep race analysis', icon: searchIcons.action, action: () => navigate('/analyze') },
            ];
        }

        const results: SearchResult[] = [];

        standings.forEach(driver => {
            const searchText = `${driver.name} ${driver.code} ${driver.team}`.toLowerCase();
            if (searchText.includes(query)) {
                results.push({
                    type: 'driver',
                    title: driver.name,
                    subtitle: driver.team,
                    icon: searchIcons.driver,
                    action: () => {
                        setShowSearch(false);
                    },
                    teamColor: teamColors[driver.team],
                    image: driver.image
                });
            }
        });

        if (nextRace) {
            const raceText = `${nextRace.name} ${nextRace.circuit} ${nextRace.country}`.toLowerCase();
            if (raceText.includes(query)) {
                results.push({
                    type: 'circuit',
                    title: nextRace.name,
                    subtitle: nextRace.circuit,
                    icon: searchIcons.circuit,
                    action: () => {
                        setShowSearch(false);
                        navigate(`/races/${nextRace.name.toLowerCase().replace(/ /g, '-')}`);
                    }
                });
            }
        }

        const pages = [
            { title: 'Dashboard', path: '/dashboard', keywords: ['home', 'main', 'dashboard'] },
            { title: 'Simulate', path: '/simulate', keywords: ['simulation', 'simulate', 'scenario', 'run'] },
            { title: 'Predict', path: '/predict', keywords: ['prediction', 'predict', 'ai', 'forecast'] },
            { title: 'Analyze', path: '/analyze', keywords: ['analysis', 'analyze', 'data', 'stats'] },
            { title: 'Calendar', path: '/calendar', keywords: ['calendar', 'schedule', 'races', 'events'] },
            { title: 'Settings', path: '/settings', keywords: ['settings', 'config', 'preferences'] },
        ];

        pages.forEach(page => {
            const searchText = [page.title, ...page.keywords].join(' ').toLowerCase();
            if (searchText.includes(query)) {
                results.push({
                    type: 'page',
                    title: page.title,
                    subtitle: `Navigate to ${page.title}`,
                    icon: searchIcons.page,
                    action: () => {
                        setShowSearch(false);
                        navigate(page.path);
                    }
                });
            }
        });

        return results.slice(0, 8);
    }, [searchQuery, standings, nextRace, navigate]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && searchResults[selectedIndex]) {
            e.preventDefault();
            searchResults[selectedIndex].action();
        }
    }, [searchResults, selectedIndex]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setSelectedIndex(0);
    }, []);

    const formattedTime = currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    return (
        <>
            <header className="relative z-50 h-16 shrink-0 px-6 flex items-center justify-between bg-black/40 backdrop-blur-xl border-b border-white/[0.08]">
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

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowSearch(true)}
                    className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 min-w-[200px] md:min-w-[280px]"
                >
                    <svg className="w-4 h-4 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <span className="text-white/40 text-sm flex-1 text-left">Search drivers, races...</span>
                    <kbd className="hidden md:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/[0.06] text-white/30 text-[10px] font-mono">
                        <span>⌘</span>
                        <span>K</span>
                    </kbd>
                </motion.button>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 text-white/60 text-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-mono text-xs">{formattedTime}</span>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="relative p-2 rounded-lg hover:bg-white/[0.06] transition-colors"
                    >
                        <svg className="w-5 h-5 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#E10600]" />
                    </motion.button>

                    <UserProfileDropdown />
                </div>
            </header>

            <AnimatePresence>
                {showSearch && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                setShowSearch(false);
                                setSearchQuery('');
                            }}
                            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                            className="fixed left-1/2 top-[15%] -translate-x-1/2 w-full max-w-xl z-50"
                        >
                            <div className="bg-gradient-to-br from-[#1a1a1c] via-[#0f0f12] to-[#0a0a0c] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                                <div className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.08]">
                                    <svg className="w-5 h-5 text-white/40 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="M21 21l-4.35-4.35" />
                                    </svg>
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Search drivers, races, actions..."
                                        className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-base"
                                    />
                                    <kbd className="px-2 py-1 rounded bg-white/[0.06] text-white/30 text-xs font-mono">
                                        ESC
                                    </kbd>
                                </div>

                                <div className="max-h-[400px] overflow-y-auto">
                                    {searchResults.length > 0 ? (
                                        <div className="p-2">
                                            {!searchQuery && (
                                                <div className="px-3 py-2 text-white/30 text-xs uppercase tracking-wider font-medium">
                                                    Quick Actions
                                                </div>
                                            )}
                                            {searchResults.map((result, index) => (
                                                <motion.button
                                                    key={`${result.type}-${result.title}`}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.03 }}
                                                    onClick={result.action}
                                                    onMouseEnter={() => setSelectedIndex(index)}
                                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${selectedIndex === index ? 'bg-white/[0.08]' : 'hover:bg-white/[0.04]'
                                                        }`}
                                                >
                                                    {result.image ? (
                                                        <div
                                                            className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
                                                            style={{ boxShadow: result.teamColor ? `0 0 0 2px ${result.teamColor}` : undefined }}
                                                        >
                                                            <img src={result.image} alt="" className="w-full h-full object-cover object-top scale-110" />
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                                            style={{
                                                                backgroundColor: result.teamColor ? `${result.teamColor}20` : 'rgba(255,255,255,0.05)',
                                                                color: result.teamColor || 'rgba(255,255,255,0.6)'
                                                            }}
                                                        >
                                                            {result.icon}
                                                        </div>
                                                    )}

                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-white text-sm font-medium">{result.title}</div>
                                                        <div className="text-white/40 text-xs truncate">{result.subtitle}</div>
                                                    </div>

                                                    <span className="text-white/30 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.05]">
                                                        {result.type}
                                                    </span>

                                                    {selectedIndex === index && (
                                                        <kbd className="text-white/30 text-xs font-mono">↵</kbd>
                                                    )}
                                                </motion.button>
                                            ))}
                                        </div>
                                    ) : searchQuery ? (
                                        <div className="p-8 text-center">
                                            <div className="text-white/30 text-sm">No results found for "{searchQuery}"</div>
                                        </div>
                                    ) : null}
                                </div>

                                <div className="px-4 py-3 border-t border-white/[0.08] flex items-center justify-between text-white/30 text-xs">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1">
                                            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] font-mono">↑↓</kbd>
                                            navigate
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] font-mono">↵</kbd>
                                            select
                                        </span>
                                    </div>
                                    <span className="text-white/20">Powered by F1 Intelligence</span>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
