import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const ServiceCard = ({
  icon: Icon,
  title,
  description,
  buttonText,
  to,
  variant = 'teal'
}) => {
  const isEmergency = variant === 'emergency';
  const isBlue = variant === 'blue';

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 sm:p-6 transition-all hover:shadow-lg flex flex-col justify-between ${
        isEmergency
          ? 'bg-gradient-to-br from-red-50 to-rose-50/70 border-red-200'
          : isBlue
          ? 'bg-gradient-to-br from-blue-50 to-indigo-50/70 border-blue-200'
          : 'bg-gradient-to-br from-teal-50 to-emerald-50/70 border-teal-200'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xs ${
              isEmergency
                ? 'bg-red-600 text-white'
                : isBlue
                ? 'bg-blue-600 text-white'
                : 'bg-teal-700 text-white'
            }`}
          >
            <Icon className="w-6 h-6" />
          </div>
          {isEmergency && (
            <span className="text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-800 px-2 py-0.5 rounded-full border border-red-200">
              Immediate Help
            </span>
          )}
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">
          {title}
        </h3>
        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          {description}
        </p>
      </div>

      <Link
        to={to}
        className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
          isEmergency
            ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20 active:scale-98'
            : isBlue
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 active:scale-98'
            : 'bg-teal-700 hover:bg-teal-800 text-white shadow-teal-500/20 active:scale-98'
        }`}
      >
        <span>{buttonText}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};
