import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Video,
  Award,
  Calendar,
  Languages,
  CheckCircle2,
  ShieldCheck,
  Building2,
  AlertCircle
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { formatCurrency } from '../utils/formatting';
import { useApp } from '../context/AppContext';

export const DoctorDetails = () => {
  const { doctorId } = useParams();
  const { doctors } = useApp();
  const navigate = useNavigate();

  const doctor = doctors.find((d) => d.id === doctorId);

  if (!doctor) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 bg-white rounded-3xl border border-slate-200">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 mb-1">Doctor Not Found</h2>
        <p className="text-xs text-slate-500 mb-5">
          The requested doctor profile "{doctorId}" does not exist in the dataset.
        </p>
        <Link
          to="/doctors"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Doctor Directory</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Back button */}
      <div>
        <Link
          to="/doctors"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Doctors</span>
        </Link>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="relative shrink-0">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover ring-4 ring-slate-100 shadow-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300';
              }}
            />
            <span className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-900 text-xs font-black px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-xs">
              <Star className="w-3 h-3 fill-current" />
              {doctor.rating} ({doctor.reviewsCount})
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  doctor.verificationStatus === 'Verified'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-current" />
                {doctor.verificationStatus}
              </span>
              <StatusBadge status={doctor.sampleAvailability} />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                ID: {doctor.id}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
              {doctor.name}
            </h1>
            <p className="text-sm font-bold text-teal-700 mb-1">
              {doctor.specialty}
            </p>
            <p className="text-xs text-slate-500 mb-3">
              {doctor.qualification} • {doctor.experience}
            </p>

            {doctor.registrationNumber && (
              <p className="text-xs text-slate-600 font-mono bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 mb-3 inline-block">
                <strong>Medical Council Reg:</strong> {doctor.registrationNumber}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-slate-700 leading-snug">
                  <strong>{doctor.hospitalName || 'Clinic'}:</strong> {doctor.clinicAddress} ({doctor.city})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-700">Languages: {doctor.languages?.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Booking Action Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 font-medium block">
              Consultation Fee
            </span>
            <span className="text-2xl font-black text-slate-900">
              {formatCurrency(doctor.consultationFee)}
            </span>
            <span className="text-xs text-slate-500 ml-1.5">/ session (In-person or Video)</span>
          </div>

          <Link
            to={`/appointments/book/${doctor.id}`}
            className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-700/20 transition-all active:scale-98"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment Slot</span>
          </Link>
        </div>
      </div>

      {/* Details Sections: Bio, Consultation Types, Sample Available Slots */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Biography */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              About Doctor
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              {doctor.bio}
            </p>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
              <strong>Demonstration Prototype Note:</strong> This doctor profile is created for college field project evaluation. All clinic slots and registration numbers represent simulated demonstration records.
            </div>
          </div>

          {/* Consultation Types */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Consultation Formats
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">In-Person Clinic Visit</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Visit {doctor.hospitalName || 'Clinic'} at {doctor.clinicAddress}.
                  </p>
                </div>
              </div>

              {doctor.consultationTypes.includes('Online consultation') && (
                <div className="p-3.5 rounded-2xl border border-blue-200 bg-blue-50/60 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-blue-950">Online Video Consultation</h4>
                    <p className="text-[11px] text-blue-800 mt-0.5">
                      Consult from your home with instant digital prescription summary.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Available Time Slots Preview */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Sample Slots Today
              </h3>
              <Clock className="w-4 h-4 text-teal-700" />
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Regular operating hours: 9:00 AM – 7:00 PM
            </p>

            <div className="space-y-2">
              {doctor.availableSlots.map((slot) => (
                <div
                  key={slot}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700"
                >
                  <span>{slot}</span>
                  <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                    Available
                  </span>
                </div>
              ))}
            </div>

            <Link
              to={`/appointments/book/${doctor.id}`}
              className="mt-5 w-full block text-center py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors"
            >
              Select Slot & Book
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
