import React, { useState, useRef, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, useMap } from 'react-leaflet';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  RotateCcw,
  Navigation,
  History,
  Phone,
  Compass
} from 'lucide-react';
import { Modal } from '../components/Modal';
import { FormField } from '../components/FormField';
import { StatusBadge } from '../components/StatusBadge';
import { validateEmergencyForm } from '../utils/validation';
import { useApp } from '../context/AppContext';



function UpdateMapCenter({ position }) {
  const map = useMap();
  const previousPositionRef = useRef(null);

  useEffect(() => {
    if (!position) return;

    const previousPosition = previousPositionRef.current;

    // Move the map only when GPS coordinates actually change.
    if (
      !previousPosition ||
      previousPosition[0] !== position[0] ||
      previousPosition[1] !== position[1]
    ) {
      map.panTo(position, {
        animate: true,
        duration: 1
      });

      previousPositionRef.current = [...position];
    }
  }, [position, map]);

  return null;
}

function CurrentLocationButton({ position }) {
  const map = useMap();

  return (
    <button
      type="button"
      onClick={() => {
        if (position) {
          map.flyTo(position, 17, {
            animate: true,
            duration: 1
          });
        }
      }}
      className="absolute top-3 right-3 z-[1000] bg-white text-teal-800 px-3 py-2 rounded-xl shadow-lg border border-teal-200 flex items-center gap-2 text-xs font-bold hover:bg-teal-50"
    >
      <MapPin className="w-4 h-4" />
      Current Location
    </button>
  );
}

