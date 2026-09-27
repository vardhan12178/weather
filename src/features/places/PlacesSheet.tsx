import { useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Clock, MapPin, Navigation, Search, Trash2, X } from 'lucide-react';
import Sheet from '../../components/Sheet';
import IconButton from '../../components/IconButton';
import WeatherIcon from '../../components/WeatherIcon';
import { usePlaceSuggestions } from '../search/usePlaceSuggestions';
import { quickCities } from '../search/popularCities';
import { useWeatherSnapshot } from '../weather/queries';
import { MAX_FAVORITES, type SavedPlace } from '../favorites/useFavorites';
import { formatTemp } from '../../lib/units';
import type { Place, Unit } from '../../types/weather';

const regionLabel = (p: { admin1?: string; country?: string }) => [p.admin1, p.country].filter(Boolean).join(', ');

const rowClass = 'flex min-h-14 w-full items-center gap-3 rounded-2xl px-3 text-left transition-colors hover:bg-white/5 active:bg-white/10';

const SavedRow = ({ place, unit, onSelect, onRemove }: { place: SavedPlace; unit: Unit; onSelect: () => void; onRemove: () => void }) => {
  const { data } = useWeatherSnapshot(place.lat, place.lon);
  return (
    <li className="flex items-center">
      <button type="button" onClick={onSelect} className={`${rowClass} min-w-0 flex-1`}>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-headline font-semibold">{place.name}</span>
          <span className="block truncate text-footnote text-white/85">{data?.description ?? (regionLabel(place) || 'Tap to load')}</span>
        </span>
        {data && <WeatherIcon code={data.icon} size={28} />}
        <span className="w-12 text-right text-title font-medium tnum">{data ? formatTemp(data.temp, unit) : '--°'}</span>
      </button>
      <IconButton label={`Remove ${place.name} from saved places`} onClick={onRemove} className="text-white/85 hover:text-red-300">
        <Trash2 size={18} />
      </IconButton>
    </li>
  );
};

interface PlacesSheetProps {
  open: boolean;
  onClose: () => void;
  focusSearch: boolean;
  unit: Unit;
  favorites: SavedPlace[];
  recent: string[];
  onSelectPlace: (place: Place) => void;
  onSelectSaved: (place: SavedPlace) => void;
  onSearch: (term: string) => void;
  onLocate: () => void;
  onRemoveFavorite: (place: SavedPlace) => void;
}

const PlacesSheet = ({
  open,
  onClose,
  focusSearch,
  unit,
  favorites,
  recent,
  onSelectPlace,
  onSelectSaved,
  onSearch,
  onLocate,
  onRemoveFavorite,
}: PlacesSheetProps) => {
  const [input, setInput] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const { suggestions, pending, active } = usePlaceSuggestions(input);
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const close = () => {
    setInput('');
    setActiveIndex(-1);
    onClose();
  };
  const choose = (place: Place) => {
    onSelectPlace(place);
    close();
  };
  const search = (term: string) => {
    if (!term.trim()) return;
    onSearch(term.trim());
    close();
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) choose(suggestions[activeIndex]);
    else if (suggestions.length > 0 && suggestions[0].name?.toLowerCase() === input.trim().toLowerCase()) choose(suggestions[0]);
    else search(input);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    }
  };

  const searchField = (
    <form role="search" onSubmit={submit} className="relative">
      <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/70" aria-hidden="true" />
      <input
        type="search"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setActiveIndex(-1);
        }}
        onKeyDown={onKeyDown}
        placeholder="Search for a city"
        aria-label="Search for a city"
        role="combobox"
        aria-expanded={active && suggestions.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
        autoComplete="off"
        enterKeyHint="search"
        ref={inputRef}
        className="h-12 w-full rounded-2xl bg-surface-raised pl-11 pr-11 text-body text-white placeholder:text-white/60 focus:outline-2 focus:outline-white/60 [&::-webkit-search-cancel-button]:hidden"
      />
      {input && (
        <button
          type="button"
          onClick={() => setInput('')}
          aria-label="Clear search"
          className="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-white/85 hover:bg-white/10"
        >
          <X size={16} />
        </button>
      )}
    </form>
  );

  return (
    // Focus the field only when opened from the search button, so the keyboard doesn't pop up otherwise
    <Sheet open={open} onClose={close} title="Places" header={searchField} initialFocusRef={focusSearch ? inputRef : undefined}>
      {active ? (
        <ul id={listId} role="listbox" aria-label="Suggestions" className="-mx-2">
          {suggestions.map((place, i) => (
            <li key={`${place.lat},${place.lon}`} id={`${listId}-${i}`} role="option" aria-selected={i === activeIndex}>
              <button type="button" onClick={() => choose(place)} className={`${rowClass} ${i === activeIndex ? 'bg-white/10' : ''}`}>
                <MapPin size={18} className="shrink-0 text-white/70" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block truncate text-headline font-semibold">{place.name}</span>
                  {regionLabel(place) && <span className="block truncate text-footnote text-white/85">{regionLabel(place)}</span>}
                </span>
              </button>
            </li>
          ))}
          {pending && suggestions.length === 0 && <li className="px-3 py-4 text-footnote text-white/85">Searching…</li>}
          {!pending && suggestions.length === 0 && (
            <li className="px-3 py-4 text-footnote text-white/85">No matching places. Press Enter to search anyway.</li>
          )}
        </ul>
      ) : (
        <div className="flex flex-col gap-5">
          <button
            type="button"
            onClick={() => {
              onLocate();
              close();
            }}
            className={`${rowClass} -mx-2 w-[calc(100%+1rem)]`}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-500">
              <Navigation size={16} className="fill-white" aria-hidden="true" />
            </span>
            <span className="text-headline font-semibold">Use my current location</span>
          </button>

          <section aria-labelledby="saved-title">
            <h3 id="saved-title" className="mb-1 text-footnote font-semibold text-white/85">
              Saved places · {favorites.length}/{MAX_FAVORITES}
            </h3>
            {favorites.length === 0 ? (
              <p className="py-2 text-footnote text-white/85">Tap the star at the top of the forecast to save a place.</p>
            ) : (
              <ul className="-mx-2">
                {favorites.map((place) => (
                  <SavedRow
                    key={`${place.name}-${place.lat}-${place.lon}`}
                    place={place}
                    unit={unit}
                    onSelect={() => {
                      onSelectSaved(place);
                      close();
                    }}
                    onRemove={() => onRemoveFavorite(place)}
                  />
                ))}
              </ul>
            )}
          </section>

          {recent.length > 0 && (
            <section aria-labelledby="recent-title">
              <h3 id="recent-title" className="mb-2 text-footnote font-semibold text-white/85">
                Recent searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {recent.map((term) => (
                  <button key={term} type="button" onClick={() => search(term)} className="flex min-h-11 items-center gap-1.5 rounded-full bg-surface-raised px-4 text-body hover:bg-white/15">
                    <Clock size={14} className="text-white/70" aria-hidden="true" />
                    {term}
                  </button>
                ))}
              </div>
            </section>
          )}

          <section aria-labelledby="popular-title">
            <h3 id="popular-title" className="mb-2 text-footnote font-semibold text-white/85">
              Popular
            </h3>
            <div className="flex flex-wrap gap-2">
              {quickCities.map((city) => (
                <button key={city} type="button" onClick={() => search(city)} className="min-h-11 rounded-full bg-surface-raised px-4 text-body hover:bg-white/15">
                  {city}
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </Sheet>
  );
};

export default PlacesSheet;
