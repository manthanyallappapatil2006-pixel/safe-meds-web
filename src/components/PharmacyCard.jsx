import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Clock, Phone, Truck, Star } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const PharmacyCard = ({ pharmacy }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center shrink-0 border border-teal-100 group-hover:bg-teal-700 group-hover:text-white transition-colors">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                {pharmacy.name}
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                {pharmacy.city} • Fast Delivery (~{pharmacy.deliveryTime})
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              {pharmacy.rating}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-xs text-slate-600 mb-4 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
          <div className="flex items-start gap-2 text-[11px]">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span className="text-slate-700 leading-tight">{pharmacy.address}</span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-600 font-medium">
              Sample Hours: {pharmacy.operatingHours}
            </span>
          </div>

          <div className="flex items-start gap-2 text-[11px]">
            <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <div className="text-slate-500">
              <span className="font-semibold text-slate-700">Delivery coverage: </span>
              {pharmacy.deliveryAreas.join(', ')}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <StatusBadge status={pharmacy.sampleAvailability} />
            <span className="text-[10px] text-slate-400">Sample partner</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
        <a
          href={`tel:${pharmacy.phone}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-teal-700"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>{pharmacy.phone}</span>
        </a>

        <Link
          to={`/medicines?pharmacy=${encodeURIComponent(pharmacy.name)}`}
          className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-colors"
        >
          Browse Medicines
        </Link>
      </div>
    </div>
  );
};
