import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import type { Layout, ResponsiveLayouts as Layouts } from 'react-grid-layout/legacy';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { motion, AnimatePresence } from 'framer-motion';

// Widget Imports
import { NextRaceHero } from './widgets/NextRaceHero';
import { QuickActions } from './widgets/QuickActions';
import { MomentumTracker } from './widgets/MomentumTracker';
import { RivalryCards } from './widgets/RivalryCards';
import { StandingsWidget } from './widgets/StandingsWidget';
import { RaceCalendarWidget } from './widgets/RaceCalendarWidget';
import { ConstructorStandingsWidget } from './widgets/ConstructorStandingsWidget';

const ResponsiveGridLayout = WidthProvider(Responsive);

const defaultLayouts: Layouts = {
    lg: [
        { i: 'hero', x: 0, y: 0, w: 8, h: 6, minW: 6, minH: 4, maxH: 8 },
        { i: 'actions', x: 8, y: 0, w: 4, h: 6, minW: 3, minH: 4, maxH: 8 },
        { i: 'standings', x: 0, y: 6, w: 4, h: 6, minW: 3, minH: 4, maxH: 8 },
        { i: 'constructors', x: 4, y: 6, w: 4, h: 6, minW: 3, minH: 4, maxH: 8 },
        { i: 'calendar', x: 8, y: 6, w: 4, h: 6, minW: 3, minH: 4, maxH: 8 },
        { i: 'momentum', x: 0, y: 12, w: 6, h: 6, minW: 4, minH: 4, maxH: 10 },
        { i: 'rivalries', x: 6, y: 12, w: 6, h: 6, minW: 4, minH: 4, maxH: 10 }
    ],
    md: [
        { i: 'hero', x: 0, y: 0, w: 10, h: 6, minW: 6, minH: 4, maxH: 8 },
        { i: 'actions', x: 0, y: 6, w: 10, h: 4, minW: 6, minH: 3, maxH: 7 },
        { i: 'standings', x: 0, y: 10, w: 5, h: 6, minW: 4, minH: 4, maxH: 8 },
        { i: 'constructors', x: 5, y: 10, w: 5, h: 6, minW: 4, minH: 4, maxH: 8 },
        { i: 'calendar', x: 0, y: 16, w: 10, h: 5, minW: 6, minH: 4, maxH: 8 },
        { i: 'momentum', x: 0, y: 21, w: 5, h: 6, minW: 4, minH: 4, maxH: 10 },
        { i: 'rivalries', x: 5, y: 21, w: 5, h: 6, minW: 4, minH: 4, maxH: 10 }
    ],
    sm: [
        { i: 'hero', x: 0, y: 0, w: 6, h: 6, minW: 6, minH: 4, maxH: 8 },
        { i: 'actions', x: 0, y: 6, w: 6, h: 4, minW: 6, minH: 3, maxH: 7 },
        { i: 'standings', x: 0, y: 10, w: 6, h: 6, minW: 6, minH: 4, maxH: 8 },
        { i: 'constructors', x: 0, y: 16, w: 6, h: 6, minW: 6, minH: 4, maxH: 8 },
        { i: 'calendar', x: 0, y: 22, w: 6, h: 5, minW: 6, minH: 4, maxH: 8 },
        { i: 'momentum', x: 0, y: 27, w: 6, h: 6, minW: 6, minH: 4, maxH: 10 },
        { i: 'rivalries', x: 0, y: 33, w: 6, h: 6, minW: 6, minH: 4, maxH: 10 }
    ]
};

const STORAGE_KEY = 'f1-dashboard-layout';
const CUSTOMIZED_KEY = 'f1-dashboard-customized';

const loadLayouts = (): Layouts => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            // Validate that saved layout has all required widgets
            const requiredWidgets = ['hero', 'actions', 'standings', 'constructors', 'calendar', 'momentum', 'rivalries'];
            const savedWidgets = parsed.lg?.map((l: { i: string }) => l.i) || [];
            const hasAllWidgets = requiredWidgets.every(w => savedWidgets.includes(w));
            if (hasAllWidgets) {
                return parsed;
            }
        }
        return defaultLayouts;
    } catch {
        return defaultLayouts;
    }
};

const isCustomized = (): boolean => {
    return localStorage.getItem(CUSTOMIZED_KEY) === 'true';
};

// SVG Icons
const GridIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
    </svg>
);

const ResetIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
    </svg>
);

const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

interface DashboardGridProps {
    isFirstVisit?: boolean;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({ isFirstVisit = false }) => {
    // Widget mapping - dashboard overview widgets only
    const widgetComponents: Record<string, React.ReactNode> = useMemo(() => ({
        hero: <NextRaceHero />,
        actions: <QuickActions />,
        standings: <StandingsWidget />,
        constructors: <ConstructorStandingsWidget />,
        calendar: <RaceCalendarWidget />,
        momentum: <MomentumTracker />,
        rivalries: <RivalryCards />
    }), []);

    const [layouts, setLayouts] = useState<Layouts>(loadLayouts);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showIntro, setShowIntro] = useState(!isCustomized() && isFirstVisit);
    const isDragging = useRef(false);

