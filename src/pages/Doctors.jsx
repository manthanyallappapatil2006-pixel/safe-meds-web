import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, X, SlidersHorizontal, UserCheck, ArrowUpDown, MapPin, ShieldCheck, Languages } from 'lucide-react';
import { DoctorCard } from '../components/DoctorCard';
import { EmptyState } from '../components/EmptyState';
import { specialtiesList, indianCitiesList, languagesList } from '../data/doctors';
import { useApp } from '../context/AppContext';
import { LocationAutocomplete } from '../components/LocationAutocomplete';

export const Doctors = () => {
  const { doctors } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const initialCity = searchParams.get('city') || 'All Cities';
const [selectedCity, setSelectedCity] = useState(initialCity);
  
  // Selected address from nationwide location search
const [selectedLocation, setSelectedLocation] = useState(null);

// Nearby doctors or doctors across India
const [searchMode, setSearchMode] = useState('nearby');

  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [verificationFilter, setVerificationFilter] = useState('All');
  const [consultationType, setConsultationType] = useState('All');
  const [maxFee, setMaxFee] = useState(1500);
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'fee-asc' | 'fee-desc' | 'name'

  const filteredDoctors = useMemo(() => {
    console.log('Search mode:', searchMode);
console.log('Selected location:', selectedLocation);
console.log('Selected city:', selectedCity);
console.log('Selected specialty:', selectedSpecialty);
const locationMatches = (doctor) => {
  // Show all available doctors in All India mode.
  if (!selectedLocation || searchMode === 'india') {
    return true;
  }

  // Convert values into lowercase text for easier comparison.
  const normalize = (value) =>
    String(value || '').trim().toLowerCase();

  // Collect all available doctor location details.
  const doctorLocation = [
    doctor.city,
    doctor.state,
    doctor.district,
    doctor.village,
    doctor.area,
    doctor.locality,
    doctor.location,
    doctor.clinicAddress,
    doctor.hospitalName,
    doctor.address,
    doctor.pincode,
    doctor.postalCode
  ]
    .filter(Boolean)
    .map(normalize)
    .join(' ');

  // 1. Check exact PIN-code match.
  if (selectedLocation.postcode) {
    const selectedPin = normalize(selectedLocation.postcode);

    const doctorPins = [
      doctor.pincode,
      doctor.postalCode,
      doctor.postal_code
    ].map(normalize);

    if (doctorPins.includes(selectedPin)) {
      return true;
    }
  }

  // 2. Check area, village, city and district.
  const locationNames = [
    selectedLocation.name,
    selectedLocation.city,
    selectedLocation.district
  ]
    .filter(Boolean)
    .map(normalize);

  const placeMatch = locationNames.some(name =>
    doctorLocation.includes(name)
  );

  if (placeMatch) {
    return true;
  }

  // 3. If no place matches, check the state.
  const selectedState = normalize(selectedLocation.state);

  if (selectedState && doctorLocation.includes(selectedState)) {
    return true;
  }

  return false;
};
    return doctors
      .filter((doctor) => {
        // Search query

// City filter with alias matching
if (searchMode !== 'india' && selectedCity !== 'All Cities') {
  const cityAliases = {
    'Bengaluru (Bangalore)': ['Bengaluru', 'Bangalore'],
    'Mysore': ['Mysore', 'Mysuru'],
    'Mangaluru (Mangalore)': ['Mangaluru', 'Mangalore'],
    'Gurugram (Gurgaon)': ['Gurugram', 'Gurgaon'],
    'Thiruvananthapuram (Trivandrum)': ['Thiruvananthapuram', 'Trivandrum'],
    'Kochi (Cochin)': ['Kochi', 'Cochin'],
    'Kozhikode (Calicut)': ['Kozhikode', 'Calicut'],
    'Prayagraj (Allahabad)': ['Prayagraj', 'Allahabad'],
    'Aurangabad (Chhatrapati Sambhajinagar)': [
      'Aurangabad',
      'Chhatrapati Sambhajinagar'
    ],
    'Hubballi-Dharwad': ['Hubballi', 'Dharwad', 'Hubballi-Dharwad']
  };

  const selectedAliases = cityAliases[selectedCity] || [selectedCity];
  const doctorCity = (doctor.city || '').toLowerCase();

  const cityMatches = selectedAliases.some(city =>
    doctorCity.includes(city.toLowerCase())
  );

  if (!cityMatches) {
    return false;
  }
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
        if (
  consultationType === 'Online' &&
  !(doctor.consultationTypes || []).includes('Online consultation')
) {
  return false;
}

if (
  consultationType === 'In-person' &&
  !(doctor.consultationTypes || []).includes('In-person consultation')
) {
  return false;
}
console.log('Selected specialty:', selectedSpecialty);
console.log('Doctor specialty:', doctor.specialty);
console.log('Maximum fee:', maxFee);
console.log('Doctor fee:', doctor.consultationFee);
        // Fee range
if (doctor.consultationFee > maxFee) {
  return false;
}

// Location filter
if (!locationMatches(doctor)) {
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
    selectedLocation,
    searchMode,
    selectedSpecialty,
    selectedLanguage,
    verificationFilter,
    consultationType,
    maxFee,
    sortBy
  ]);

  const handleClearFilters = () => {
    setSearchQuery('');
   
    setSelectedLocation(null);
    setSearchMode('nearby');
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
  selectedLocation ||
  searchMode !== 'nearby' ||

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

      

      
{/* Nationwide Location Search */}
<div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
  <div>
    <h2 className="text-sm font-bold text-slate-800">
      Find Doctors by Location
    </h2>
    <p className="text-xs text-slate-500 mt-1">
      Enter an address, locality, village, city, district, state or PIN code.
    </p>
  </div>

  <LocationAutocomplete
    onSelect={(place) => {
      setSelectedLocation(place);
  

      if (place) {
        setSearchMode('nearby');
      }
    }}
  />

  <div className="flex flex-wrap gap-2">
    <button
      type="button"
      onClick={() => setSearchMode('nearby')}
      className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
        searchMode === 'nearby'
          ? 'bg-teal-700 text-white'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      }`}
    >
      <MapPin className="inline w-3.5 h-3.5 mr-1" />
      Nearby Doctors
    </button>

    <button
      type="button"
      onClick={() => {
  setSearchMode('india');
}}
      className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
        searchMode === 'india'
          ? 'bg-teal-700 text-white'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      }`}
    >
      <MapPin className="inline w-3.5 h-3.5 mr-1" />
      Search All India
    </button>
  </div>

  {selectedLocation && (
    <p className="text-xs text-teal-700">
      Selected location: {selectedLocation.label}
    </p>
  )}
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
