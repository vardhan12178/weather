import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { MapPin, Search, X } from 'react-feather';
import VoiceSearch from './VoiceSearch';
import RecentSearches from './RecentSearches';

const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const popularLocations = ['Mumbai, India', 'Delhi, India', 'Bengaluru, India', 'London, United Kingdom', 'New York, United States', 'Tokyo, Japan'];

const readRecentSearches = () => {
  try {
    const value = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const SearchBox = ({ onSearch, isMobileOpen = false }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState(readRecentSearches);
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const term = input.trim();
    if (term.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return undefined;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await axios.get(GEOCODE_URL, {
          params: { name: term, count: 6, language: 'en', format: 'json' },
          signal: controller.signal,
        });
        const next = (response.data.results || []).map((result) => ({
          id: result.id || `${result.latitude}-${result.longitude}`,
          name: result.name,
          detail: [result.admin1, result.country].filter(Boolean).join(', '),
          query: [result.name, result.admin1, result.country].filter(Boolean).join(', '),
        }));
        setSuggestions(next);
      } catch (error) {
        if (!axios.isCancel(error)) setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [input]);

  const visibleDefaults = useMemo(
    () => (recentSearches.length ? recentSearches : popularLocations),
    [recentSearches]
  );

  const updateRecent = (term) => {
    const updated = [term, ...recentSearches.filter((item) => item !== term)].slice(0, 6);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSearch = (value) => {
    const term = value.trim();
    if (!term) return;
    onSearch(term);
    updateRecent(term);
    setInput('');
    setSuggestions([]);
    setIsFocused(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSearch(input);
  };

  const showDropdown = isFocused;

  return (
    <div className={`relative mx-auto w-full max-w-xl ${isMobileOpen ? 'block' : 'hidden md:block'}`} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setIsFocused(false);
    }}>
      <form onSubmit={handleSubmit} role="search">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input
            type="search"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search city or airport"
            aria-label="Search city or airport"
            role="combobox"
            aria-autocomplete="list"
            aria-controls="location-suggestions"
            aria-expanded={showDropdown}
            autoFocus={isMobileOpen}
            className="premium-search-input"
          />
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
            {input && (
              <button type="button" onClick={() => setInput('')} className="grid h-9 w-9 place-items-center rounded-full text-slate-400 transition hover:bg-slate-950/5 hover:text-slate-800 dark:hover:bg-white/10 dark:hover:text-white" aria-label="Clear search">
                <X size={15} />
              </button>
            )}
            <VoiceSearch setLocation={handleSearch} />
          </div>
        </div>

        {showDropdown && (
          <div id="location-suggestions" className="premium-search-menu">
            {input.trim().length >= 2 ? (
              <div role="listbox" aria-label="Location suggestions">
                <p className="premium-menu-label">{isSearching ? 'Searching places…' : 'Suggested places'}</p>
                {!isSearching && suggestions.length === 0 && (
                  <p className="px-3 py-4 text-sm text-slate-500 dark:text-slate-400">No suggestions yet. Press Enter to search this exact location.</p>
                )}
                {suggestions.map((suggestion) => (
                  <button key={suggestion.id} type="button" role="option" aria-selected="false" onClick={() => handleSearch(suggestion.query)} className="premium-location-option">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-300"><MapPin size={15} /></span>
                    <span className="min-w-0 text-left">
                      <span className="block truncate text-sm font-bold text-slate-900 dark:text-white">{suggestion.name}</span>
                      <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{suggestion.detail}</span>
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div>
                <p className="premium-menu-label">{recentSearches.length ? 'Recent searches' : 'Popular places'}</p>
                {recentSearches.length ? (
                  <RecentSearches searches={recentSearches} onSearch={handleSearch} />
                ) : (
                  <div className="grid gap-1 sm:grid-cols-2">
                    {visibleDefaults.map((place) => (
                      <button key={place} type="button" onClick={() => handleSearch(place)} className="premium-location-option py-2.5">
                        <MapPin size={14} className="shrink-0 text-sky-500" />
                        <span className="truncate text-sm font-semibold">{place}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBox;
