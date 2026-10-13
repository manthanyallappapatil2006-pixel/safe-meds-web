import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, X, SlidersHorizontal, UserCheck, ArrowUpDown, MapPin, ShieldCheck, Languages } from 'lucide-react';
import { DoctorCard } from '../components/DoctorCard';
import { EmptyState } from '../components/EmptyState';
import { specialtiesList, indianCitiesList, languagesList } from '../data/doctors';
import { useApp } from '../context/AppContext';

export const Doctors = () => {
  const { doctors } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCity = searchParams.get('city') || 'All Cities';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [verificationFilter, setVerificationFilter] = useState('All');
  const [consultationType, setConsultationType] = useState('All');
  const [maxFee, setMaxFee] = useState(1500);
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'fee-asc' | 'fee-desc' | 'name'

  const filteredDoctors = useMemo(() => {
    return doctors
      .filter((doctor) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = doctor.name.toLowerCase().includes(q);
          const matchSpec = doctor.specialty.toLowerCase().includes(q);
          const matchAddress = (doctor.clinicAddress || '').toLowerCase().includes(q);
          const matchHospital = (doctor.hospitalName || '').toLowerCase().includes(q);
          const matchCity = (doctor.city || '').toLowerCase().includes(q);
          if (!matchName && !matchSpec && !matchAddress && !matchHospital && !matchCity) return false;
        }

        // City filter
        if (selectedCity !== 'All Cities' && doctor.city !== selectedCity) {
          return false;
        }

        // Specialty filter
        if (
          selectedSpecialty !== 'All Specialties' &&
          doctor.specialty !== selectedSpecialty
        ) {
          return false;
        }

        // Language filter
        if (
          selectedLanguage !== 'All Languages' &&
          !(doctor.languages || []).includes(selectedLanguage)
        ) {
          return false;
        }

        // Verification filter
        if (
          verificationFilter !== 'All' &&
          doctor.verificationStatus !== verificationFilter
        ) {
          return false;
        }

        // Consultation type
        if (consultationType === 'Online' && !doctor.consultationTypes.includes('Online consultation')) {
          return false;
        }
        if (consultationType === 'In-person' && !doctor.consultationTypes.includes('In-person consultation')) {
          return false;
        }

        // Fee range
        if (doctor.consultationFee > maxFee) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'fee-asc') return a.consultationFee - b.consultationFee;
        if (sortBy === 'fee-desc') return b.consultationFee - a.consultationFee;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return b.rating - a.rating; // default by rating
      });
  }, [
    doctors,
    searchQuery,
    selectedCity,
    selectedSpecialty,
    selectedLanguage,
    verificationFilter,
    consultationType,
    maxFee,
    sortBy
  ]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCity('All Cities');
    setSelectedSpecialty('All Specialties');
    setSelectedLanguage('All Languages');
    setVerificationFilter('All');
    setConsultationType('All');
    setMaxFee(1500);
    setSortBy('rating');
    setSearchParams({});
  };

  const isFiltered =
    searchQuery ||
    selectedCity !== 'All Cities' ||
    selectedSpecialty !== 'All Specialties' ||
    selectedLanguage !== 'All Languages' ||
    verificationFilter !== 'All' ||
    consultationType !== 'All' ||
    maxFee < 1500 ||
    sortBy !== 'rating';

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Indian Doctor Directory
            </h1>
            <span className="text-[11px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
              Across India
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Search certified medical practitioners in Mumbai, Pune, Kolhapur, Delhi, Bengaluru & more
          </p>
        </div>

        {isFiltered && (
          <button
            onClick={handleClearFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Indian City Quick Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {indianCitiesList.map((city) => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
              selectedCity === city
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {city !== 'All Cities' && <MapPin className="w-3 h-3" />}
            <span>{city}</span>
          </button>
        ))}
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* Search text */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by doctor name, specialty, hospital or area..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
            />
          </div>

          {/* Specialty Selector */}
          <div>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              {specialtiesList.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {/* Consultation Type */}
          <div>
            <select
              value={consultationType}
              onChange={(e) => setConsultationType(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option value="All">All Formats (Online & Clinic)</option>
              <option value="Online">Online Video Consultation</option>
              <option value="In-person">In-Person Clinic Visit</option>
            </select>
          </div>
        </div>

        {/* Secondary filters row: Language, Verification Status, Sort, Fee */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          {/* Language filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Language Spoken</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-700"
            >
              {languagesList.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Verification Status filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Verification Status</label>
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-700"
            >
              <option value="All">All Verification States</option>
              <option value="Verified">Verified Only</option>
              <option value="Sample Demo Profile">Sample Demo Profiles</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Sort Options</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-700"
            >
              <option value="rating">Top Rated</option>
              <option value="fee-asc">Fee: Low to High (₹)</option>
              <option value="fee-desc">Fee: High to Low (₹)</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>

          {/* Max Fee Slider */}
          <div>
            <div className="flex justify-between font-semibold text-slate-600 mb-1">
              <span className="text-[11px]">Max Fee:</span>
              <span className="text-teal-800 font-bold">₹{maxFee}</span>
            </div>
            <input
              type="range"
              min="300"
              max="1500"
              step="50"
              value={maxFee}
              onChange={(e) => setMaxFee(Number(e.target.value))}
              className="w-full accent-teal-700 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Results Count & Listings */}
      <div>
        <div className="flex items-center justify-between mb-3 text-xs text-slate-500 font-medium">
          <span>
            Showing <strong>{filteredDoctors.length}</strong> Indian doctor profiles
          </span>
          <span className="text-[11px] text-amber-700 font-medium">
            *Explicitly marked as Sample Academic Listings for collegiate presentation
          </span>
        </div>

        {filteredDoctors.length === 0 ? (
          <EmptyState
            icon={UserCheck}
            title="No doctors match your criteria"
            description="Try clearing search filters or selecting another Indian city to view more specialists."
            actionText="Reset All Filters"
            onAction={handleClearFilters}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
