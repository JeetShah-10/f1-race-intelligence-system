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

// MOCK IMPLEMENTATION (To be replaced by Backend Dev)
export const publicApi = {

    /**
     * Subscribes a user to the newsletter/waitlist.
     * BACKEND TODO: POST /api/newsletter
     */
    subscribeToNewsletter: async (email: string): Promise<NewsletterResponse> => {
        // Simulate Network Latency
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simulate Validation
        if (!email.includes('@')) {
            throw new Error("Invalid email address");
        }

        console.log(`[API] Subscribed: ${email}`);
        return { success: true, message: "Welcome to the grid." };
    },

    /**
     * Fetches live stats for the 2026 page.
     * BACKEND TODO: GET /api/stats/2026
     */
    get2026Stats: async (): Promise<Season2026Stats> => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
            electricSplit: 50,
            dragReduction: 55,
            topSpeed: 360
        };
    }
};
