import React from 'react';
import { HeartPulse } from 'lucide-react';

/**
 * AuthLoadingScreen — shown while the app is checking for a persisted
 * authentication session (e.g. Supabase auto-refresh on page load).
 */
export const AuthLoadingScreen = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-700 to-teal-900 text-white flex items-center justify-center shadow-xl animate-pulse">
        <HeartPulse className="w-9 h-9" />
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-slate-700">Safe<span className="text-teal-700">Meds</span></p>
        <p className="text-xs text-slate-400 mt-0.5">Verifying session…</p>
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
};

export default AuthLoadingScreen;
