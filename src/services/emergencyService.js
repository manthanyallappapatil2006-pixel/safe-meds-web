
import { apiClient } from './api';

/**
 * Create a new emergency request.
 * Sends the patient's GPS location to the backend.
 */
export const createEmergencyRequestAPI = async (requestData) => {
  return await apiClient.post('/emergency-requests', requestData);
};

/**
 * Update the patient's latest GPS location.
 */
export const updateEmergencyLocationAPI = async (requestId, location) => {
  return await apiClient.patch(
    `/emergency-requests/${requestId}/location`,
    location
  );
};

/**
 * Get the latest emergency request status.
 */
export const getEmergencyRequestAPI = async (requestId) => {
  return await apiClient.get(
    `/emergency-requests/${requestId}`
  );
};

/**
 * Get ambulance tracking information.
 */
export const getAmbulanceTrackingAPI = async (requestId) => {
  return await apiClient.get(
    `/emergency-requests/${requestId}/tracking`
  );
};

/**
 * Request cancellation of an emergency.
 */
export const cancelEmergencyRequestAPI = async (requestId) => {
  return await apiClient.post(
    `/emergency-requests/${requestId}/cancel`,
    {}
  );
};
