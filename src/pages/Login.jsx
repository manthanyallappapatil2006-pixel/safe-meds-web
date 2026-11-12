import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  HeartPulse,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';
import { isSupabaseConfigured } from '../services/supabase';

export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [oauthNotice, setOauthNotice] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const { login, guestLogin } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/home';

  // Load remembered email on mount
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem('safemeds_remembered_email');
      if (savedEmail) {
        setFormData((prev) => ({ ...prev, email: savedEmail, rememberMe: true }));
      }
    } catch (_) {}
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setAuthError('');
    setOauthNotice('');
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
    setOauthNotice('');

    try {
      // Save or remove remembered email
      if (formData.rememberMe) {
        localStorage.setItem('safemeds_remembered_email', email);
      } else {
        localStorage.removeItem('safemeds_remembered_email');
      }

      const res = await authService.login({ email, password });

      if (res.error) {
        // Fallback for local demo if neither backend nor supabase is active
        if (!isSupabaseConfigured && !import.meta.env.VITE_API_BASE_URL) {
          login({
            id: 'usr_' + Date.now(),
            email,
            name: email.split('@')[0].replace(/[._-]/g, ' '),
            role: 'user',
            isGuest: false,
          });
          setIsSuccess(true);
          setTimeout(() => navigate(from, { replace: true }), 700);
          return;
        }

        setAuthError(res.error.message || 'Login failed. Please check your credentials.');
        setIsLoading(false);
        return;
      }

      if (res.data?.user) {
        const u = res.data.user;
        login({
          id: u.id,
          email: u.email,
          name: u.fullName || u.user_metadata?.full_name || u.email?.split('@')[0] || 'User',
          phone: u.phone || u.user_metadata?.phone || '',
          city: u.city || '',
          role: 'user',
          isGuest: false,
        });
      }

      setIsSuccess(true);
      setTimeout(() => navigate(from, { replace: true }), 700);
    } catch (err) {
      console.error('Login error:', err);
      setAuthError('An unexpected authentication error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setAuthError('');
    setOauthNotice('');

    try {
      const res = await authService.signInWithGoogle();
      if (res.error) {
        setOauthNotice(res.error.message);
      }
    } catch (err) {
      setOauthNotice('Google Sign-In failed to initialize. Please check network or provider settings.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGuest = () => {
    guestLogin();
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-700 text-white flex items-center justify-center mb-3 shadow-md">
            <HeartPulse className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-black text-slate-900">
            Safe<span className="text-teal-700">Meds</span>
          </h1>

          <p className="text-xs text-slate-500 mt-1">
            Patient & User Account Sign In
          </p>
        </div>

        {/* Demo Mode Notice */}
        {!isSupabaseConfigured && !import.meta.env.VITE_API_BASE_URL && (
          <div className="mb-5 p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block">Development / Demo Mode</strong>
              Enter your email and any 6+ character password to explore all patient features.
            </div>
          </div>
        )}

        {/* Error message */}
        {authError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {/* OAuth setup guidance message */}
        {oauthNotice && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2 leading-relaxed">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block mb-0.5">OAuth Configuration Required:</strong>
              {oauthNotice}
            </div>
          </div>
        )}

        {/* Success message */}
        {isSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Signed in successfully! Redirecting to Safe Meds...</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <label
              htmlFor="login-email"
              className="block text-xs font-semibold text-slate-700"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="login-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="patient@example.com"
              autoComplete="email"
              required
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold text-slate-700"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password (min 6 chars)"
                autoComplete="current-password"
                required
                className="w-full px-3.5 py-2.5 pr-10 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
              />
              <span>Remember me</span>
            </label>

            <Link
              to="/forgot-password"
              className="text-teal-700 hover:text-teal-900 font-semibold"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit button */}
          <button
            id="login-submit"
            type="submit"
            disabled={isLoading || isSuccess}
            className="w-full py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              'Sign In as User'
            )}
          </button>
        </form>

        {/* Google OAuth Button */}
        <div className="mt-4">
          <button
            id="btn-google-signin"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2.5 transition-colors shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isGoogleLoading ? 'Connecting Google...' : 'Continue with Google'}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-slate-400">or explore freely</span>
          </div>
        </div>

        {/* Guest access */}
        <button
          type="button"
          id="login-guest"
          onClick={handleGuest}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          Continue as Guest / Demo
        </button>

        {/* Register link */}
        <p className="mt-5 text-center text-xs text-slate-600">
          New to Safe Meds?{' '}
          <Link to="/register" className="text-teal-700 font-bold hover:underline">
            Create an Account
          </Link>
        </p>

        {/* Separate Admin Portal Link */}
        <div className="mt-5 pt-4 border-t border-slate-100 text-center">
          <Link
            to="/admin-login"
            className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-800 font-semibold transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Administrator Access Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
