import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Home, ArrowLeft, Search, ShieldAlert, UserCheck, Pill } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-lg">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
          <HeartPulse className="w-10 h-10" />
        </div>

        <span className="text-4xl font-black text-teal-800 block mb-1">404</span>
        <h1 className="text-xl font-bold text-slate-900 mb-2">
          Healthcare Route Not Found
        </h1>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          The requested page or medical record does not exist in the Safe Meds prototype system.
        </p>

        <div className="grid grid-cols-3 gap-2 mb-6">
          <Link
            to="/emergency"
            className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors"
          >
            <ShieldAlert className="w-4 h-4 mx-auto mb-1" />
            <span>SOS 112</span>
          </Link>
          <Link
            to="/doctors"
            className="p-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition-colors"
          >
            <UserCheck className="w-4 h-4 mx-auto mb-1" />
            <span>Doctors</span>
          </Link>
          <Link
            to="/medicines"
            className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors"
          >
            <Pill className="w-4 h-4 mx-auto mb-1" />
            <span>Medicines</span>
          </Link>
        </div>

        <Link
          to="/home"
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-md shadow-teal-700/20 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Return to Home Dashboard</span>
        </Link>
      </div>
    </div>
  );
};
