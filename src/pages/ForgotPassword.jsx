import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowLeft, HeartPulse, ShieldCheck } from 'lucide-react';
import { FormField } from '../components/FormField';
import { isValidEmail, isValidPhone } from '../utils/validation';

export const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please provide an email or phone number');
      return;
    }

    const val = identifier.trim();
    if (val.includes('@') && !isValidEmail(val)) {
      setError('Enter a valid email address');
      return;
    } else if (!val.includes('@') && !isValidPhone(val)) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }

    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-700 text-white flex items-center justify-center mb-3 shadow-md shadow-teal-700/20">
            <HeartPulse className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Reset Password
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Simulated account recovery for demonstration
          </p>
        </div>

        {isSent ? (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Reset Instructions Simulated
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
              In this prototype demonstration, simulated reset instructions have been dispatched to{' '}
              <strong>{identifier}</strong>. (No real email or SMS is sent).
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Registered Email or Mobile Number"
              name="identifier"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. manthan.demo@safemeds.internal"
              required
              error={error}
              helperText="Enter the contact information linked to your demo account"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-700/20 transition-all cursor-pointer"
            >
              {isLoading ? 'Sending Demo Instructions...' : 'Send Reset Instructions'}
            </button>

            <div className="pt-2 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-teal-700 font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Login</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
