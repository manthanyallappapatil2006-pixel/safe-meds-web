import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Video, UserCheck, Calendar, Clock, Award, ShieldCheck, Languages } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { formatCurrency } from '../utils/formatting';

export const DoctorCard = ({ doctor }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start gap-3.5 mb-3">
          <div className="relative shrink-0">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-teal-200 transition-all"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300';
              }}
            />
            <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-900 text-[10px] font-black px-1.5 py-0.2 rounded-md flex items-center gap-0.5 shadow-xs">
              <Star className="w-2.5 h-2.5 fill-current" />
              {doctor.rating}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                {doctor.name}
              </h4>
            </div>
            <p className="text-xs font-semibold text-teal-700 mb-0.5">
              {doctor.specialty}
            </p>
            <p className="text-[11px] text-slate-500 truncate mb-1">
              {doctor.qualification} • {doctor.experience}
            </p>

            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  doctor.verificationStatus === 'Verified'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : doctor.verificationStatus === 'Pending Verification'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <ShieldCheck className="w-3 h-3 text-current" />
                {doctor.verificationStatus}
              </span>
              <StatusBadge status={doctor.sampleAvailability} />
            </div>
          </div>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600 mb-4">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              <strong>{doctor.city}:</strong> {doctor.hospitalName || doctor.clinicAddress}
            </span>
          </div>

          {doctor.registrationNumber && (
            <p className="text-[10px] text-slate-400 font-mono truncate">
              Reg: {doctor.registrationNumber}
            </p>
          )}

          {doctor.languages && (
            <div className="flex items-center gap-1 text-[10px] text-slate-500">
              <Languages className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{doctor.languages.join(', ')}</span>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 text-xs pt-1.5">
            <div className="flex items-center gap-1.5">
              {doctor.consultationTypes.includes('Online consultation') ? (
                <span className="inline-flex items-center gap-1 text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md font-medium">
                  <Video className="w-3 h-3" /> Online & Clinic
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                  Clinic Visit Only
                </span>
              )}
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block -mb-0.5">Consultation Fee</span>
              <span className="text-sm font-black text-slate-900">
                {formatCurrency(doctor.consultationFee)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
        <Link
          to={`/doctors/${doctor.id}`}
          className="w-full text-center py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          View Profile
        </Link>
        <Link
          to={`/appointments/book/${doctor.id}`}
          className="w-full text-center py-2 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-colors"
        >
          Book Slot
        </Link>
      </div>
    </div>
  );
};
