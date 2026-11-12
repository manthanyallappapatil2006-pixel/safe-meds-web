import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  X,
  Search,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  LocateFixed,
} from 'lucide-react';
import { indianCitiesList } from '../data/doctors';

// Known coordinates for reference Indian cities to calculate real distance
const CITY_COORDINATES = {
  Delhi: { lat: 28.6139, lng: 77.209 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Kolhapur: { lat: 16.705, lng: 74.2433 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
};

// Haversine formula to calculate genuine distance in km between two coordinates
const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

export const LocationDiscoveryBar = ({
  onLocationResolved,
  onLocationCleared,
  currentCity = 'All Cities',
}) => {
  const [gpsActive, setGpsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [detectedLocationInfo, setDetectedLocationInfo] = useState(null);

  const requestGpsLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your current browser.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Find nearest supported city based on actual Haversine distance
        let closestCity = 'Delhi';
        let minDistance = Infinity;

        Object.entries(CITY_COORDINATES).forEach(([cityName, coords]) => {
          const dist = calculateHaversineDistance(latitude, longitude, coords.lat, coords.lng);
          if (dist < minDistance) {
            minDistance = dist;
            closestCity = cityName;
          }
        });

        const info = {
          latitude,
          longitude,
          matchedCity: closestCity,
          distanceKm: minDistance,
        };

        setDetectedLocationInfo(info);
        setGpsActive(true);
        setLoading(false);

        if (typeof onLocationResolved === 'function') {
          onLocationResolved(info);
        }
      },
      (error) => {
        setLoading(false);
        let message = 'Location permission was denied. You can manually enter your city or PIN code.';
        if (error.code === error.POSITION_UNAVAILABLE) {
          message = 'Location information is currently unavailable. Please enter your city manually.';
        } else if (error.code === error.TIMEOUT) {
          message = 'Location request timed out. Please select your city from the list.';
        }
        setErrorMsg(message);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // 5 min cache, no continuous tracking
      }
    );
  };

  const handleStopGps = () => {
    setGpsActive(false);
    setDetectedLocationInfo(null);
    setErrorMsg('');
    if (typeof onLocationCleared === 'function') {
      onLocationCleared();
    }
  };

  const handlePinCodeSearch = (e) => {
    e.preventDefault();
    if (!pinCode.trim()) return;

    // Approximate mapping for major demo region PIN prefixes
    const code = pinCode.trim();
    let cityMatch = null;
    if (code.startsWith('110')) cityMatch = 'Delhi';
    else if (code.startsWith('400')) cityMatch = 'Mumbai';
    else if (code.startsWith('411')) cityMatch = 'Pune';
    else if (code.startsWith('416')) cityMatch = 'Kolhapur';
    else if (code.startsWith('560')) cityMatch = 'Bengaluru';
    else if (code.startsWith('500')) cityMatch = 'Hyderabad';
    else if (code.startsWith('600')) cityMatch = 'Chennai';

    if (cityMatch) {
      setErrorMsg('');
      if (typeof onLocationResolved === 'function') {
        onLocationResolved({ matchedCity: cityMatch, pinCode: code, distanceKm: null });
      }
    } else {
      setErrorMsg(`No direct clinics matched for PIN ${code}. Showing all verified providers.`);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-6 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center shrink-0">
            <LocateFixed className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Nearby Services Discovery</h4>
            <p className="text-[11px] text-slate-500">
              Find verified healthcare providers near you. Location is used on-demand only and never continuously tracked.
            </p>
          </div>
        </div>

        {/* Action: GPS Button or Active State */}
        {!gpsActive ? (
          <button
            type="button"
            onClick={requestGpsLocation}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Locating...</span>
              </>
            ) : (
              <>
                <Navigation className="w-3.5 h-3.5" />
                <span>Use My Location (GPS)</span>
              </>
            )}
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                Near {detectedLocationInfo?.matchedCity}
                {detectedLocationInfo?.distanceKm !== null &&
                  ` (~${detectedLocationInfo?.distanceKm} km)`}
              </span>
            </div>

            <button
              type="button"
              onClick={handleStopGps}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              title="Stop Location-based Discovery"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Stop Location</span>
            </button>
          </div>
        )}
      </div>

      {/* Manual Search Options: City or PIN Code */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 text-xs">
        <span className="text-slate-500 font-medium shrink-0">Or enter manually:</span>

        <form onSubmit={handlePinCodeSearch} className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              placeholder="Enter 6-digit postal PIN (e.g. 110001, 400052, 411004)"
              maxLength={6}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors shrink-0"
          >
            Search PIN
          </button>
        </form>
      </div>

      {/* Error or Graceful fallback notice */}
      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};

export default LocationDiscoveryBar;
