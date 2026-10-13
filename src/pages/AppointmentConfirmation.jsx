import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Calendar, Clock, MapPin, User, ArrowRight, Home } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { formatCurrency, formatDate } from '../utils/formatting';
import { useApp } from '../context/AppContext';

export const AppointmentConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { appointments } = useApp();

  // If passed in navigation state, use that, else fallback to latest appointment
  const appointment = location.state?.appointment || appointments[0];

  if (!appointment) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 bg-white rounded-3xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 mb-2">No Booking Record</h2>
        <p className="text-xs text-slate-500 mb-5">
          Please book an appointment to see the confirmation details.
        </p>
        <Link
          to="/doctors"
          className="px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold"
        >
          Explore Doctors
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-4 pb-16">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-lg text-center">
        {/* Animated / styled success icon */}
        <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 ring-8 ring-emerald-50/50">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 mb-2">
          Demo Booking Confirmed
        </span>

        <h1 className="text-2xl font-black text-slate-900 mb-1">
          Appointment Scheduled!
        </h1>
        <p className="text-xs text-slate-500 mb-6">
          Your demo appointment has been successfully recorded in your Safe Meds schedule.
        </p>

        {/* Appointment Card */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-3.5 mb-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">
                Booking Reference
              </span>
              <span className="text-sm font-black text-slate-900">
                #{appointment.id}
              </span>
            </div>
            <StatusBadge status={appointment.status} />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Doctor:</span>
              <span className="font-bold text-slate-900">{appointment.doctorName}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Specialty:</span>
              <span className="font-medium text-teal-800">{appointment.specialty}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Patient:</span>
              <span className="font-semibold text-slate-800">{appointment.patientName}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Date & Slot:</span>
              <span className="font-bold text-slate-900">
                {formatDate(appointment.appointmentDate)} at {appointment.appointmentTime}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Consultation Type:</span>
              <span className="font-semibold text-slate-800">{appointment.consultationType}</span>
            </div>

            <div className="flex justify-between pt-2 border-t border-slate-200">
              <span className="text-slate-500">Estimated Fee:</span>
              <span className="font-black text-slate-900">{formatCurrency(appointment.fee)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to="/appointments"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-md shadow-teal-700/20 transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>View All Appointments</span>
          </Link>

          <Link
            to="/home"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
