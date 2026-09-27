import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { searchPlaces } from '../../api/openMeteo';
import { useDebouncedValue } from './useDebouncedValue';

/**
 * Live geocoding suggestions for what the user is typing (debounced, cached,
 * cancellable). The previous results stay on screen while the next ones load,
 * so the list doesn't flash empty on every keystroke.
 */
export const usePlaceSuggestions = (input: string) => {
  const trimmed = input.trim();
  const term = useDebouncedValue(trimmed, 250);
  const query = useQuery({
    queryKey: ['geocode', term.toLowerCase()],
    queryFn: ({ signal }) => searchPlaces(term, { count: 6, signal }),
    enabled: term.length >= 2,
    staleTime: 24 * 60 * 60_000,
    placeholderData: keepPreviousData,
  });

  const active = trimmed.length >= 2;
  const pending = active && (term !== trimmed || query.isFetching);
  return {
    suggestions: active ? (query.data ?? []) : [],
    /** Still typing, or waiting for the API */
    pending,
    /** The list shows results for an earlier input */
    stale: pending || query.isPlaceholderData,
    active,
  };
};