    const handleDragStart = () => {
        isDragging.current = true;
    };

    const handleDragStop = () => {
        isDragging.current = false;
    };

    const handleLayoutChange = useCallback((_layout: Layout, allLayouts: Layouts) => {
        if (isEditMode) {
            setLayouts(allLayouts);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(allLayouts));
            localStorage.setItem(CUSTOMIZED_KEY, 'true');
        }
    }, [isEditMode]);

    const handleResetLayout = useCallback(() => {
        setLayouts({ ...defaultLayouts });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultLayouts));
        localStorage.removeItem(CUSTOMIZED_KEY);
    }, []);

    const handleDoneEditing = useCallback(() => {
        setIsEditMode(false);
        setShowIntro(false);
    }, []);

    return (
        <div className="w-full relative pb-8">
            <AnimatePresence>
                {showIntro && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative max-w-md w-full mx-4 p-6 rounded-2xl bg-gradient-to-br from-[#1a1a1c] to-[#0f0f12] border border-white/10"
                        >
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E10600] via-[#FF6B00] to-transparent rounded-t-2xl" />

                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-[#E10600]/20 text-[#E10600]">
                                    <GridIcon />
                                </div>
                                <h3 className="text-white text-lg font-semibold">
                                    Welcome to Your Dashboard
                                </h3>
                            </div>

                            <p className="text-white/60 text-sm mb-6 leading-relaxed">
                                You can customize your dashboard layout by dragging widgets to rearrange them.
                                Use the grid icon in the top-right to enter edit mode anytime.
                            </p>

                            <div className="flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setShowIntro(false);
                                        setIsEditMode(true);
                                    }}
                                    className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-[#E10600] to-[#FF6B00] text-white font-medium text-sm flex items-center justify-center gap-2"
                                >
                                    <GridIcon />
                                    Customize Now
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowIntro(false)}
                                    className="px-4 py-3 rounded-lg border border-white/15 text-white/70 font-medium text-sm"
                                >
                                    Skip
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex justify-end items-center gap-3 mb-4">
                {isEditMode ? (
                    <>
                        <motion.button
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={handleResetLayout}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06] text-white/60 hover:text-white/80 text-xs font-medium transition-all"
                        >
                            <ResetIcon />
                            Reset to Default
                        </motion.button>
                        <motion.button
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={handleDoneEditing}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs font-medium"
                        >
                            <CheckIcon />
                            Done Editing
                        </motion.button>
                    </>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsEditMode(true)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 hover:border-[#E10600]/40 bg-white/[0.03] text-white/50 hover:text-white/80 text-xs font-medium transition-all"
                    >
                        <GridIcon />
                        Customize Layout
                    </motion.button>
                )}
            </div>

            <AnimatePresence>
                {isEditMode && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-4 px-4 py-3 rounded-xl bg-[#E10600]/10 border border-[#E10600]/30 flex items-center gap-3"
                    >
                        <div className="w-2 h-2 rounded-full bg-[#E10600] animate-pulse" />
                        <span className="text-white/80 text-sm">
                            Edit Mode - Drag the grid handles to rearrange widgets
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            <ResponsiveGridLayout
                layouts={layouts}
                onLayoutChange={handleLayoutChange}
                onDragStart={handleDragStart}
                onDragStop={handleDragStop}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={80}
                margin={[20, 20]}
                containerPadding={[0, 8]}
                draggableHandle=".drag-handle"
                useCSSTransforms
                isDraggable={isEditMode}
                isResizable={isEditMode}
            >
                {Object.entries(widgetComponents).map(([key, component]) => (
                    <div key={key} className="h-full overflow-hidden relative">
                        {/* Drag Handle */}
                        {isEditMode && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="drag-handle absolute top-2 right-2 w-8 h-8 rounded-lg bg-[#E10600]/20 border border-[#E10600]/40 flex items-center justify-center cursor-move z-10"
                            >
                                <svg className="w-4 h-4 text-[#E10600]" viewBox="0 0 24 24" fill="currentColor">
                                    <circle cx="9" cy="5" r="1.5" />
                                    <circle cx="15" cy="5" r="1.5" />
                                    <circle cx="9" cy="12" r="1.5" />
                                    <circle cx="15" cy="12" r="1.5" />
                                    <circle cx="9" cy="19" r="1.5" />
                                    <circle cx="15" cy="19" r="1.5" />
                                </svg>
                            </motion.div>
                        )}
                        {/* Edit mode border */}
                        {isEditMode && (
                            <div className="absolute inset-0 border-2 border-dashed border-[#E10600]/30 rounded-xl pointer-events-none z-0" />
                        )}
                        {component}
                    </div>
                ))}
            </ResponsiveGridLayout>
        </div>
    );
};

export default DashboardGrid;
