import React from 'react';
import { FolderOpen } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No records found',
  description = 'There is currently no data to display for this view.',
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div className={`p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300 max-w-md mx-auto my-6 ${className}`}>
      <div className="w-14 h-14 mx-auto mb-3.5 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shadow-xs">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="text-base font-bold text-slate-800 mb-1">{title}</h4>
      <p className="text-xs text-slate-500 mb-5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-lg bg-teal-700 hover:bg-teal-800 text-white shadow-xs transition-colors cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
