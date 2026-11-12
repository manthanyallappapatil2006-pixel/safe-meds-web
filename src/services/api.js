/**
 * api.js — Base API client for Safe Meds backend.
 *
 * Usage:
 *   import { apiClient } from './api';
 *   const data = await apiClient.get('/doctors');
 *
 * Configure VITE_API_BASE_URL in your .env file.
 * Example: VITE_API_BASE_URL=https://api.yourdomain.com/v1
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Returns auth headers including the Supabase JWT if available,
 * or the VITE_API_KEY if set (for custom backend authentication).
 */
const getAuthHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };

  // Add API key header if configured for the custom backend
  const apiKey = import.meta.env.VITE_API_KEY;
  if (apiKey) {
    headers['X-API-Key'] = apiKey;
  }

  // Add Supabase JWT if present in localStorage
  try {
    const supabaseKey = Object.keys(localStorage).find((k) =>
      k.startsWith('sb-') && k.endsWith('-auth-token')
    );
    if (supabaseKey) {
      const session = JSON.parse(localStorage.getItem(supabaseKey));
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
    }
  } catch (_) {
    // Non-fatal — proceed without auth header
  }

  return headers;
};

/**
 * Core fetch wrapper with error normalisation.
 */
const request = async (method, path, body = null) => {
  if (!BASE_URL) {
    // Backend not configured — return a clearly-labelled stub response
    console.warn(
      `[SafeMeds API] VITE_API_BASE_URL is not set. Request ${method} ${path} was not sent. ` +
      'Configure your .env file to connect the frontend to the backend.'
    );
    return { data: null, error: { message: 'Backend not configured. Set VITE_API_BASE_URL.' }, status: 0 };
  }

  const url = `${BASE_URL}${path}`;
  const options = {
    method,
    headers: getAuthHeaders(),
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const data = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      return {
        data: null,
        error: { message: data?.message || `HTTP ${res.status}`, status: res.status },
        status: res.status,
      };
    }

    return { data, error: null, status: res.status };
  } catch (err) {
    console.error(`[SafeMeds API] Network error on ${method} ${path}:`, err);
    return {
      data: null,
      error: { message: err.message || 'Network error' },
      status: 0,
    };
  }
};

export const apiClient = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  patch: (path, body) => request('PATCH', path, body),
  delete: (path) => request('DELETE', path),
};
