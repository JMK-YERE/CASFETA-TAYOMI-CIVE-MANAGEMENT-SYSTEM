// Supabase configuration
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uyxlwlgxlhoffrbxobxa.supabase.co'
const supabaseKey = 'sb_secret_Hlj1gu82Kpy-LHlJl9keMQ_ltPAgJGZ'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Auth functions
export const authAPI = {
    // Login user
    async loginUser(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        return { data, error }
    },

    // Logout user
    async logoutUser() {
        const { error } = await supabase.auth.signOut()
        return { error }
    },

    // Get current user
    async getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser()
        return user
    }
}

// Database functions
export const databaseAPI = {
    // Users
    async getUsers() {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('is_active', true)
        return { data, error }
    },

    // Announcements
    async getAnnouncements() {
        const { data, error } = await supabase
            .from('announcements')
            .select(`
                *,
                users:author_id (first_name, last_name, role)
            `)
            .order('created_at', { ascending: false })
        return { data, error }
    },

    // Church Photos
    async getChurchPhotos() {
        const { data, error } = await supabase
            .from('church_photos')
            .select(`
                *,
                users:uploaded_by (first_name, last_name)
            `)
            .eq('is_approved', true)
            .order('created_at', { ascending: false })
        return { data, error }
    },

    // Contributions
    async getContributions(userId = null) {
        let query = supabase
            .from('contributions')
            .select(`
                *,
                users:member_id (first_name, last_name)
            `)
            .order('contribution_date', { ascending: false })

        if (userId) {
            query = query.eq('member_id', userId)
        }

        const { data, error } = await query
        return { data, error }
    }
}
