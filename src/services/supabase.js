import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project') &&
    !supabaseAnonKey.includes('your-anon')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null;

// ─────────────────────────────────────────────────────────────
//  Auth helpers
// ─────────────────────────────────────────────────────────────
export const authService = {
  /** Register a new user. Role is always 'user' — admin flag set only via DB. */
  async signUp({ email, password, fullName, phone, city }) {
    if (!isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.') };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone, city }
      }
    });
    return { data, error };
  },

  /** Sign in an existing user. */
  async signIn({ email, password }) {
    if (!isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.') };
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  /** Sign out current user. */
  async signOut() {
    if (!isSupabaseConfigured) return { error: null };
    return await supabase.auth.signOut();
  },

  /** Get current session without triggering a network request if already cached. */
  async getSession() {
    if (!isSupabaseConfigured) return { data: { session: null }, error: null };
    return await supabase.auth.getSession();
  },

  /**
   * Send a password-reset email.
   * redirectTo must match the URL configured in Supabase Auth → URL Configuration.
   */
  async resetPassword(email, redirectTo) {
    if (!isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase not configured.') };
    }
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo || `${window.location.origin}/reset-password`
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  Profile / role helpers
// ─────────────────────────────────────────────────────────────
export const profileService = {
  /**
   * Fetch the user's profile row. Returns { profile, isAdmin, error }.
   * is_admin is stored in the profiles table and enforced by RLS.
   */
  async getProfile(userId) {
    if (!isSupabaseConfigured || !userId) {
      return { profile: null, isAdmin: false, error: null };
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    return {
      profile: data || null,
      isAdmin: data?.is_admin === true,
      error
    };
  },

  /**
   * Upsert profile row after sign-up (called by trigger, but also safe to call
   * from the client as a fallback).
   */
  async upsertProfile({ userId, fullName, phone, city }) {
    if (!isSupabaseConfigured) return { error: null };
    const { error } = await supabase.from('profiles').upsert(
      {
        id: userId,
        full_name: fullName,
        phone,
        city,
        is_admin: false // Never trust client for admin flag
      },
      { onConflict: 'id', ignoreDuplicates: true }
    );
    return { error };
  }
};
