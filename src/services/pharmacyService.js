/**
 * pharmacyService.js — Pharmacy directory API client.
 * Calls backend GET /pharmacies or gracefully handles provider lookup.
 */
import { apiClient } from './api';
import { initialPharmacies } from '../data/pharmacies';

export const pharmacyService = {
  /**
   * Fetch pharmacies matching query or city filter.
   * Backend: GET /pharmacies?city=...&search=...
   */
  async getPharmacies(filters = {}) {
    const isBackendConfigured = Boolean(import.meta.env.VITE_API_BASE_URL);

    if (isBackendConfigured) {
      const params = new URLSearchParams();
      if (filters.city) params.set('city', filters.city);
      if (filters.search) params.set('search', filters.search);
      const query = params.toString() ? `?${params}` : '';
      return apiClient.get(`/pharmacies${query}`);
    }

    // Local informational directory fallback
    let list = [...initialPharmacies];
    if (filters.city && filters.city !== 'All Cities') {
      list = list.filter((p) => p.city?.toLowerCase() === filters.city.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.address?.toLowerCase().includes(q) ||
          p.city?.toLowerCase().includes(q)
      );
    }

    return { data: list, error: null };
  },

  /**
   * Fetch single pharmacy details.
   * Backend: GET /pharmacies/:id
   */
  async getPharmacyById(id) {
    const isBackendConfigured = Boolean(import.meta.env.VITE_API_BASE_URL);

    if (isBackendConfigured) {
      return apiClient.get(`/pharmacies/${id}`);
    }

    const item = initialPharmacies.find((p) => p.id === id);
    return { data: item || null, error: item ? null : { message: 'Pharmacy not found' } };
  },
};

export default pharmacyService;
