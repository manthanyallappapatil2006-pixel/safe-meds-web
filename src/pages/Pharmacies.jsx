import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Building2, MapPin, X, Clock, Truck } from 'lucide-react';
import { PharmacyCard } from '../components/PharmacyCard';
import { EmptyState } from '../components/EmptyState';
import { useApp } from '../context/AppContext';

export const Pharmacies = () => {
  const { pharmacies } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCity, setSelectedCity] = useState('All');
  const [openStatus, setOpenStatus] = useState('All');

  const cities = ['All', 'Noida', 'Ghaziabad', 'New Delhi', 'Gurugram'];

  const filteredPharmacies = useMemo(() => {
    return pharmacies.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchAddress = p.address.toLowerCase().includes(q);
        const matchCity = p.city.toLowerCase().includes(q);
        const matchArea = p.deliveryAreas.some((a) => a.toLowerCase().includes(q));
        if (!matchName && !matchAddress && !matchCity && !matchArea) return false;
      }

      if (selectedCity !== 'All' && p.city !== selectedCity) {
        return false;
      }

      if (openStatus === 'Open Now' && !p.sampleAvailability.toLowerCase().includes('open')) {
        return false;
      }

      if (openStatus === '24/7' && !p.sampleAvailability.toLowerCase().includes('24/7')) {
        return false;
      }

      return true;
    });
  }, [pharmacies, searchQuery, selectedCity, openStatus]);

  const handleClear = () => {
    setSearchQuery('');
    setSelectedCity('All');
    setOpenStatus('All');
    setSearchParams({});
  };

  const isFiltered = searchQuery || selectedCity !== 'All' || openStatus !== 'All';

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Local Pharmacies
          </h1>
          <p className="text-xs text-slate-500">
            Find nearby chemists and order healthcare supplies for doorstep delivery
          </p>
        </div>

        {isFiltered && (
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search box */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pharmacy name or delivery area..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
            />
          </div>

          {/* City / Area filter */}
          <div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city === 'All' ? 'All Service Cities' : `City: ${city}`}
                </option>
              ))}
            </select>
          </div>

          {/* Operating Status */}
          <div>
            <select
              value={openStatus}
              onChange={(e) => setOpenStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option value="All">All Operating Hours</option>
              <option value="Open Now">Open Now (Sample)</option>
              <option value="24/7">Open 24/7 (Sample)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pharmacy cards */}
      <div>
        <div className="flex items-center justify-between mb-3 text-xs text-slate-500 font-medium">
          <span>Found {filteredPharmacies.length} partner pharmacies</span>
          <span className="text-[11px] text-amber-700">
            *Operating hours represent sample demonstration data
          </span>
        </div>

        {filteredPharmacies.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No pharmacies found"
            description="We could not find any pharmacies matching your filter criteria."
            actionText="Clear Search"
            onAction={handleClear}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPharmacies.map((pharmacy) => (
              <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
