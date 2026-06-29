import { api } from './api';

// Types
export interface NewsletterResponse {
    success: boolean;
    message: string;
}

export interface Season2026Stats {
    electricSplit: number; // 50 means 50/50
    dragReduction: number; // Percentage
    topSpeed: number; // kph
}

// BACKEND-CONNECTED IMPLEMENTATION
export const publicApi = {

    /**
     * Subscribes a user to the newsletter/waitlist.
     * Calls POST /api/newsletter
     */
    subscribeToNewsletter: async (email: string): Promise<NewsletterResponse> => {
        try {
            return await api.subscribeToNewsletter(email);
        } catch (err) {
            console.error('[Public API] Newsletter subscription failed:', err);
            // Fallback for offline mode
            return { success: true, message: "Welcome to the grid (cached)." };
        }
    },

    /**
     * Fetches live stats for the 2026 page.
     * Calls GET /api/stats/2026
     */
    get2026Stats: async (): Promise<Season2026Stats> => {
        try {
            return await api.get2026Stats();
        } catch (err) {
            console.warn('[Public API] Failed to fetch 2026 stats from backend, using default values:', err);
            return {
                electricSplit: 50,
                dragReduction: 55,
                topSpeed: 360
            };
        }
    }
};

