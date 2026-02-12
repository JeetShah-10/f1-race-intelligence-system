import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';
import { CarbonFiber, NoiseOverlay } from '../ui/Textures';

interface DashboardLayoutProps {
    children: React.ReactNode;
    sidebarOpen: boolean;
    onToggleSidebar: () => void;
    hideSidebar?: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    children,
    sidebarOpen,
    onToggleSidebar,
    hideSidebar = false
}) => {
    // If sidebar is hidden, treat as closed
    const effectiveSidebarOpen = hideSidebar ? false : sidebarOpen;

    return (
        <div className="min-h-screen flex flex-col bg-[#0a0a0b] text-white selection:bg-[#E10600]/30 relative">
            {/* Background Texture Layers */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <CarbonFiber opacity={0.6} />
                <NoiseOverlay opacity={0.03} />
                <div className="absolute inset-0 opacity-10" style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.3) 50%)', backgroundSize: '100% 4px' }} />
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-red-900/10 blur-[120px]" />
            </div>

            {/* MOBILE SIDEBAR (Overlay) - Independent of layout flow */}
            <AnimatePresence>
                {!hideSidebar && effectiveSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onToggleSidebar}
                            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                        />
                        <motion.aside
                            initial={{ x: -100 + '%' }}
                            animate={{ x: 0 }}
                            exit={{ x: -100 + '%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="lg:hidden fixed top-0 left-0 bottom-0 w-[280px] z-[70] bg-[#0a0a0b] border-r border-white/10 shadow-2xl overflow-hidden overscroll-contain"
                        >
                            <div className="h-full pt-4 relative z-10">
                                <Sidebar />
                            </div>
                            <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
                                <CarbonFiber opacity={0.4} />
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Sticky Header */}
            <div className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#0a0a0b]/80 backdrop-blur-xl">
                <DashboardHeader />
            </div>

            {/* Main Layout Area */}
            <div className="flex flex-1 relative z-10">

                {/* DESKTOP SIDEBAR - Sticky */}
                {!hideSidebar && (
                    <motion.aside
                        initial={false}
                        animate={{
                            width: effectiveSidebarOpen ? 280 : 0,
                            opacity: effectiveSidebarOpen ? 1 : 0
                        }}
                        className="hidden lg:block flex-shrink-0 relative z-20"
                    >
                        {/* 
                            This inner container is STICKY.
                            It will stay fixed on the screen while the parent (and main content) scrolls.
                            top-16 ensures it sits strictly below the sticky header.
                            h-[calc(100vh-4rem)] ensures it fills exactly the remaining viewport height.
                        */}
                        <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-hidden border-r border-white/5 bg-[#0a0a0b]/50 backdrop-blur-md">
                            {/* Scrollable content inside the sticky sidebar if needed */}
                            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                                <Sidebar />
                            </div>
                        </div>
                    </motion.aside>
                )}

                {/* Main Content - Flows naturally with window scroll */}
                <main className="flex-1 min-w-0">
                    {/* Mobile Toggle Button */}
                    {!hideSidebar && (
                        <div className="lg:hidden p-4 pb-0">
                            <button
                                onClick={onToggleSidebar}
                                className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/70"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* Desktop Toggle Button - Fixed to viewport so it never scrolls away */}
                    {!hideSidebar && (
                        <div className="hidden lg:block fixed top-24 z-30 transition-all duration-300 ease-in-out"
                            style={{ left: effectiveSidebarOpen ? '268px' : '20px' }}
                        >
                            <button
                                onClick={onToggleSidebar}
                                className="p-1.5 rounded-full bg-[#1a1a1c] border border-white/10 text-white/50 hover:text-white transition-colors shadow-lg flex items-center justify-center"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    {effectiveSidebarOpen ? (
                                        <path d="M15 18l-6-6 6-6" />
                                    ) : (
                                        <path d="M9 18l6-6-6-6" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    )}

                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>

            {/* Custom Scrollbar Styles for internal elements if needed */}
            <style>{`
                .scrollbar-thin::-webkit-scrollbar { width: 6px; }
                .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
                .scrollbar-thin::-webkit-scrollbar-thumb { 
                    background: rgba(255,255,255,0.2); 
                    border-radius: 3px; 
                }
                .scrollbar-thin::-webkit-scrollbar-thumb:hover { 
                    background: rgba(255,255,255,0.4); 
                }
            `}</style>
        </div>
    );
};

export default DashboardLayout;

