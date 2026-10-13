import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Pill, X, ShoppingCart, FileCheck, ArrowUpDown, ShieldCheck } from 'lucide-react';
import { MedicineCard } from '../components/MedicineCard';
import { EmptyState } from '../components/EmptyState';
import { medicineCategories } from '../data/medicines';
import { useApp } from '../context/AppContext';

export const Medicines = () => {
  const { medicines, cart } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialPharmacy = searchParams.get('pharmacy') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [rxFilter, setRxFilter] = useState('All'); // 'All' | 'OTC' | 'Rx'
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'price-asc' | 'price-desc' | 'name'

  const filteredMedicines = useMemo(() => {
    return medicines
      .filter((med) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = med.name.toLowerCase().includes(q);
          const matchDesc = med.description.toLowerCase().includes(q);
          const matchCat = med.category.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat) return false;
        }

        if (selectedCategory !== 'All Categories' && med.category !== selectedCategory) {
          return false;
        }

        if (rxFilter === 'OTC' && med.requiresPrescription) return false;
        if (rxFilter === 'Rx' && !med.requiresPrescription) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.indicativePrice - b.indicativePrice;
        if (sortBy === 'price-desc') return b.indicativePrice - a.indicativePrice;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [medicines, searchQuery, selectedCategory, rxFilter, sortBy]);

  const handleClear = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setRxFilter('All');
    setSortBy('default');
    setSearchParams({});
  };

  const isFiltered =
    searchQuery ||
    selectedCategory !== 'All Categories' ||
    rxFilter !== 'All' ||
    sortBy !== 'default';

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & View Cart Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Medicines & Healthcare Supplies
            </h1>
            {initialPharmacy && (
              <span className="text-xs bg-teal-100 text-teal-800 font-bold px-2.5 py-0.5 rounded-full">
                {initialPharmacy}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Browse essential medicines, first-aid products, and certified healthcare essentials
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isFiltered && (
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}

          <Link
            to="/cart"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>View Cart ({cartItemsCount})</span>
          </Link>
        </div>
      </div>

      {/* Safety Notice regarding prescriptions */}
      <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 text-purple-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-purple-700 shrink-0" />
          <span>
            <strong>Prescription Notice:</strong> Restricted medications labeled{' '}
            <span className="font-bold underline">Rx Required</span> cannot be finalized at checkout without demonstration prescription approval.
          </span>
        </div>
        <Link
          to="/prescriptions"
          className="text-purple-800 font-bold hover:underline shrink-0"
        >
          Manage Prescriptions →
        </Link>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {medicineCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search and Secondary Filter Row */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by medicine or product name..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
            />
          </div>

          {/* Rx vs OTC filter */}
          <div>
            <select
              value={rxFilter}
              onChange={(e) => setRxFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option value="All">All Types (OTC & Prescription)</option>
              <option value="OTC">OTC Only (No Rx Required)</option>
              <option value="Rx">Prescription Required Only</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option value="default">Sort: Default Catalog</option>
              <option value="price-asc">Sort: Price (Low to High)</option>
              <option value="price-desc">Sort: Price (High to Low)</option>
              <option value="name">Sort: Name (A to Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Listings */}
      <div>
        <div className="flex items-center justify-between mb-3 text-xs text-slate-500 font-medium">
          <span>Found {filteredMedicines.length} products</span>
          <span className="text-[11px] text-amber-700">
            *Indicative pricing for student prototype evaluation
          </span>
        </div>

        {filteredMedicines.length === 0 ? (
          <EmptyState
            icon={Pill}
            title="No medicines match your search"
            description="Try adjusting category filters or searching for generic product names like Paracetamol or First Aid."
            actionText="Clear Filters"
            onAction={handleClear}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMedicines.map((med) => (
              <MedicineCard key={med.id} medicine={med} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
