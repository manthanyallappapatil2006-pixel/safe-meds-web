import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, FileCheck, Info, Check } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { formatCurrency } from '../utils/formatting';
import { useApp } from '../context/AppContext';

export const MedicineCard = ({ medicine }) => {
  const { addToCart, cart } = useApp();
  const isInCart = cart.some((item) => item.id === medicine.id);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div className="relative mb-3 overflow-hidden rounded-xl bg-slate-100 aspect-4/3 flex items-center justify-center">
          <img
            src={medicine.image}
            alt={medicine.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300';
            }}
          />
          {medicine.requiresPrescription ? (
            <div className="absolute top-2 left-2 bg-purple-900/90 backdrop-blur-xs text-purple-100 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
              <FileCheck className="w-3 h-3 text-purple-300" />
              <span>Rx Required</span>
            </div>
          ) : (
            <div className="absolute top-2 left-2 bg-emerald-900/90 backdrop-blur-xs text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              OTC / Direct
            </div>
          )}
        </div>

        <div className="mb-2">
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">
              {medicine.category}
            </span>
            <StatusBadge status={medicine.sampleAvailability} />
          </div>
          <h4 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-teal-800 transition-colors">
            {medicine.name}
          </h4>
          <p className="text-[11px] text-slate-500 line-clamp-1">
            {medicine.packaging} • {medicine.manufacturer}
          </p>
        </div>

        <div className="flex items-baseline justify-between mb-3 pt-1">
          <div>
            <span className="text-[10px] text-slate-400 block -mb-0.5">Indicative Price</span>
            <span className="text-base font-black text-slate-900">
              {formatCurrency(medicine.indicativePrice)}
            </span>
          </div>
          {medicine.requiresPrescription && (
            <span className="text-[10px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
              Needs Doctor Rx
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
        <Link
          to={`/medicines/${medicine.id}`}
          className="w-full text-center py-2 px-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          Details
        </Link>
        <button
          type="button"
          onClick={() => addToCart(medicine, 1)}
          className={`w-full inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
            isInCart
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-teal-700 hover:bg-teal-800 text-white'
          }`}
        >
          {isInCart ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added (+1)</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
