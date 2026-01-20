import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DashboardMode = 'view' | 'simulate' | 'compare';
export type UserTier = 'guest' | 'registered' | 'premium';
export type UserRole = 'user' | 'admin';

interface User {
    id: string | null;
    name: string | null;
    email: string | null;
    tier: UserTier;
    role: UserRole;
    avatar: string | null;
}

interface AppState {
    dashboardMode: DashboardMode;
    setDashboardMode: (mode: DashboardMode) => void;
    user: User;
    isAuthenticated: boolean;
    setUser: (user: Partial<User>) => void;
    login: (email: string, name: string) => void;
    logout: () => void;
    upgradeToPremium: () => void;
    isLoading: boolean;
    setLoading: (loading: boolean) => void;
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    dataLastUpdated: string;
    modelConfidence: number;
    setDataTrust: (lastUpdated: string, confidence: number) => void;
}

const defaultUser: User = {
    id: null,
    name: null,
    email: null,
    tier: 'guest',
    role: 'user',
    avatar: null,
};

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            dashboardMode: 'view',
            setDashboardMode: (mode) => set({ dashboardMode: mode }),

            user: defaultUser,
            isAuthenticated: false,
            setUser: (updates) => set((state) => ({ user: { ...state.user, ...updates } })),
            login: (email, name) => set({
                user: {
                    id: crypto.randomUUID(),
                    email,
                    name,
                    tier: 'registered',
                    role: 'user',
                    avatar: null,
                },
                isAuthenticated: true,
            }),
            logout: () => set({ user: defaultUser }),
            upgradeToPremium: () => set((state) => ({
                user: { ...state.user, tier: 'premium' }
            })),

            isLoading: false,
            setLoading: (loading) => set({ isLoading: loading }),
            isSidebarOpen: false,
            toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

            dataLastUpdated: '2h ago',
            modelConfidence: 94.2,
            setDataTrust: (lastUpdated, confidence) => set({
                dataLastUpdated: lastUpdated,
                modelConfidence: confidence,
            }),
        }),
        {
            name: 'apex-app-store',
            partialize: (state) => ({
                dashboardMode: state.dashboardMode,
                user: state.user,
            }),
        }
    )
);
