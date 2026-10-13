import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  let bg = 'bg-slate-900 text-white';
  let Icon = Info;

  if (toast.type === 'success') {
    bg = 'bg-teal-900 text-teal-50 border border-teal-700';
    Icon = CheckCircle2;
  } else if (toast.type === 'error') {
    bg = 'bg-red-900 text-red-50 border border-red-700';
    Icon = AlertCircle;
  } else if (toast.type === 'warning') {
    bg = 'bg-amber-900 text-amber-50 border border-amber-700';
    Icon = AlertTriangle;
  } else if (toast.type === 'info') {
    bg = 'bg-blue-900 text-blue-50 border border-blue-700';
    Icon = Info;
  }

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-300">
      <div className={`flex items-start gap-3 p-4 rounded-xl shadow-xl ${bg}`}>
        <Icon className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="flex-1 text-xs font-medium leading-relaxed">
          {toast.message}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded transition-colors text-white/70 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
