
import React, { useEffect, useState } from 'react';

export function LocationAutocomplete({
  onSelect,
  placeholder = 'Enter area, village, city, district, state or PIN code...'
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setLoading(false);
      setError('');
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError('');

        const params = new URLSearchParams({
          q: query.trim(),
          limit: '8',
          lang: 'en',
          countrycode: 'IN'
        });

        const response = await fetch(
          `https://photon.komoot.io/api/?${params}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error('Location search unavailable');
        }

        const data = await response.json();

        const places = (data.features || [])
          .filter(feature =>
            feature.properties?.countrycode === 'IN'
          )
          .map((feature, index) => {
            const p = feature.properties || {};
            const coordinates = feature.geometry?.coordinates || [];

            const parts = [
              p.name,
              p.district,
              p.city,
              p.state,
              p.postcode
            ].filter(Boolean);

            return {
              id: `${p.osm_type || 'place'}-${p.osm_id || index}`,
              name: p.name || 'Unknown location',
              city: p.city || '',
              district: p.district || '',
              state: p.state || '',
              postcode: p.postcode || '',
              country: p.country || 'India',
              label: [...new Set(parts)].join(', '),
              longitude: coordinates[0] ?? null,
              latitude: coordinates[1] ?? null
            };
          });

        setSuggestions(places);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Could not load locations. Please try again.');
          setSuggestions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 450);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const chooseLocation = (place) => {
    setQuery(place.label);
    setSuggestions([]);
    setError('');
    onSelect?.(place);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          onSelect?.(null);
        }}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      {loading && (
        <p className="mt-2 text-xs text-gray-500">
          Searching Indian locations...
        </p>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}

      {suggestions.length > 0 && (
        <div className="absolute z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
          {suggestions.map((place) => (
            <button
              key={place.id}
              type="button"
              onClick={() => chooseLocation(place)}
              className="block w-full border-b border-gray-100 px-4 py-3 text-left last:border-0 hover:bg-blue-50"
            >
              <span className="block text-sm font-medium text-gray-800">
                {place.name}
              </span>
              <span className="mt-1 block text-xs text-gray-500">
                {[place.district, place.city, place.state, place.postcode]
                  .filter(Boolean)
                  .join(', ')}
              </span>
            </button>
          ))}
        </div>
      )}

      <p className="mt-2 text-xs text-gray-400">
        Location data © OpenStreetMap contributors
      </p>
    </div>
  );
}
