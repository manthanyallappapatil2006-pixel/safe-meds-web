import React, { useState, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Search, Pill, X, ShoppingCart, Info, ShieldCheck } from 'lucide-react';
import { MedicineCard } from '../components/MedicineCard';
import { EmptyState } from '../components/EmptyState';
import { medicineCategories } from '../data/medicines';
import { useApp } from '../context/AppContext';

export const Medicines = () => {
  const navigate = useNavigate();
 const { medicines, cart, pharmacies, inventory } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialPharmacy = searchParams.get('pharmacy') || '';
  const selectedPharmacy = initialPharmacy;
  const selectedPharmacyDetails = pharmacies.find(
  (pharmacy) => pharmacy.id === selectedPharmacy
);
const isSelectedPharmacyInactive =
  selectedPharmacyDetails?.isActive === false;
const selectedPharmacyInventory = inventory.filter(
  (item) => item.pharmacyId === selectedPharmacy
);

const availableMedicineIds = selectedPharmacy
  ? selectedPharmacyInventory
      .filter((item) => item.stock > 0)
      .map((item) => item.medicineId)
  : [];

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [rxFilter, setRxFilter] = useState('All'); // 'All' | 'OTC' | 'Rx'
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'price-asc' | 'price-desc' | 'name'

  const filteredMedicines = useMemo(() => {
    if (!medicines) return [];
    return medicines
      .filter((med) => {
        if (
  selectedPharmacy &&
  !availableMedicineIds.includes(med.id)
) {
  return false;
}
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
      .map((med) => {
        if (!selectedPharmacy) return med;

       const inventoryItem = selectedPharmacyInventory.find(
    (item) => item.medicineId === med.id
);

        return {
  ...med,
  indicativePrice: inventoryItem?.price ?? med.indicativePrice,
  pharmacyId: selectedPharmacy,
  pharmacyName: selectedPharmacyDetails?.name || '',
  stock: inventoryItem?.stock ?? 0,
};
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.indicativePrice - b.indicativePrice;
        if (sortBy === 'price-desc') return b.indicativePrice - a.indicativePrice;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [
  medicines,
  searchQuery,
  selectedCategory,
  rxFilter,
  sortBy,
  selectedPharmacy,
  availableMedicineIds
]);

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

  const cartItemsCount = (Array.isArray(cart) ? cart : []).reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Medicines &amp; Healthcare Supplies
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Browse essential medicines, first-aid products, and certified healthcare essentials — for reference only
          </p>
        </div>

        {isFiltered && (
          <button
            id="btn-clear-medicine-filters"
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Informational Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-teal-50/80 border border-teal-200 text-teal-900 text-xs flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
          <span>
            <strong>Informational Catalog Only:</strong> This section displays medicines and healthcare products for
            educational reference. Indicative prices, dosages, and availability are{' '}
            <strong>sample data for prototype evaluation</strong> and must not be used as medical or purchasing advice.
          </span>
        </div>
      </div>

      {/* Rx vs OTC legend */}
      <div className="flex items-center gap-3 flex-wrap text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-700"></span>
          <span className="text-slate-600 font-medium">OTC / Direct — No prescription needed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-purple-700"></span>
          <span className="text-slate-600 font-medium">Rx Required — Prescription from a registered doctor</span>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {medicineCategories.map((cat) => (
          <button
            id={`btn-cat-${cat.replace(/\s+/g, '-').toLowerCase()}`}
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${selectedCategory === cat
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
              id="input-medicine-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, category, or description..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
            />
          </div>

          {/* Rx vs OTC filter */}
          <div>
            <select
              id="select-medicine-rx-filter"
              value={rxFilter}
              onChange={(e) => setRxFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option value="All">All Types (OTC &amp; Prescription)</option>
              <option value="OTC">OTC Only (No Rx Required)</option>
              <option value="Rx">Prescription Required Only</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              id="select-medicine-sort"
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
          <span>
            Showing <strong className="text-slate-700">{filteredMedicines.length}</strong> product
            {filteredMedicines.length !== 1 ? 's' : ''}
            {selectedCategory !== 'All Categories' && (
              <span className="ml-1 text-teal-700">in &ldquo;{selectedCategory}&rdquo;</span>
            )}
          </span>
          <span className="text-[11px] text-amber-700 text-right">
            *Indicative pricing — student prototype only
          </span>
        </div>

        {isSelectedPharmacyInactive ? (
  <EmptyState
    icon={Pill}
    title="Pharmacy Currently Unavailable"
    description="This pharmacy is inactive right now. Please choose another active pharmacy to browse medicines."
    actionText="Browse Pharmacies"
    onAction={() => navigate('/pharmacies')}
  />
) : filteredMedicines.length === 0 ? (
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
              <MedicineCard
  key={med.id}
  medicine={med}
  disabled={isSelectedPharmacyInactive}
/>
            ))}
          </div>
        )}
      </div>

      {/* Bottom notice */}
      <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
        <span>
          All products listed are fictional demonstration entries created for a college field project prototype.
          They do not represent actual medical products, pricing, or availability. Always consult a licensed healthcare professional before taking any medication.
        </span>
      </div>
    </div>
  );
};
