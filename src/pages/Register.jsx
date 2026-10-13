import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartPulse, CheckCircle2, Sparkles, ArrowRight, UserPlus, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { FormField } from '../components/FormField';
import { validateRegisterForm } from '../utils/validation';
import { useApp } from '../context/AppContext';
import { authService, profileService, isSupabaseConfigured } from '../services/supabase';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dob: '',
    gender: 'Prefer not to say',
    city: 'Noida',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [authError, setAuthError] = useState('');
  const [requiresEmailVerification, setRequiresEmailVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { login, guestLogin } = useApp();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const validation = validateRegisterForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    setAuthError('');

    // ── Supabase real registration ────────────────────────────────
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await authService.signUp({
          email: formData.email,
          password: formData.password,
          fullName: formData.name,
          phone: formData.phone,
          city: formData.city
        });

        if (error) {
          if (error.message?.toLowerCase().includes('already registered') ||
              error.message?.toLowerCase().includes('user already exists')) {
            setAuthError('An account with this email already exists. Please sign in instead.');
          } else if (error.message?.toLowerCase().includes('password')) {
            setAuthError(error.message);
          } else {
            setAuthError(error.message || 'Registration failed. Please try again.');
          }
          setIsLoading(false);
          return;
        }

        // Check if email confirmation is required
        const needsEmailConfirm =
          data?.user && !data.user.confirmed_at && !data.user.email_confirmed_at;

        if (needsEmailConfirm) {
          setRequiresEmailVerification(true);
        } else {
          // Auto-confirmed (e.g. email confirmation disabled in Supabase)
          login({
            id: data.user?.id,
            email: formData.email,
            name: formData.name,
            phone: formData.phone,
            city: formData.city,
            isGuest: false
          });
        }

        setIsLoading(false);
        setIsRegistered(true);
      } catch (err) {
        console.error('Registration error:', err);
        setAuthError('An unexpected error occurred. Please try again.');
        setIsLoading(false);
      }
      return;
    }

    // ── Demo fallback (Supabase not configured) ───────────────────
    setTimeout(() => {
      setIsLoading(false);
      setIsRegistered(true);
      login({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city
      });
    }, 700);
  };

  const handleGuest = () => {
    guestLogin();
    navigate('/home');
  };

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-xl text-center">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            {requiresEmailVerification ? 'Check Your Email!' : 'Account Created!'}
          </h2>
          <p className="text-xs text-slate-600 mb-6 leading-relaxed">
            {requiresEmailVerification
              ? `We've sent a verification link to ${formData.email}. Please check your inbox and click the link to activate your Safe Meds account.`
              : `Welcome to Safe Meds, `
            }
            {!requiresEmailVerification && <strong>{formData.name}</strong>}
            {!requiresEmailVerification && `. Your account is ready.`}
          </p>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/home')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <span>Go to Home Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/login"
              className="block w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Return to Login Screen
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-8">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl">
        {/* Back link */}
        <div className="mb-5">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to role selection
          </Link>
        </div>

        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-700 text-white flex items-center justify-center mb-3 shadow-md shadow-teal-700/20">
            <HeartPulse className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Create Safe Meds Account
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Sign up for seamless emergency support, doctor visits, and pharmacy access
          </p>
        </div>

        {/* Demo notice */}
        {!isSupabaseConfigured && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
            <span className="font-bold block mb-0.5">Demo Mode Active</span>
            Supabase is not configured. Registration will create a local demo session only.
          </div>
        )}

        {/* Auth error */}
        {authError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Manthan Sharma"
            required
            error={errors.name}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="patient@example.com"
              required
              error={errors.email}
            />

            <FormField
              label="Mobile Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. 9876543210"
              required
              error={errors.phone}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 6 characters"
              required
              error={errors.password}
            />

            <FormField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat password"
              required
              error={errors.confirmPassword}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormField
              label="Date of Birth (Optional)"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Gender (Optional)
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-600"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <FormField
              label="City (Optional)"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Noida, Delhi"
            />
          </div>

          {/* Terms checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="mt-0.5 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
              />
              <span className="text-xs text-slate-600 leading-tight">
                I accept the{' '}
                <Link to="/terms" className="text-teal-700 font-bold underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-teal-700 font-bold underline">
                  Privacy Policy
                </Link>
                . I acknowledge this is an academic field demonstration prototype.
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="text-xs text-red-600 font-medium mt-1">{errors.agreeTerms}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-700/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isLoading ? 'Creating Demo Account...' : 'Create Account'}</span>
          </button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-slate-400">or explore freely</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGuest}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Continue as Guest Demo</span>
        </button>

        <p className="mt-5 text-center text-xs text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-700 font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
