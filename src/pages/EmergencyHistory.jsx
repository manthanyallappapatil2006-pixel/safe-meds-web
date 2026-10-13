import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Clock, MapPin, CheckCircle2, History } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { useApp } from '../context/AppContext';

export const EmergencyHistory = () => {
  const { emergencyHistory } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/emergency"
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Emergency Simulation History
            </h1>
            <p className="text-xs text-slate-500">
              Log of all demonstration SOS emergency requests
            </p>
          </div>
        </div>

        <Link
          to="/emergency"
          className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs"
        >
          New SOS Demo
        </Link>
      </div>

      {emergencyHistory.length === 0 ? (
        <EmptyState
          icon={ShieldAlert}
          title="No emergency records"
          description="You haven't simulated any emergency requests yet."
          actionText="Simulate SOS Request"
          onAction={() => window.location.href = '#/emergency'}
        />
      ) : (
        <div className="space-y-3">
          {emergencyHistory.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-900">
                    Request #{item.id}
                  </span>
                  <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                    {item.category}
                  </span>
                </div>
                <StatusBadge status={item.status} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 mb-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Location
                    </span>
                    <span className="text-slate-800 font-medium">{item.location}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Logged At & Status Note
                    </span>
                    <span className="text-slate-800 font-medium">
                      {item.createdAt} • {item.eta || 'Simulated'}
                    </span>
                  </div>
                </div>
              </div>

              {item.additionalNotes && (
                <p className="text-xs text-slate-500 italic mb-2">
                  Note: "{item.additionalNotes}"
                </p>
              )}

              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100">
                <span>Emergency contact: {item.emergencyContact || 'Default Primary'}</span>
                <span className="text-slate-500 font-medium">Academic demo entry</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
