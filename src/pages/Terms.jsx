import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, AlertTriangle, ShieldAlert } from 'lucide-react';

export const Terms = () => {
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
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Terms of Service & Prototype Disclaimers
            </h1>
            <p className="text-xs text-slate-500">
              Academic evaluation terms and clinical safety statements
            </p>
          </div>
        </div>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">
            1. Nature of the Application
          </h2>
          <p>
            Safe Meds is an educational prototype developed for collegiate demonstration. It simulates user interfaces for healthcare triage, appointment scheduling, and pharmacy dispatch. It is not licensed to provide medical diagnosis or dispatch emergency vehicles.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">
            2. Medical Advice Disclaimer
          </h2>
          <p>
            Information displayed within Safe Meds (including medicine descriptions, indicative pricing, and doctor listings) is illustrative. Always seek the advice of a qualified, registered medical practitioner for any clinical condition.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">
            3. Simulated Payments and Deliveries
          </h2>
          <p>
            Any orders placed within this prototype represent mock demonstration transactions. No real funds are debited and no actual courier dispatches are scheduled.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">
            4. Emergency Response Protocol
          </h2>
          <p>
            For actual life-threatening emergencies, patients must immediately dial the national emergency number: <strong>112</strong> in India.
          </p>
        </section>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">Safe Meds Academic Project • 2026</span>
          <Link
            to="/privacy"
            className="text-xs font-bold text-teal-700 hover:underline"
          >
            Review Privacy Policy →
          </Link>
        </div>
      </div>
    </div>
  );
};
