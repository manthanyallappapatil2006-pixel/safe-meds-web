import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  FileCheck,
  AlertCircle,
  ShieldCheck,
  Info,
  Package,
  Building2,
  Tag,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { formatCurrency } from '../utils/formatting';
import { useApp } from '../context/AppContext';

export const MedicineDetails = () => {
  const { medicineId } = useParams();
  const { medicines } = useApp();

  const medicine = medicines ? medicines.find((m) => m.id === medicineId) : null;

  if (!medicine) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 bg-white rounded-3xl border border-slate-200">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 mb-1">Product Not Found</h2>
        <p className="text-xs text-slate-500 mb-5">
          The requested medicine &ldquo;{medicineId}&rdquo; could not be located in the catalog.
        </p>
        <Link
          to="/medicines"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Medicines</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Back link */}
      <div>
        <Link
          to="/medicines"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Medicines</span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Product Image */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-square border border-slate-200 flex items-center justify-center">
            <img
              src={medicine.image}
              alt={medicine.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300';
              }}
            />
            {medicine.requiresPrescription ? (
              <div className="absolute top-3 left-3 bg-purple-900 text-purple-100 text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-md">
                <FileCheck className="w-3.5 h-3.5 text-purple-300" />
                <span>Prescription Required</span>
              </div>
            ) : (
              <div className="absolute top-3 left-3 bg-emerald-900 text-emerald-100 text-xs font-bold px-3 py-1 rounded-lg shadow-md">
                OTC — No Prescription Needed
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-4">
            {/* Category & Availability */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                  {medicine.category}
                </span>
                <StatusBadge status={medicine.sampleAvailability} />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
                {medicine.name}
              </h1>
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Package className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Packaging</p>
                  <p className="text-xs font-semibold text-slate-800 leading-snug">{medicine.packaging}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Building2 className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Manufacturer</p>
                  <p className="text-xs font-semibold text-slate-800 leading-snug">{medicine.manufacturer}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Tag className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Dosage Ref.</p>
                  <p className="text-xs font-semibold text-slate-800 leading-snug">{medicine.dosage}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 rounded-xl bg-teal-50 border border-teal-100">
                <span className="text-[10px] text-teal-600 font-medium uppercase tracking-wider block mt-0.5">₹</span>
                <div>
                  <p className="text-[10px] text-teal-600 font-medium uppercase tracking-wider">Indicative Price</p>
                  <p className="text-base font-black text-slate-900">{formatCurrency(medicine.indicativePrice)}</p>
                </div>
              </div>
            </div>

            {/* Prescription notice */}
            {medicine.requiresPrescription && (
              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-purple-900">
                  <FileCheck className="w-4 h-4 text-purple-700" />
                  <span>Doctor Prescription Mandatory</span>
                </div>
                <p className="text-[11px] text-purple-800 leading-relaxed">
                  This product requires a registered practitioner's prescription before dispensing. This catalog entry is for informational purposes only.
                </p>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Product Description
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                {medicine.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Read-only disclaimer */}
      <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-[11px] text-teal-800 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-teal-600" />
        <span>
          <strong>Informational entry only.</strong> The details shown here are part of a fictional demonstration dataset created for a college field project. Always follow your doctor&apos;s guidance and consult a licensed pharmacist before taking any medication.
        </span>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
        <span>
          Indicative pricing is a sample value included for student prototype evaluation only and does not reflect actual market prices or pharmacy rates.
        </span>
      </div>
    </div>
  );
};
