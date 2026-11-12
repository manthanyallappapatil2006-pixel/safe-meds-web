/**
 * appointmentService.js — Appointment booking, status, and cancellation API.
 * Integrates with Node.js/Express backend or falls back gracefully to local storage.
 */
import { apiClient } from './api';
import { getStorageData, setStorageData } from '../utils/storage';

const APPOINTMENTS_STORAGE_KEY = 'safe_meds_appointments';

export const appointmentService = {
  /**
   * Fetch list of appointments for current user.
   * Backend: GET /appointments
   */
  async getAppointments() {
    const isBackendConfigured = Boolean(import.meta.env.VITE_API_BASE_URL);

    if (isBackendConfigured) {
      return apiClient.get('/appointments');
    }

    // Local fallback
    const local = getStorageData(APPOINTMENTS_STORAGE_KEY, []);
    return { data: local, error: null };
  },

  /**
   * Book an appointment with a verified doctor.
   * Backend: POST /appointments
   * Body: { doctorId, doctorName, specialty, date, time, patientName, patientPhone, notes }
   */
  async bookAppointment(bookingData) {
    const isBackendConfigured = Boolean(import.meta.env.VITE_API_BASE_URL);

    if (isBackendConfigured) {
      return apiClient.post('/appointments', bookingData);
    }

    // Local fallback with generated ID and confirmation
    const newAppointment = {
      id: 'apt_' + Date.now(),
      ...bookingData,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    const current = getStorageData(APPOINTMENTS_STORAGE_KEY, []);
    const updated = [newAppointment, ...current];
    setStorageData(APPOINTMENTS_STORAGE_KEY, updated);

    return { data: newAppointment, error: null };
  },

  /**
   * Cancel an appointment.
   * Backend: PATCH /appointments/:id/cancel
   */
  async cancelAppointment(appointmentId, reason = '') {
    const isBackendConfigured = Boolean(import.meta.env.VITE_API_BASE_URL);

    if (isBackendConfigured) {
      return apiClient.patch(`/appointments/${appointmentId}/cancel`, { reason });
    }

    // Local fallback
    const current = getStorageData(APPOINTMENTS_STORAGE_KEY, []);
    const updated = current.map((apt) =>
      apt.id === appointmentId ? { ...apt, status: 'cancelled', cancelReason: reason } : apt
    );
    setStorageData(APPOINTMENTS_STORAGE_KEY, updated);

    return { data: { success: true, id: appointmentId, status: 'cancelled' }, error: null };
  },
};

export default appointmentService;
