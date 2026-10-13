import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingCart,
  FileCheck,
  Building2,
  Check,
  Plus,
  Minus,
  ShieldAlert,
  AlertCircle,
  Truck
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { formatCurrency } from '../utils/formatting';
import { useApp } from '../context/AppContext';

export const MedicineDetails = () => {
  const { medicineId } = useParams();
  const { medicines, addToCart, cart } = useApp();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const medicine = medicines.find((m) => m.id === medicineId);

  if (!medicine) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 bg-white rounded-3xl border border-slate-200">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 mb-1">Product Not Found</h2>
        <p className="text-xs text-slate-500 mb-5">
          The requested medicine "{medicineId}" could not be located in the catalog.
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

  const isInCart = cart.some((item) => item.id === medicine.id);

  const handleAddToCart = () => {
    addToCart(medicine, quantity);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <Link
          to="/medicines"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Medicines</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Product Image Box */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-square border border-slate-200 flex items-center justify-center">
            <img
              src={medicine.image}
              alt={medicine.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300';
              }}
            />
            {medicine.requiresPrescription ? (
              <div className="absolute top-3 left-3 bg-purple-900 text-purple-100 text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-md">
                <FileCheck className="w-3.5 h-3.5 text-purple-300" />
                <span>Prescription Required</span>
              </div>
            ) : (
              <div className="absolute top-3 left-3 bg-emerald-900 text-emerald-100 text-xs font-bold px-3 py-1 rounded-lg shadow-md">
                OTC General Product
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-4">
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
              <p className="text-xs text-slate-500">
                Packaging: {medicine.packaging} • Manufacturer: {medicine.manufacturer}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-400 font-medium block">
                Indicative Sample Price
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-black text-slate-900">
                  {formatCurrency(medicine.indicativePrice)}
                </span>
                <span className="text-xs text-slate-500">per pack (incl. taxes)</span>
              </div>
            </div>

            {medicine.requiresPrescription && (
              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-purple-900">
                  <FileCheck className="w-4 h-4 text-purple-700" />
                  <span>Doctor Prescription Mandatory</span>
                </div>
                <p className="text-[11px] text-purple-800 leading-relaxed">
                  This product requires a registered practitioner's prescription. In this demo, you can upload a prescription on the Prescriptions page or during checkout, and simulate review in Admin Demo.
                </p>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Product Description & Dosage
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                {medicine.description}
              </p>
              <p className="text-xs text-slate-500">
                <strong>Dosage reference: </strong> {medicine.dosage}
              </p>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Quantity</span>
                <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                    className="p-1 rounded-lg hover:bg-white text-slate-600 disabled:opacity-40 cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-xs font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="p-1 rounded-lg hover:bg-white text-slate-600 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart ({quantity})</span>
                </button>

                <Link
                  to="/cart"
                  className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Go to Cart</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
