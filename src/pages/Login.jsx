
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  HeartPulse,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  UserRound,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  authService,
  profileService,
  isSupabaseConfigured,
} from '../services/supabase';

export const Login = () => {
  const [loginType, setLoginType] = useState('user');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const { login, guestLogin } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/home';

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setAuthError('');
  };

  const handleLoginTypeChange = (type) => {
    if (type === 'admin') {
      navigate('/admin-login');
      return;
    }

    setLoginType('user');
    setAuthError('');
    setIsSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    const email = formData.email.trim();
    const password = formData.password;

    if (!email || !email.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setAuthError('');

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await authService.signIn({
          email,
          password,
        });

        if (error || !data?.user) {
          setAuthError(
            error?.message ||
            'Login failed. Please check your credentials.'
          );
          setIsLoading(false);
          return;
        }

        const { profile } = await profileService.getProfile(
          data.user.id
        );

        login({
          id: data.user.id,
          email: data.user.email,
          name:
            profile?.full_name ||
            data.user.user_metadata?.full_name ||
            data.user.email?.split('@')[0] ||
            'User',
          phone:
            profile?.phone ||
            data.user.user_metadata?.phone ||
            '',
          city: profile?.city || '',
          isGuest: false,
          role: 'user',
        });
      } else {
        login({
          email,
          name:
            email
              .split('@')[0]
              .replace(/[._-]/g, ' ')
              .replace(/\b\w/g, (c) => c.toUpperCase()) ||
            'Demo User',
          phone: '',
          city: '',
          isGuest: false,
          role: 'user',
        });
      }

      setIsSuccess(true);

      setTimeout(() => {
        navigate(from, { replace: true });
      }, 800);
    } catch (err) {
      console.error('Login error:', err);

      setAuthError(
        'An unexpected error occurred. Please try again.'
      );

      setIsLoading(false);
    }
  };

  const handleGuest = () => {
    guestLogin();
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl">

        <div className="mb-5">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-700 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to role selection
          </Link>
        </div>

        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-700 text-white flex items-center justify-center mb-3 shadow-md">
            <HeartPulse className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-black text-slate-900">
            Welcome to Safe Meds
          </h1>

          <p className="text-xs text-slate-500 mt-2">
            Choose your login type to continue
          </p>
        </div>

        {/* User and Admin login options */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            type="button"
            onClick={() => handleLoginTypeChange('user')}
            className="rounded-xl border border-teal-700 bg-teal-50 text-teal-800 ring-1 ring-teal-700 p-3 text-sm font-bold flex flex-col items-center gap-2"
          >
            <UserRound className="w-6 h-6" />
            User Login
            <span className="text-[10px] font-normal">
              Patients and users
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleLoginTypeChange('admin')}
            className="rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 p-3 text-sm font-bold flex flex-col items-center gap-2"
          >
            <ShieldCheck className="w-6 h-6" />
            Admin Login
            <span className="text-[10px] font-normal">
              Administrators
            </span>
          </button>
        </div>

        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-900">
            User Sign In
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Access appointments, medicines and healthcare services.
          </p>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
            <strong className="block mb-1">
              Demo Mode Active
            </strong>
            Use a demo email and a password of at least 6 characters.
            No real account is authenticated.
          </div>
        )}

        {authError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {isSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Signed in successfully! Redirecting...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <label
              htmlFor="login-email"
              className="block text-xs font-semibold text-slate-700"
            >
              Email Address *
            </label>

            <input
              id="login-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="w-full px-3 py-3 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-600"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold text-slate-700"
            >
              Password *
            </label>

            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="w-full px-3 py-3 pr-10 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-600"
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={
                  showPassword ? 'Hide password' : 'Show password'
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end text-xs">
            <Link
              to="/forgot-password"
              className="text-teal-700 hover:text-teal-900 font-semibold"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            id="login-submit"
            type="submit"
            disabled={isLoading || isSuccess}
            className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-sm font-bold shadow-md transition-all"
          >
            {isLoading ? 'Signing in...' : 'Sign In as User'}
          </button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>

          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-slate-400">
              or explore freely
            </span>
          </div>
        </div>

        <button
          type="button"
          id="login-guest"
          onClick={handleGuest}
          className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          Continue as Guest / Demo
        </button>

        <p className="mt-5 text-center text-xs text-slate-600">
          New to Safe Meds?{' '}
          <Link
            to="/register"
            className="text-teal-700 font-bold hover:underline"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
