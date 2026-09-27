import { useId, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, X, MapPin } from 'react-feather';
import RecentSearches from './RecentSearches';
import { popularCitiesByRegion } from './popularCities';
import { useDebouncedValue } from './useDebouncedValue';
import { searchPlaces } from '../../api/openMeteo';
import type { Place } from '../../types/weather';

const regionInactive =
  'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:border-white/10 dark:hover:bg-white/10';
const regionActive = 'bg-brand-500 text-white border-brand-500 shadow-xs shadow-brand-500/20';

const placeLabel = (p: Place) => [p.admin1, p.country].filter(Boolean).join(', ');

interface SearchBoxProps {
  /** Free-text search (Enter, recent searches, popular city chips) */
  onSearch: (term: string) => void;
  /** A specific geocoded suggestion was picked */
  onSelectPlace: (place: Place) => void;
  recent: string[];
  /** Always visible (mobile overlay / error screen) instead of desktop-only */
  isMobileOpen?: boolean;
  autoFocus?: boolean;
}

const SearchBox = ({ onSearch, onSelectPlace, recent, isMobileOpen = false, autoFocus = isMobileOpen }: SearchBoxProps) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [activeRegion, setActiveRegion] = useState(Object.keys(popularCitiesByRegion)[0]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listId = useId();

  // Live suggestions from geocoding, debounced; superseded requests are aborted
  const term = useDebouncedValue(input.trim(), 250);
  const { data: suggestions = [], isFetching } = useQuery({
    queryKey: ['geocode', term.toLowerCase()],
    queryFn: ({ signal }) => searchPlaces(term, { count: 5, signal }),
    enabled: term.length >= 2,
    staleTime: 24 * 60 * 60_000,
  });
  const showSuggestions = input.trim().length >= 2 && term === input.trim();

  const reset = () => {
    setInput('');
    setActiveIndex(-1);
    setIsFocused(false);
  };

  const submitTerm = (value: string) => {
    const t = value.trim();
    if (!t) return;
    onSearch(t);
    reset();
  };

  const pick = (place: Place) => {
    onSelectPlace(place);
    reset();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (showSuggestions && activeIndex >= 0 && suggestions[activeIndex]) pick(suggestions[activeIndex]);
    else submitTerm(input);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === 'Escape') {
      setIsFocused(false);
    }
  };

  const showDropdown = isFocused;

  return (
    <div className={`relative w-full group ${isMobileOpen ? 'block animate-fadeIn' : 'hidden md:block'}`}>
      <form onSubmit={handleSubmit} role="search" className="relative w-full max-w-lg mx-auto">
        <div className="relative w-full transition-all duration-300">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-brand-500 transition-colors"
            size={16}
          />
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setActiveIndex(-1);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder="Search city or location..."
            aria-label="Search for a city"
            role="combobox"
            aria-expanded={showDropdown && showSuggestions && suggestions.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
            autoComplete="off"
            enterKeyHint="search"
            className="w-full py-3.5 pl-11 pr-11 rounded-full bg-white/65 dark:bg-slate-950/25 border border-white/60 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500/40 backdrop-blur-2xl shadow-soft group-focus-within:border-brand-400/50 transition-all duration-200"
            autoFocus={autoFocus}
          />

          {input && (
            <button
              type="button"
              onClick={() => setInput('')}
              aria-label="Clear search"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-950/5 dark:hover:bg-white/5 transition-all"
            >
              <X size={14} />
            </button>
          )}

          {showDropdown && (
            <div className="absolute z-50 w-full mt-3 bg-white dark:bg-slate-900 rounded-2xl shadow-[0_24px_60px_-12px_rgba(15,23,42,0.35)] dark:shadow-[0_24px_60px_-12px_rgba(2,6,23,0.7)] border border-slate-200 dark:border-white/10 overflow-hidden p-3 animate-fadeIn">
              {/* Live suggestions while typing */}
              {input.trim().length >= 2 && (
                <>
                  <ul id={listId} role="listbox" aria-label="Suggestions" className="space-y-0.5">
                    {showSuggestions &&
                      suggestions.map((place, i) => (
                        <li
                          key={`${place.lat},${place.lon}`}
                          id={`${listId}-${i}`}
                          role="option"
                          aria-selected={i === activeIndex}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => pick(place)}
                          className={`px-4 py-2.5 cursor-pointer flex items-center gap-3 rounded-2xl transition-all ${
                            i === activeIndex ? 'bg-brand-500/10 dark:bg-white/10' : 'hover:bg-brand-500/10 dark:hover:bg-white/5'
                          }`}
                        >
                          <MapPin size={14} className="text-slate-400 shrink-0" />
                          <span className="min-w-0">
                            <span className="block text-slate-800 dark:text-slate-200 font-semibold text-sm truncate">{place.name}</span>
                            {placeLabel(place) && (
                              <span className="block text-xs text-slate-500 dark:text-slate-400 truncate">{placeLabel(place)}</span>
                            )}
                          </span>
                        </li>
                      ))}
                  </ul>
                  {(!showSuggestions || isFetching) && suggestions.length === 0 && (
                    <p className="px-4 py-3 text-xs font-bold text-slate-400 dark:text-slate-500">Searching…</p>
                  )}
                  {showSuggestions && !isFetching && suggestions.length === 0 && (
                    <p className="px-4 py-3 text-xs font-bold text-slate-400 dark:text-slate-500">
                      No suggestions — press Enter to search anyway.
                    </p>
                  )}
                </>
              )}

              {!input && recent.length > 0 && (
                <div className="mb-4 px-1">
                  <RecentSearches searches={recent} onSearch={submitTerm} />
                </div>
              )}

              {/* Browse popular cities when the input is empty */}
              {!input && (
                <div className="p-1">
                  <p className="px-2 pt-1 pb-3.5 text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Popular Locations
                  </p>
                  <div className="flex gap-1.5 px-1 pb-3 flex-wrap">
                    {Object.keys(popularCitiesByRegion).map((region) => (
                      <button
                        key={region}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setActiveRegion(region)}
                        className={`px-3.5 py-1.5 rounded-full text-[10px] font-extrabold border transition-all duration-300 ${
                          activeRegion === region ? regionActive : regionInactive
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5 px-1 pb-1 max-h-36 overflow-y-auto hide-scrollbar">
                    {popularCitiesByRegion[activeRegion].map((city) => (
                      <button
                        key={city}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => submitTerm(city)}
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
