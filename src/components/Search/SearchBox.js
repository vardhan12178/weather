import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin } from 'react-feather';
import VoiceSearch from './VoiceSearch';
import RecentSearches from './RecentSearches';

// ─── Comprehensive Indian cities organised by region ────────────────────────
const indianCitiesByRegion = {
  'North': [
    'Delhi', 'Chandigarh', 'Amritsar', 'Ludhiana', 'Jalandhar',
    'Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner',
    'Lucknow', 'Agra', 'Varanasi', 'Kanpur', 'Allahabad', 'Meerut',
    'Dehradun', 'Haridwar', 'Rishikesh', 'Shimla', 'Mussoorie',
    'Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad', 'Mathura',
  ],
  'South': [
    'Bangalore', 'Chennai', 'Hyderabad', 'Kochi', 'Thiruvananthapuram',
    'Coimbatore', 'Madurai', 'Vijayawada', 'Visakhapatnam', 'Mangalore',
    'Mysore', 'Tiruchirappalli', 'Salem', 'Tirupati', 'Kozhikode',
    'Tirunelveli', 'Vellore', 'Guntur', 'Warangal', 'Nellore',
  ],
  'West': [
    'Mumbai', 'Pune', 'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot',
    'Nashik', 'Nagpur', 'Aurangabad', 'Kolhapur', 'Solapur',
    'Thane', 'Navi Mumbai', 'Panaji', 'Vasco da Gama', 'Bhavnagar',
    'Jamnagar', 'Gandhinagar', 'Anand', 'Amravati',
  ],
  'East': [
    'Kolkata', 'Bhubaneswar', 'Patna', 'Ranchi', 'Guwahati',
    'Siliguri', 'Cuttack', 'Jamshedpur', 'Dhanbad', 'Puri',
    'Imphal', 'Shillong', 'Agartala', 'Aizawl', 'Dibrugarh',
    'Brahmapur', 'Rourkela', 'Bokaro', 'Durgapur', 'Asansol',
  ],
  'Central': [
    'Bhopal', 'Indore', 'Raipur', 'Jabalpur', 'Gwalior',
    'Ujjain', 'Bilaspur', 'Sagar', 'Satna', 'Korba',
  ],
};

const allIndianCities = Object.values(indianCitiesByRegion).flat();

// Region tabs — unified to the brand palette for a clean, cohesive look
const regionInactive = 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:border-white/10 dark:hover:bg-white/10';
const regionActive = 'bg-brand-500 text-white border-brand-500 shadow-sm shadow-brand-500/20';

const regionColors = {
  North: regionInactive, South: regionInactive, West: regionInactive, East: regionInactive, Central: regionInactive,
};

const regionActiveColors = {
  North: regionActive, South: regionActive, West: regionActive, East: regionActive, Central: regionActive,
};

const SearchBox = ({ onSearch, isMobileOpen }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [activeRegion, setActiveRegion] = useState('North');
  const inputRef = useRef();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(saved);
  }, []);

  useEffect(() => {
    if (input.trim()) {
      const filtered = [...new Set([...recentSearches, ...allIndianCities])]
        .filter(city => city.toLowerCase().includes(input.toLowerCase()));
      setSuggestions(filtered.slice(0, 6));
    } else {
      setSuggestions([]);
    }
  }, [input, recentSearches]);

  const updateRecent = city => {
    const updated = [city, ...recentSearches.filter(c => c !== city)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSubmit = e => {
    e.preventDefault();
    handleSearch(input);
  };

  const handleSearch = (city) => {
    const term = city.trim();
    if (!term) return;
    onSearch(term);
    updateRecent(term);
    setInput('');
    setIsFocused(false);
  };

  const showDropdown = isFocused && (
    suggestions.length > 0 ||
    (!input && recentSearches.length > 0) ||
    !input
  );

  return (
    <div className={`relative w-full group ${isMobileOpen ? 'block animate-in fade-in slide-in-from-top-1 duration-300' : 'hidden md:block'}`}>
      <form onSubmit={handleSubmit} className="relative w-full max-w-lg mx-auto">
        <div className="relative w-full transition-all duration-300">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-brand-500 transition-colors"
            size={16}
          />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search city or location..."
            className="w-full py-3.5 pl-11 pr-14 rounded-full bg-white/65 dark:bg-slate-950/25 border border-white/60 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 backdrop-blur-2xl shadow-soft group-focus-within:border-brand-400/50 transition-all duration-200"
            autoFocus={isMobileOpen}
          />

          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center space-x-1.5">
            {input && (
              <button
                type="button"
                onClick={() => setInput('')}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-950/5 dark:hover:bg-white/5 transition-all"
              >
                <X size={14} />
              </button>
            )}
            <div className="border-l border-slate-950/10 dark:border-white/10 pl-1.5">
              <VoiceSearch setLocation={handleSearch} />
            </div>
          </div>

          {/* ── UNIFIED DROPDOWN ── */}
          {showDropdown && (
            <div className="absolute z-50 w-full mt-3 bg-white dark:bg-slate-900 rounded-[24px] shadow-[0_24px_60px_-12px_rgba(15,23,42,0.35)] dark:shadow-[0_24px_60px_-12px_rgba(2,6,23,0.7)] border border-slate-200 dark:border-white/10 overflow-hidden p-3 animate-in fade-in slide-in-from-top-2 duration-300">

              {/* Autocomplete suggestions (while typing) */}
              {input && suggestions.length > 0 && (
                <ul className="mb-1 space-y-0.5">
                  {suggestions.map(city => (
                    <li
                      key={city}
                      onClick={() => handleSearch(city)}
                      className="px-4 py-2.5 cursor-pointer flex items-center space-x-3 hover:bg-brand-500/10 dark:hover:bg-white/5 rounded-2xl transition-all"
                    >
                      <MapPin size={14} className="text-slate-400 shrink-0" />
                      <span className="text-slate-800 dark:text-slate-200 font-semibold text-sm">{city}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* No match message */}
              {input && suggestions.length === 0 && (
                <p className="px-4 py-3 text-xs font-bold text-slate-400 dark:text-slate-500">
                  No matching locations — try typing more or search by voice.
                </p>
              )}

              {/* Recent searches (when input is empty) */}
              {!input && recentSearches.length > 0 && (
                <div className="mb-4 px-1">
                  <RecentSearches searches={recentSearches} onSearch={handleSearch} />
                </div>
              )}

              {/* Regional city browser (when input is empty) */}
              {!input && (
                <div className="p-1">
                  <p className="px-2 pt-1 pb-3.5 text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Popular Locations
                  </p>

                  {/* Region tabs */}
                  <div className="flex gap-1.5 px-1 pb-3 flex-wrap">
                    {Object.keys(indianCitiesByRegion).map(region => (
                      <button
                        key={region}
                        type="button"
                        onClick={() => setActiveRegion(region)}
                        className={`px-3.5 py-1.5 rounded-full text-[10px] font-extrabold border transition-all duration-300 ${
                          activeRegion === region
                            ? regionActiveColors[region]
                            : regionColors[region]
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>

                  {/* City chips for active region */}
                  <div className="flex flex-wrap gap-1.5 px-1 pb-1 max-h-36 overflow-y-auto hide-scrollbar">
                    {indianCitiesByRegion[activeRegion].map(city => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => handleSearch(city)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-slate-950/5 dark:bg-white/5 hover:bg-brand-500 hover:text-white dark:hover:bg-brand-500 text-slate-700 dark:text-slate-300 transition-all duration-200"
                      >
                        <MapPin size={10} className="opacity-55" />
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchBox;

