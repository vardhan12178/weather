import { ChevronDown, Ellipsis, Navigation, Search, Star } from 'lucide-react';
import IconButton from './IconButton';

interface TopBarProps {
  title: string;
  /** Shown under the title once the big temperature has scrolled away */
  compactLine?: string;
  compact: boolean;
  isCurrentLocation: boolean;
  onOpenPlaces: () => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  favorite?: { active: boolean; disabled: boolean; onToggle: () => void };
}

/** Sticky app bar: place switcher on the left, actions on the right. */
const TopBar = ({
  title,
  compactLine,
  compact,
  isCurrentLocation,
  onOpenPlaces,
  onOpenSearch,
  onOpenSettings,
  favorite,
}: TopBarProps) => (
  <header
    className={`sticky top-0 z-30 pt-[env(safe-area-inset-top)] transition-colors duration-300 ${
      // Nearly opaque sky colour (set on <html> by Home) so scrolled content never shows through
      compact
        ? 'border-b border-white/10 bg-[color-mix(in_srgb,var(--sky-top-color,#1a5bbd)_95%,transparent)] backdrop-blur-xl'
        : 'border-b border-transparent'
    }`}
  >
    <div className="mx-auto flex h-14 max-w-6xl items-center gap-1 px-2 sm:px-4">
      <button
        type="button"
        onClick={onOpenPlaces}
        aria-label={`${title}. Change location`}
        className="flex min-h-11 min-w-0 items-center gap-1.5 rounded-full px-3 text-left transition-colors hover:bg-white/10 active:bg-white/20"
      >
        {isCurrentLocation && <Navigation size={14} className="shrink-0 fill-white" aria-hidden="true" />}
        <span className="min-w-0">
          <span className="block truncate text-headline font-semibold">{title}</span>
          {compact && compactLine && (
            <span className="block truncate text-footnote text-white/85 animate-fade-in">{compactLine}</span>
          )}
        </span>
        <ChevronDown size={18} className="shrink-0 text-white/85" aria-hidden="true" />
      </button>

      <div className="ml-auto flex items-center">
        <IconButton label="Search for a city" onClick={onOpenSearch}>
          <Search size={20} />
        </IconButton>
        {favorite && (
          <IconButton
            label={favorite.active ? 'Remove from saved places' : 'Save this place'}
            aria-pressed={favorite.active}
            disabled={favorite.disabled && !favorite.active}
            onClick={favorite.onToggle}
          >
            <Star size={20} className={favorite.active ? 'fill-amber-300 text-amber-300' : ''} />
          </IconButton>
        )}
        <IconButton label="Settings" onClick={onOpenSettings}>
          <Ellipsis size={22} />
        </IconButton>
      </div>
    </div>
  </header>
);

export default TopBar;
