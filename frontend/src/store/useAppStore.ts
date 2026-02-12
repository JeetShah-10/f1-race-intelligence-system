import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/auth';

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
    favoriteTeam: string | null;
    favoriteDriver: string | null;
    hasCompletedOnboarding: boolean;
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
    setFavorites: (team: string, driver: string) => void;
    completeOnboarding: () => void;
    initializeAuth: () => Promise<void>;
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
    favoriteTeam: null,
    favoriteDriver: null,
    hasCompletedOnboarding: false,
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
                    favoriteTeam: null,
                    favoriteDriver: null,
                    hasCompletedOnboarding: false,
                },
                isAuthenticated: true,
            }),
            logout: () => set({ user: defaultUser, isAuthenticated: false }),
            upgradeToPremium: () => set((state) => ({
                user: { ...state.user, tier: 'premium' }
            })),
            setFavorites: (team, driver) => set((state) => ({
                user: {
                    ...state.user,
                    favoriteTeam: team,
                    favoriteDriver: driver,
                }
            })),
            completeOnboarding: () => set((state) => ({
                user: { ...state.user, hasCompletedOnboarding: true }
            })),
            initializeAuth: async () => {
                const { session } = await authService.getSession();
                if (session?.user) {
                    set((state) => ({
                        isAuthenticated: true,
                        user: {
                            ...state.user,
                            email: session.user.email || null,
                            id: session.user.id,
                            name: session.user.user_metadata?.name || state.user.name || session.user.email?.split('@')[0],
                            avatar: session.user.user_metadata?.avatar_url || state.user.avatar,
                        }
                    }));
                }
            },

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
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
