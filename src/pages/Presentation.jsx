import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Award,
  CheckCircle2,
  Database,
  Layers,
  Code2,
  Clock,
  Sparkles,
  ShieldAlert,
  UserCheck,
  Pill,
  Bot,
  SlidersHorizontal,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

export const Presentation = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const featureMatrix = [
    { name: 'Indian Doctor Directory (10 Cities, 10 Specialties)', status: 'Working Demo', desc: 'Search & filter doctors in Mumbai, Pune, Kolhapur, Delhi, etc.' },
    { name: 'Doctor Consultation Booking (In-Person / Online)', status: 'Working Demo', desc: 'Live slot selection, validation, duplicate prevention & reschedule' },
    { name: 'SOS Emergency Simulation (112 Guidance)', status: 'Working Demo', desc: 'GPS logging demo, assigned emergency vehicle, national 112 hotline' },
    { name: 'Pharmacy Directory & Medicine Catalog', status: 'Working Demo', desc: 'OTC vs Rx medications, stock status, and indicative pricing in ₹' },
    { name: 'Prescription Upload & Verification Flow', status: 'Working Demo', desc: 'File type/size check, temporary in-memory preview, demo approval queue' },
    { name: 'Interactive Cart & Order Pipeline (5 Stages)', status: 'Working Demo', desc: 'Quantity adjustments, coupon SAFEMEDS10, interactive status stepper' },
    { name: 'Aarogya AI Healthcare Guide (EN, HI, MR)', status: 'Working Demo', desc: 'Multilingual educational chatbot with strict clinical safety guardrails' },
    { name: 'Medication Reminders & Refill Alerts', status: 'Working Demo', desc: 'Dosage tracker, meal timings, pill counter, low-stock warnings' },
    { name: 'Family Member Profiles', status: 'Working Demo', desc: 'Multi-patient records with blood group, allergies, chronic conditions' },
    { name: 'Personal Health Records Vault', status: 'Working Demo', desc: 'Organizes lab reports, vaccine certificates, and hospital summaries' },
    { name: 'Supabase PostgreSQL Schema & RLS Policies', status: 'Configured / SQL Ready', desc: 'Production schema with UUIDs, Row Level Security, and indexes' },
    { name: 'Admin Demo & Viva Evaluation Panel', status: 'Working Demo', desc: 'One-click Rx approvals, order stage advancing, demo data reset' }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Title Hero */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 text-xs font-semibold mb-3 border border-teal-500/30">
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>College Field Project Academic Showcase</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
            Safe Meds — Unified Healthcare Platform
          </h1>
          <p className="text-sm sm:text-base text-teal-100 mb-6 leading-relaxed">
            A comprehensive mobile-first digital healthcare system combining emergency response guidance, specialized Indian doctor appointments, and local pharmacy access.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
            <span className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
              Student: Manthan Sharma
            </span>
            <span className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
              Domain: Mobile App Development & Digital Health
            </span>
            <span className="bg-emerald-500/20 text-emerald-200 px-3 py-1.5 rounded-xl border border-emerald-400/30">
              Vite + React 19 + Tailwind v4 + Supabase Ready
            </span>
          </div>
        </div>
      </div>

      {/* Showcase Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: '1. Problem & Architecture' },
          { id: 'features', label: '2. Feature Matrix' },
          { id: 'database', label: '3. Database Schema & RLS' },
          { id: 'viva', label: '4. 5-7 Min Viva Script' },
          { id: 'future', label: '5. Limitations & Future Scope' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Problem & Architecture */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-black text-slate-900 mb-3">
              Problem Statement
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              In India, digital healthcare access remains severely fragmented across disparate portals: emergency ambulance hotlines are disconnected from clinic scheduling, neighborhood chemist deliveries operate without structured prescription review, and patients maintain health documents in physical paper folders prone to loss.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-red-50 border border-red-100">
                <ShieldAlert className="w-5 h-5 text-red-600 mb-1.5" />
                <h3 className="text-xs font-bold text-red-950">Emergency Delays</h3>
                <p className="text-[11px] text-red-800 mt-0.5">
                  Lack of single-touch emergency triage and clear helpline guidance during panic.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                <UserCheck className="w-5 h-5 text-blue-600 mb-1.5" />
                <h3 className="text-xs font-bold text-blue-950">Doctor Discovery</h3>
                <p className="text-[11px] text-blue-800 mt-0.5">
                  Complex clinic booking systems with no verified Indian medical council credentials.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100">
                <Pill className="w-5 h-5 text-teal-700 mb-1.5" />
                <h3 className="text-xs font-bold text-teal-950">Unregulated Pharmacy</h3>
                <p className="text-[11px] text-teal-800 mt-0.5">
                  Prescription-required antibiotics dispensed without clinical oversight or tracking.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-black text-slate-900 mb-3">
              Proposed Solution & System Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              Safe Meds introduces a unified client architecture with modular separation of concerns:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-teal-700" />
                  <span>Frontend Presentation Layer</span>
                </h4>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>React 19 with Vite development toolchain</li>
                  <li>Tailwind CSS v4 design tokens and mobile-first responsive layout</li>
                  <li>React Router DOM with 28+ configured and tested route endpoints</li>
                  <li>Accessible WAI-ARIA form inputs, modal dialogs & focus states</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-teal-700" />
                  <span>Data & Security Layer</span>
                </h4>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>PostgreSQL schema with Row Level Security (RLS) on all tables</li>
                  <li>Supabase Auth with defensive local reactive storage fallback</li>
                  <li>In-memory file preview preventing client storage leakage</li>
                  <li>Zero exposure of private backend secrets or AI keys</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Feature Matrix */}
      {activeTab === 'features' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Feature Implementation Status Matrix
            </h2>
            <span className="text-xs text-slate-500">12 Core Modules Evaluated</span>
          </div>

          <div className="divide-y divide-slate-100">
            {featureMatrix.map((item, idx) => (
              <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                  <p className="text-slate-500 mt-0.5">{item.desc}</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200 self-start sm:self-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 mr-1" />
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Database Schema & RLS */}
      {activeTab === 'database' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-teal-700" />
              <span>PostgreSQL Schema Architecture</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">supabase/schema.sql</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            The database schema is crafted for Supabase PostgreSQL with primary key constraints, foreign key cascades, fixed-precision money types (<code>NUMERIC(10,2)</code>), and strict Row Level Security policies.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs pt-2">
            {[
              { table: 'profiles', desc: 'User profile with language & admin flag' },
              { table: 'doctors', desc: 'Indian specialists, MMC reg, clinic address' },
              { table: 'appointments', desc: 'Patient consultation schedules & status' },
              { table: 'pharmacies', desc: 'Neighborhood chemist directory & timings' },
              { table: 'medicines', desc: 'OTC vs Rx catalogue with indicative pricing' },
              { table: 'orders & order_items', desc: 'Fulfillment orders with 5-stage tracking' },
              { table: 'saved_addresses', desc: 'User delivery destinations & PIN codes' },
              { table: 'emergency_contacts', desc: 'Primary SOS contacts for triage' },
              { table: 'family_members', desc: 'Multi-patient profiles with blood group' },
              { table: 'medicine_reminders', desc: 'Dosage tracker with low-stock alerts' },
              { table: 'health_records', desc: 'Personal vault for lab tests and vaccines' },
              { table: 'prescriptions', desc: 'Doctor prescription verification queue' }
            ].map((t) => (
              <div key={t.table} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-mono font-bold text-teal-800 block text-xs">public.{t.table}</span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">{t.desc}</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto mt-4">
            <p className="text-teal-400 font-bold mb-1">-- Sample RLS Policy Example</p>
            <p>ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;</p>
            <p>CREATE POLICY "User appointments self" ON public.appointments</p>
            <p>&nbsp;&nbsp;FOR ALL USING (auth.uid() = user_id OR public.is_admin());</p>
          </div>
        </div>
      )}

      {/* TAB 4: Viva Script */}
      {activeTab === 'viva' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-700" />
                <span>5–7 Minute Viva Presentation Guide</span>
              </h2>
              <p className="text-xs text-slate-500">Timed verbal cue script for field evaluation</p>
            </div>
            <span className="text-xs font-bold bg-teal-100 text-teal-800 px-3 py-1 rounded-full">
              Exam Ready
            </span>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-teal-800 text-xs block mb-1">
                Minute 0:00 – 1:00 • Introduction & Motivation
              </span>
              <p className="italic">
                "Good morning, Respected Teachers. Today I present <strong>Safe Meds</strong>, a mobile-first healthcare platform built to tackle fragmented patient care in India. Our tagline is 'Healthcare, All in One Place.' Instead of using multiple apps for emergencies, doctors, and medicines, Safe Meds unifies these services into one cohesive system."
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-teal-800 text-xs block mb-1">
                Minute 1:00 – 2:30 • Core Services & Indian Doctors Directory
              </span>
              <p className="italic">
                "Here on the dashboard, we feature three core pillars: Emergency SOS, Find a Doctor, and Order Medicines. In the Indian Doctors Directory, we support 10 major specialties across Indian cities including Mumbai, Pune, Kolhapur, and Delhi. Every doctor card shows verified Medical Council registration numbers, consultation fees in Indian Rupees, and in-person versus online formats."
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-teal-800 text-xs block mb-1">
                Minute 2:30 – 4:00 • Prescription Gating & Live Order Tracking
              </span>
              <p className="italic">
                "A key safety feature is Prescription Verification. If a student tries to checkout antibiotics or BP tablets, the system enforces prescription approval. In this demo, evaluators can inspect our Admin Demo console to approve or reject prescriptions with one click. Then in Order Tracking, we can demonstrate each of the 5 delivery stages live."
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-teal-800 text-xs block mb-1">
                Minute 4:00 – 5:30 • Aarogya AI, Reminders & Multilingual Support
              </span>
              <p className="italic">
                "To make healthcare accessible, we introduced Aarogya AI supporting English, Hindi, and Marathi with strict clinical guardrails. Patients can also schedule medication alarms with pill count refill alerts, organize family profiles, and store lab test records."
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-teal-800 text-xs block mb-1">
                Minute 5:30 – 6:30 • Architecture, Supabase Schema & Conclusion
              </span>
              <p className="italic">
                "Under the hood, Safe Meds uses React 19, Tailwind CSS v4, and Context API with local persistence, paired with a complete PostgreSQL schema and Row Level Security policies ready for Supabase. Thank you, and I look forward to your questions."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Limitations & Future Scope */}
      {activeTab === 'future' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-base sm:text-lg font-black text-slate-900">
            Prototype Limitations & Future Roadmap
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <h3 className="font-bold text-amber-950 text-sm">
                Academic Prototype Limitations
              </h3>
              <ul className="list-disc list-inside text-amber-900 space-y-1.5 leading-relaxed">
                <li>Emergency SOS is an interface simulation and does not trigger real 112 paramedic dispatches.</li>
                <li>Prescription verification operates on an evaluator simulation queue without licensed pharmacists.</li>
                <li>Payments and order deliveries represent simulated test transactions.</li>
                <li>Sample doctor listings are for demonstration and not actual medical endorsements.</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 space-y-2">
              <h3 className="font-bold text-teal-950 text-sm">
                Future Production Roadmap
              </h3>
              <ul className="list-disc list-inside text-teal-900 space-y-1.5 leading-relaxed">
                <li>Integration with Ayushman Bharat Digital Mission (ABDM) / ABHA Health ID.</li>
                <li>Real-time WebRTC peer-to-peer encrypted video consultations.</li>
                <li>Direct API integrations with state emergency dispatch CAD systems.</li>
                <li>Automated OCR extraction for registered clinic prescription stamps.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
