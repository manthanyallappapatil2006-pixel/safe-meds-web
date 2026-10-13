
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ShieldCheck,
    Eye,
    EyeOff,
    ArrowLeft,
    AlertCircle,
    HeartPulse,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const DEMO_ADMIN_EMAIL = 'admin@safemeds.demo';
const DEMO_ADMIN_PASSWORD = 'SafeMeds@123';

export const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useApp();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password) {
            setError('Please enter your admin email and password.');
            return;
        }

        setLoading(true);

        // Demo-only credential check. Not secure for production use.
        if (
            email.trim().toLowerCase() !== DEMO_ADMIN_EMAIL ||
            password !== DEMO_ADMIN_PASSWORD
        ) {
            setError('Invalid demo admin email or password.');
            setLoading(false);
            return;
        }

        try {
            login({
                id: 'demo-admin',
                email: DEMO_ADMIN_EMAIL,
                name: 'Safe Meds Administrator',
                phone: '',
                city: '',
                isGuest: false,
                role: 'admin',
            });

            navigate('/admin-demo', { replace: true });
        } catch (err) {
            console.error('Demo admin login error:', err);
            setError('Unable to sign in. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl p-7 sm:p-9 shadow-2xl">
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-700 mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to User Login
                </Link>

                <div className="text-center mb-7">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-teal-700 text-white flex items-center justify-center mb-4">
                        <ShieldCheck className="w-9 h-9" />
                    </div>

                    <h1 className="text-2xl font-black text-slate-900">
                        Admin Login
                    </h1>

                    <p className="text-sm text-slate-500 mt-2">
                        Safe Meds Administration Portal
                    </p>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 mb-5 text-xs text-amber-900">
                    <strong>Demo mode only.</strong>
                    <p className="mt-1">
                        Use the sample credentials below for your college presentation.
                        This login does not provide real administrator security.
                    </p>
                </div>

                {error && (
                    <div className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 p-3 mb-4 text-sm text-red-700">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="admin-email"
                            className="block text-sm font-semibold text-slate-700 mb-2"
                        >
                            Administrator Email
                        </label>

                        <input
                            id="admin-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@safemeds.demo"
                            autoComplete="username"
                            required
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-700"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="admin-password"
                            className="block text-sm font-semibold text-slate-700 mb-2"
                        >
                            Password
                        </label>

                        <div className="relative">
                            <input
                                id="admin-password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter demo password"
                                autoComplete="current-password"
                                required
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-700"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((value) => !value)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-60 text-white font-bold py-3 transition-colors"
                    >
                        {loading ? 'Signing in...' : 'Sign In as Admin'}
                    </button>
                </form>

                <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm">
                    <p className="font-semibold text-slate-700 mb-2">
                        Sample credentials
                    </p>
                    <p className="text-slate-600">
                        Email: <strong>{DEMO_ADMIN_EMAIL}</strong>
                    </p>
                    <p className="text-slate-600">
                        Password: <strong>{DEMO_ADMIN_PASSWORD}</strong>
                    </p>
                </div>

                <div className="mt-7 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                    <HeartPulse className="w-4 h-4 text-teal-700" />
                    Safe Meds Administration
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
