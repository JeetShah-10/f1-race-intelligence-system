import { supabase } from '../lib/supabase'
import type { User, Session, AuthError } from '@supabase/supabase-js'

export interface AuthResult {
    user: User | null
    session: Session | null
    error: AuthError | null
}

export const authService = {
    /**
     * Sign up a new user with email and password
     */
    signUp: async (email: string, password: string, name?: string): Promise<AuthResult> => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name: name || email.split('@')[0] }
            }
        })
        return { user: data.user, session: data.session, error }
    },

    /**
     * Sign in with email and password
     */
    signIn: async (email: string, password: string): Promise<AuthResult> => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        return { user: data.user, session: data.session, error }
    },

    /**
     * Sign in with OAuth provider (Google, GitHub)
     */
    signInWithOAuth: async (provider: 'google' | 'github') => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/dashboard`
            }
        })
        return { data, error }
    },

    /**
     * Sign out current user
     */
    signOut: async () => {
        const { error } = await supabase.auth.signOut()
        return { error }
    },

    /**
     * Get current session
     */
    getSession: async () => {
        const { data: { session }, error } = await supabase.auth.getSession()
        return { session, error }
    },

    /**
     * Get current user
     */
    getUser: async () => {
        const { data: { user }, error } = await supabase.auth.getUser()
        return { user, error }
    },

    /**
     * Subscribe to auth state changes
     */
    onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
        return supabase.auth.onAuthStateChange(callback)
    },

    /**
     * Send password reset email
     */
    resetPassword: async (email: string) => {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
        })
        return { data, error }
    },

    /**
     * Update user attributes
     */
    updateUser: async (attributes: { password?: string, data?: object }) => {
        const { data, error } = await supabase.auth.updateUser(attributes)
        return { data, error }
    }
}
