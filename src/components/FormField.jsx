import React from 'react';
import { AlertCircle } from 'lucide-react';

export const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helperText,
  disabled = false,
  children,
  className = '',
  rows = 3
}) => {
  const hasError = Boolean(error);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-xs font-semibold text-slate-700 tracking-wide"
        >
          {label}
          {required && <span className="text-red-500 ml-1" title="Required field">*</span>}
        </label>
      )}

      {children ? (
        children
      ) : type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3 py-2 text-sm rounded-lg border bg-white text-slate-900 transition-colors focus:outline-none focus:ring-2 ${
            hasError
              ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
              : 'border-slate-300 focus:border-teal-600 focus:ring-teal-100'
          } ${disabled ? 'bg-slate-100 cursor-not-allowed opacity-75' : ''}`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3 py-2 text-sm rounded-lg border bg-white text-slate-900 transition-colors focus:outline-none focus:ring-2 ${
            hasError
              ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
              : 'border-slate-300 focus:border-teal-600 focus:ring-teal-100'
          } ${disabled ? 'bg-slate-100 cursor-not-allowed opacity-75' : ''}`}
        />
      )}

      {hasError && (
        <p className="flex items-center gap-1 text-xs text-red-600 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}

      {!hasError && helperText && (
        <p className="text-[11px] text-slate-500">{helperText}</p>
      )}
    </div>
  );
};
