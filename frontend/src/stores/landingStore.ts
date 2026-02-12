import { create } from 'zustand';

interface LandingState {
    // Current scroll section (0-5)
    currentSection: number;
    setCurrentSection: (section: number) => void;

    // 3D car loading state
    isCarLoaded: boolean;
    setCarLoaded: (loaded: boolean) => void;

    // Animation triggers
    hasAnimatedProof: boolean;
    markProofAnimated: () => void;

    hasAnimatedBroadcast: boolean;
    markBroadcastAnimated: () => void;

    // User interaction
    hasScrolled: boolean;
    markScrolled: () => void;
}

export const useLandingStore = create<LandingState>()((set) => ({
    currentSection: 0,
    setCurrentSection: (section) => set({ currentSection: section }),

    isCarLoaded: false,
    setCarLoaded: (loaded) => set({ isCarLoaded: loaded }),

    hasAnimatedProof: false,
    markProofAnimated: () => set({ hasAnimatedProof: true }),

    hasAnimatedBroadcast: false,
    markBroadcastAnimated: () => set({ hasAnimatedBroadcast: true }),

    hasScrolled: false,
    markScrolled: () => set({ hasScrolled: true }),
}));
