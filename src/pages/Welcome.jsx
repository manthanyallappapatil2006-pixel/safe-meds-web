import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  UserCheck,
  Pill,
  ArrowRight,
  Sparkles,
  ChevronRight,
  HeartPulse,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Welcome = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { guestLogin } = useApp();
  const navigate = useNavigate();

  const slides = [
    {
      id: 0,
      title: 'Emergency Assistance',
      subtitle: 'Instant Simulated SOS & Emergency Preparedness',
      description:
        'Quick access to simulated emergency help, sample GPS coordinates, and real helpline guidelines (112 in India).',
      icon: ShieldAlert,
      badgeColor: 'bg-red-50 text-red-700 border-red-200',
      iconBg: 'bg-red-600 text-white',
      accent: 'from-red-500/10 to-rose-500/5'
    },
    {
      id: 1,
      title: 'Doctor Appointments',
      subtitle: 'Find Verified Healthcare Professionals',
      description:
        'Discover trusted doctors across 8+ medical specialties. Choose in-person clinic visits or online consultations with live slot booking.',
      icon: UserCheck,
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      iconBg: 'bg-blue-600 text-white',
      accent: 'from-blue-500/10 to-indigo-500/5'
    },
    {
      id: 2,
      title: 'Medicine Access',
      subtitle: 'Browse Local Pharmacies & Prescriptions',
      description:
        'Order essential medicines from neighborhood pharmacies, upload doctor prescriptions, and simulate door-to-door delivery tracking.',
      icon: Pill,
      badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
      iconBg: 'bg-teal-700 text-white',
      accent: 'from-teal-500/10 to-emerald-500/5'
    }
  ];

  const handleGuestAccess = () => {
    guestLogin();
    navigate('/home');
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      navigate('/home');
    }
  };

  const handleSkip = () => {
    navigate('/home');
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-teal-50/30 to-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Bar with Logo */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-700 to-teal-900 text-white flex items-center justify-center shadow-lg shadow-teal-900/15">
            <HeartPulse className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-slate-900">
                Safe<span className="text-teal-700">Meds</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                College Field Prototype
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Healthcare, All in One Place.
            </p>
          </div>
        </div>

        <button
          onClick={handleSkip}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-white/80 transition-colors cursor-pointer"
        >
          Skip Intro
        </button>
      </div>

      {/* Main Slide Card */}
      <div className="max-w-md w-full mx-auto my-auto py-6">
        <div
          className={`bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 bg-gradient-to-b ${slide.accent} transition-all duration-300`}
        >
          {/* Illustration / Icon Box */}
          <div className="flex justify-center mb-6">
            <div
              className={`w-24 h-24 rounded-3xl flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-105 ${slide.iconBg}`}
            >
              <Icon className="w-12 h-12" />
            </div>
          </div>

          <div className="text-center mb-6">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mb-2 ${slide.badgeColor}`}
            >
              {slide.subtitle}
            </span>
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              {slide.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {slide.description}
            </p>
          </div>

          {/* Slide Indicator Dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx
                    ? 'w-8 bg-teal-700'
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Slide Step Button */}
          <div className="flex items-center gap-3">
            {currentSlide < slides.length - 1 ? (
              <button
                onClick={handleNext}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-700/20 transition-all cursor-pointer"
              >
                <span>Next Feature</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-700/20 transition-all cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Actions: Sign In, Register, Guest Access */}
      <div className="max-w-md w-full mx-auto space-y-3 pt-4">
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/login"
            className="flex items-center justify-center py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-bold shadow-xs transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="flex items-center justify-center py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-colors"
          >
            Create Account
          </Link>
        </div>

        <button
          onClick={handleGuestAccess}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Continue as Guest Demo (Teacher / Evaluator Mode)</span>
        </button>

        <p className="text-[11px] text-center text-slate-500">
          Academic prototype for college field evaluation • Real emergencies call 112
        </p>
      </div>
    </div>
  );
};
