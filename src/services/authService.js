/**
 * authService.js — Unified Authentication Service for Safe Meds.
 * Supports both custom Node.js/Express backend (via apiClient) and Supabase OAuth / Auth.
 */
import { apiClient } from './api';
import { supabase, isSupabaseConfigured } from './supabase';

export const authService = {
  /**
   * Register a new user account.
   * Calls backend POST /auth/register or falls back to Supabase auth.
   */
  async register({ email, password, fullName, phone, city }) {
    const isBackendConfigured = Boolean(import.meta.env.VITE_API_BASE_URL);

    if (isBackendConfigured) {
      return apiClient.post('/auth/register', { email, password, fullName, phone, city });
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, phone, city },
        },
      });
      return { data, error: error ? { message: error.message } : null };
    }

    // Local / development fallback
    return {
      data: {
        user: { id: 'usr_' + Date.now(), email, name: fullName, phone, city, role: 'user' },
        token: 'dev-token-' + Date.now(),
      },
      error: null,
    };
  },

  /**
   * Log in with email and password.
   */
  async login({ email, password }) {
    const isBackendConfigured = Boolean(import.meta.env.VITE_API_BASE_URL);

    if (isBackendConfigured) {
      return apiClient.post('/auth/login', { email, password });
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error: error ? { message: error.message } : null };
    }

    // Return message indicating backend needs setup
    return {
      data: null,
      error: {
        message: 'No backend or Supabase configured. Set VITE_API_BASE_URL or VITE_SUPABASE_URL in .env.',
      },
    };
  },

  /**
   * Real OAuth Google Sign-In via Supabase.
   * If not configured, returns error explaining required setup.
   */
  async signInWithGoogle() {
    if (!isSupabaseConfigured) {
      return {
        data: null,
        error: {
          message:
            'Google Sign-In requires Supabase OAuth configuration. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env and enable Google Provider in Supabase Auth Settings.',
        },
      };
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/home`,
      },
    });

    return { data, error: error ? { message: error.message } : null };
  },

  /**
   * Password reset email.
   */
  async forgotPassword(email) {
    const isBackendConfigured = Boolean(import.meta.env.VITE_API_BASE_URL);

    if (isBackendConfigured) {
      return apiClient.post('/auth/forgot-password', { email });
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login?reset=success`,
      });
      return { data, error: error ? { message: error.message } : null };
    }

    return {
      data: null,
      error: { message: 'Authentication service not configured.' },
    };
  },

  /**
   * Sign out current session.
   */
  async logout() {
    const isBackendConfigured = Boolean(import.meta.env.VITE_API_BASE_URL);

    if (isBackendConfigured) {
      await apiClient.post('/auth/logout');
    }

    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }

    localStorage.removeItem('safe_meds_user');
    localStorage.removeItem('safe_meds_token');
    return { error: null };
  },

  /**
   * Fetch current authenticated user profile.
   */
  async getProfile() {
    const isBackendConfigured = Boolean(import.meta.env.VITE_API_BASE_URL);

    if (isBackendConfigured) {
      return apiClient.get('/auth/me');
    }

    if (isSupabaseConfigured) {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) return { data: null, error: null };

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return {
        data: {
          ...user,
          ...profile,
          isAdmin: profile?.is_admin === true,
        },
        error: null,
      };
    }

    return { data: null, error: null };
  },
};

export default authService;
