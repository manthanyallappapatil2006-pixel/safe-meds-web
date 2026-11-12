/**
 * doctorService.js — Doctor directory & appointment slot API calls.
 * Falls back to local data when backend is not configured.
 */
import { apiClient } from './api';

export const doctorService = {
  /**
   * Fetch all available doctors.
   * Backend: GET /doctors
   * Query params: specialty, city, language, consultationType
   */
  async getDoctors(filters = {}) {
    const params = new URLSearchParams();
    if (filters.specialty) params.set('specialty', filters.specialty);
    if (filters.city) params.set('city', filters.city);
    if (filters.language) params.set('language', filters.language);
    if (filters.consultationType) params.set('consultationType', filters.consultationType);

    const query = params.toString() ? `?${params}` : '';
    return apiClient.get(`/doctors${query}`);
  },

  /**
   * Fetch a single doctor by ID.
   * Backend: GET /doctors/:id
   */
  async getDoctor(doctorId) {
    return apiClient.get(`/doctors/${doctorId}`);
  },

  /**
   * Fetch available appointment slots for a doctor.
   * Backend: GET /doctors/:id/slots?date=YYYY-MM-DD
   */
  async getAvailableSlots(doctorId, date) {
    const params = date ? `?date=${date}` : '';
    return apiClient.get(`/doctors/${doctorId}/slots${params}`);
  },
};