export const Emergency = () => {
  const {
    emergencyContacts,
    createEmergencyRequest,
    updateEmergencyRequestLocation,
    emergencyHistory,
    cancelEmergencyRequest,
    advanceEmergencyStatus
  } = useApp();
  const navigate = useNavigate();

  // Active simulated request state
  const activeRequest = emergencyHistory.find(
    (req) => req.status === 'Demo Request Created' || req.status === 'Awaiting Demo Confirmation'
  );
  console.log('ACTIVE REQUEST:', activeRequest);
  
console.log('EMERGENCY HISTORY:', emergencyHistory);

  const [formData, setFormData] = useState({
    category: 'General emergency',
    location: 'Sector 62, Electronic City, Noida (Demo GPS)',
    additionalNotes: '',
    contactName: emergencyContacts[0]?.name || 'Sunita Sharma (Mother)'
  });

  const [errors, setErrors] = useState({});
  const [gpsSimulated, setGpsSimulated] = useState(false);

const watchIdRef = useRef(null);
const [showConfirmModal, setShowConfirmModal] = useState(false);
const [showCancelModal, setShowCancelModal] = useState(false);
const [targetCancelId, setTargetCancelId] = useState(null);

   
const gpsLocation =
  formData.location?.includes('GPS Location:')
    ? formData.location
    : activeRequest?.location;

const gpsMatch = gpsLocation?.match(
  /GPS Location:\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/
);

const patientPosition = gpsMatch
  ? [Number(gpsMatch[1]), Number(gpsMatch[2])]
  : null;
  
  console.log('Patient position on map:', patientPosition);
  // Demo ambulance location (simulated)
const [ambulancePosition, setAmbulancePosition] = useState(null);

useEffect(() => {
  if (!patientPosition) {
    setAmbulancePosition(null);
    return;
  }

  const target = patientPosition;

  setAmbulancePosition([
    target[0] + 0.003,
    target[1] + 0.003
  ]);

  const interval = setInterval(() => {
    setAmbulancePosition((current) => {
      if (!current) return target;

      return [
        current[0] + (target[0] - current[0]) * 0.15,
        current[1] + (target[1] - current[1]) * 0.15
      ];
    });
  }, 500);

  return () => clearInterval(interval);
}, [patientPosition?.[0], patientPosition?.[1]]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };
  const ambulanceArrived =
  patientPosition &&
  ambulancePosition &&
  Math.abs(patientPosition[0] - ambulancePosition[0]) < 0.0001 &&
  Math.abs(patientPosition[1] - ambulancePosition[1]) < 0.0001;


 

const handleSimulateGPS = () => {
  if (!navigator.geolocation) {
    alert('GPS is not supported by this browser.');
    return;
  }

  // Prevent multiple GPS tracking sessions.
  if (watchIdRef.current !== null) {
    navigator.geolocation.clearWatch(watchIdRef.current);
    watchIdRef.current = null;
  }

  setGpsSimulated(true);

  watchIdRef.current = navigator.geolocation.watchPosition(
    (position) => {
      const latitude = position.coords.latitude;
      console.log('LIVE GPS RECEIVED:', latitude, position.coords.longitude);
      const longitude = position.coords.longitude;

      const updatedLocation = `GPS Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

setFormData((prev) => ({
  ...prev,
  location: updatedLocation
}));

if (activeRequest) {
  updateEmergencyRequestLocation(
    activeRequest.id,
    updatedLocation
  );
}

   
    },
    (error) => {
      let message = 'Unable to update your location.';

      if (error.code === error.PERMISSION_DENIED) {
        message = 'Location permission denied. Please allow location access in your browser.';

        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current);
          watchIdRef.current = null;
        }
        setGpsSimulated(false);
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        message = 'Your current location is unavailable.';
      } else if (error.code === error.TIMEOUT) {
        message = 'Location request timed out. Waiting for another GPS update.';
      }

      alert(message);
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 1000
    }
  );
};



  const handleInitiateRequest = (e) => {
    e.preventDefault();
    const validation = validateEmergencyForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    createEmergencyRequest(formData);
  };

  const handleOpenCancel = (id) => {
    setTargetCancelId(id);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    if (targetCancelId) {
      cancelEmergencyRequest(targetCancelId);
      setTargetCancelId(null);
      setShowCancelModal(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Critical Safety Notice Banner */}
      <div className="bg-red-600 text-white rounded-3xl p-5 sm:p-6 shadow-lg shadow-red-600/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white text-red-600 flex items-center justify-center shrink-0 shadow-md">
              <PhoneCall className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider bg-red-800 text-red-100 px-2 py-0.5 rounded-full">
                  Real Emergency Hotline
                </span>
                <span className="text-xs font-bold text-red-200">National Dispatch</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black mt-0.5">
                Dial 112 for Real Immediate Emergencies
              </h2>
              <p className="text-xs text-red-100 max-w-xl leading-relaxed mt-1">
                Safe Meds is an academic college project prototype. The form below provides a simulated demonstration workflow only and does NOT contact real paramedics.
              </p>
            </div>
          </div>

          <a
            href="tel:112"
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white hover:bg-red-50 text-red-700 text-xs sm:text-sm font-black shadow-md flex items-center justify-center gap-2 shrink-0 transition-transform active:scale-95"
          >
            <Phone className="w-4 h-4 fill-current" />
            <span>Call 112 (India)</span>
          </a>
        </div>
      </div>

  

      {/* Active Simulation Status Tracker (if there's an ongoing demo request) */}
      {activeRequest && (
        <div className="bg-white rounded-3xl border-2 border-red-200 p-6 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
              <h3 className="text-base font-black text-slate-900">
                Active Simulation Request #{activeRequest.id}
              </h3>
            </div>
            <StatusBadge status={activeRequest.status} />
          </div>

          {/* Simulated Status Sequence */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <div
              className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                activeRequest.status === 'Demo Request Created' ||
                activeRequest.status === 'Awaiting Demo Confirmation' ||
                activeRequest.status === 'Demo Completed'
                  ? 'bg-teal-50 border-teal-200 text-teal-900'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0" />
              <div>
                <p className="text-xs font-bold">1. Demo Request Created</p>
                <p className="text-[10px] text-teal-700">Simulated details registered</p>
              </div>
            </div>

            <div
              className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                activeRequest.status === 'Awaiting Demo Confirmation' ||
                activeRequest.status === 'Demo Completed'
                  ? 'bg-teal-50 border-teal-200 text-teal-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <Clock className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-xs font-bold">2. Awaiting Confirmation</p>
                <p className="text-[10px] text-amber-700">Simulating mock response unit</p>
              </div>
            </div>

            <div
              className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                activeRequest.status === 'Demo Completed'
                  ? 'bg-teal-50 border-teal-200 text-teal-900'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" />
              <div>
                <p className="text-xs font-bold">3. Demo Completed</p>
                <p className="text-[10px] text-slate-500">Simulation completed safely</p>
              </div>
            </div>
          </div>

          
          {/* Emergency Contact Status */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-5 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">
              Emergency Contact Status
            </h3>

            {activeRequest.emergencyContacts?.length > 0 ? (
              activeRequest.emergencyContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {contact.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {contact.relationship}
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-green-700">
                    Saved
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No emergency contacts saved for this request.
              </p>
            )}

            <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
              <span className="font-medium text-gray-700">
                SMS Delivery
              </span>
              <span className="text-sm font-semibold text-orange-600">
                Not Connected
              </span>
            </div>
          </div>


          {/* Simulated Vehicle & Location Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Simulated Vehicle Details
              </span>
              <div className="flex items-center gap-3 mt-1.5">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Safe Meds Demo Unit #07 (Simulated)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Driver: Vikas Negi (Demo Paramedic) • UP 16 EM 9912
                  </p>
                </div>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Demo Location & ETA
              </span>
              <p className="text-xs font-bold text-slate-900 mt-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span className="truncate">{gpsLocation || activeRequest.location}</span>
              </p>
              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                Simulated Arrival: {activeRequest.eta}
              </p>
              {ambulanceArrived && (
  <p className="text-sm font-bold text-green-700 mt-2">
    🟢 Demo Ambulance Arrived at Patient Location
  </p>
)}
              <p className="text-[10px] text-amber-700 font-medium mt-1">
  Demo ETA only — no real ambulance has been dispatched.
</p>
            </div>
          </div>

          

{/* Interactive Patient GPS Map */}
<div className="rounded-2xl overflow-hidden mb-5 border border-teal-800">
  {patientPosition ? (
    <>
      <MapContainer
        center={patientPosition}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: '280px', width: '100%' }}
      >
        <UpdateMapCenter position={patientPosition} />
        <CurrentLocationButton position={patientPosition} />

       
{/* Satellite imagery */}
<TileLayer
  attribution='Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics'
  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  maxZoom={19}
/>

{/* Road names and place labels */}
<TileLayer
  attribution="Labels &copy; Esri"
  url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
  maxZoom={19}
/>


        <CircleMarker
          center={patientPosition}
          radius={10}
          pathOptions={{
            color: '#0f766e',
            fillColor: '#14b8a6',
            fillOpacity: 1
          }}
        >
          <Popup>Your current GPS location</Popup>
        </CircleMarker>

        {patientPosition && ambulancePosition && (
  <Polyline
    positions={[patientPosition, ambulancePosition]}
    pathOptions={{
      color: '#0d9488',
      weight: 4,
      opacity: 0.8,
      dashArray: '8, 8'
    }}
  />
)}

        {ambulancePosition && (
          <CircleMarker
            center={ambulancePosition}
            radius={9}
            pathOptions={{
              color: '#b91c1c',
              fillColor: '#ef4444',
              fillOpacity: 1
            }}
          >
            <Popup>Demo Ambulance (Simulated)</Popup>
          </CircleMarker>
        )}
      </MapContainer>

      <div className="flex flex-wrap gap-4 bg-teal-950 p-3 text-xs text-white">
        <span>🟢 Patient Location</span>
        <span>🔴 Demo Ambulance (Simulated)</span>
      </div>
    </>
  ) : (
    <div className="bg-teal-950/90 text-teal-200 p-6 text-center min-h-[140px] flex flex-col items-center justify-center">
      <MapPin className="w-8 h-8 mb-2" />
      <p className="font-semibold">Waiting for GPS Location</p>
      <p className="text-xs mt-1">
        Start Live GPS Tracking to display your location.
      </p>
    </div>
  )}
</div>


          {/* Teacher / Student Action Controls for Simulation */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  advanceEmergencyStatus(
                    activeRequest.id,
                    activeRequest.status === 'Demo Request Created'
                      ? 'Awaiting Demo Confirmation'
                      : 'Demo Completed'
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Advance Demo Status →
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleOpenCancel(activeRequest.id)}
              className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel Demo Request
            </button>
          </div>
        </div>
      )}

      {/* SOS Demonstration Submission Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Simulate SOS Emergency Request
              </h3>
              <p className="text-xs text-slate-500">
                Experience the patient emergency assistance demonstration
              </p>
            </div>
          </div>

          <Link
            to="/emergency/history"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200"
          >
            <History className="w-3.5 h-3.5" />
            <span>Emergency History</span>
          </Link>
        </div>

        <form onSubmit={handleInitiateRequest} className="space-y-4">
          {/* Emergency Category */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Emergency Category <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'General emergency', desc: 'Severe distress, fever, dizziness' },
                { id: 'Injury', desc: 'Fall, road sprain, fracture' },
                { id: 'Other urgent concern', desc: 'Immediate first-aid requirement' }
              ].map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setFormData((prev) => ({ ...prev, category: cat.id }))}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    formData.category === cat.id
                      ? 'border-red-500 bg-red-50 text-red-950 font-bold ring-2 ring-red-200'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <p className="text-xs font-bold">{cat.id}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{cat.desc}</p>
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="text-xs text-red-600 font-medium">{errors.category}</p>
            )}
          </div>

          {/* Location Field with Simulated GPS toggle */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">
                Demo Location / Address <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleSimulateGPS}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
              >
                <Compass className="w-3 h-3" />
                <span>Start Live GPS Tracking</span>
              </button>
              <div className="mt-2">
  {gpsSimulated ? (
    <p className="text-xs font-semibold text-green-600">
      🟢 Live GPS Tracking Active
    </p>
  ) : (
    <p className="text-xs font-semibold text-gray-500">
      ⚪ GPS Tracking Stopped
    </p>
  )}
</div>
<button
  type="button"
  onClick={() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setGpsSimulated(false);
      console.log('GPS tracking stopped');
      alert('Live GPS tracking stopped.');
    } else {
      setGpsSimulated(false);
      alert('Live GPS tracking is not currently active.');
    }
  }}
  className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-800 cursor-pointer"
>
  <span>Stop Live Tracking</span>
</button>
            </div>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter demo street address or landmark"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500"
              />
            </div>
            {errors.location && (
              <p className="text-xs text-red-600 font-medium">{errors.location}</p>
            )}
            <p className="text-[11px] text-slate-400">
              Demo location coordinates will be linked to simulated dispatch tracking.
            </p>
          </div>

          {/* Optional Emergency Contact */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Notify Saved Emergency Contact (Optional)
            </label>
            <select
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-600"
            >
              {emergencyContacts.map((contact) => (
                <option key={contact.id} value={`${contact.name} (${contact.phone})`}>
                  {contact.name} — {contact.relationship} ({contact.phone})
                </option>
              ))}
              <option value="None">Do not notify demo contact</option>
            </select>
          </div>

          {/* Additional Notes */}
          <FormField
            label="Additional Symptoms or Instructions (Optional)"
            name="additionalNotes"
            type="textarea"
            rows={2}
            value={formData.additionalNotes}
            onChange={handleChange}
            placeholder="e.g. Patient is conscious, sitting at ground floor gate."
          />

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-black shadow-lg shadow-red-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-5 h-5 animate-pulse" />
            <span>Submit Emergency Demo Request</span>
          </button>
        </form>
      </div>

      {/* Emergency Contact Quick Access Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <h4 className="text-sm font-bold text-slate-900 mb-3">
          Saved Emergency Contacts
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {emergencyContacts.map((contact) => (
            <div
              key={contact.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-slate-900">{contact.name}</p>
                <p className="text-[11px] text-slate-500">
                  {contact.relationship} • {contact.phone}
                </p>
              </div>
              <a
                href={`tel:${contact.phone}`}
                className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold flex items-center gap-1"
              >
                <Phone className="w-3 h-3" />
                <span>Call Demo</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Emergency Simulation"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-950">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>Simulated Prototype Notice</span>
            </div>
            <p>
              This is a student college prototype. No real emergency vehicle, hospital, or paramedic will be contacted.
            </p>
          </div>

          <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-500">Category:</span>
              <span className="font-bold text-slate-900">{formData.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Location:</span>
              <span className="font-bold text-slate-900 text-right max-w-[200px] truncate">
                {formData.location}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Contact:</span>
              <span className="font-bold text-slate-900">{formData.contactName}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowConfirmModal(false)}
              className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Go Back
            </button>
            <button
              type="button"
              onClick={handleConfirmSubmit}
              className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md cursor-pointer"
            >
              Confirm Demo Request
            </button>
          </div>
        </div>
      </Modal>

      {/* Cancel Request Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Emergency Simulation"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Are you sure you want to cancel this demonstration emergency request?
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowCancelModal(false)}
              className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Keep Active
            </button>
            <button
              type="button"
              onClick={handleConfirmCancel}
              className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
            >
              Cancel Request
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
