import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const Privacy = () => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <Link
        to="/home"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-500">
              Demonstration prototype data handling and storage guidelines
            </p>
          </div>
        </div>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">
            1. Prototype Scope and Purpose
          </h2>
          <p>
            <strong>Safe Meds</strong> is developed strictly as an academic college field project prototype. Its objective is to demonstrate how emergency assistance, doctor consultations, and local pharmacy services can be unified within a mobile application interface.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">
            2. Local Demonstration Data Storage
          </h2>
          <p>
            No patient records, banking credentials, or private personal data are transmitted to third-party databases. All prototype states (demo appointments, sample orders, and addresses) are persisted locally within your browser's <code>localStorage</code> for demonstration consistency.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">
            3. Prescription Handling & Previews
          </h2>
          <p>
            Uploaded prescription files are handled temporarily in browser memory using secure object URLs. They are never transmitted across open networks or stored permanently on remote servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">
            4. Emergency SOS Simulation Disclaimer
          </h2>
          <p>
            The emergency feature does not trigger actual cellular emergency calls or ambulance dispatches. In real-life medical emergencies, patients must immediately contact emergency authorities (dial <strong>112</strong> in India).
          </p>
        </section>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">Safe Meds Academic Project • 2026</span>
          <Link
            to="/terms"
            className="text-xs font-bold text-teal-700 hover:underline"
          >
            Read Terms of Service →
          </Link>
        </div>
      </div>
    </div>
  );
};
