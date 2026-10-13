import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = ({ message = 'Loading healthcare information...', className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center ${className}`}>
      <Loader2 className="w-8 h-8 text-teal-700 animate-spin mb-3" />
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
};
