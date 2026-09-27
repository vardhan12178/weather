import { useQuery } from '@tanstack/react-query';
import { searchPlaces } from '../../api/openMeteo';
import { useDebouncedValue } from './useDebouncedValue';

/** Live geocoding suggestions for what the user is typing (debounced, cached, cancellable) */
export const usePlaceSuggestions = (input: string) => {
  const trimmed = input.trim();
  const term = useDebouncedValue(trimmed, 250);
  const query = useQuery({
    queryKey: ['geocode', term.toLowerCase()],
    queryFn: ({ signal }) => searchPlaces(term, { count: 6, signal }),
    enabled: term.length >= 2,
    staleTime: 24 * 60 * 60_000,
  });

  return {
    suggestions: term === trimmed ? (query.data ?? []) : [],
    /** Still typing, or waiting for the API */
    pending: trimmed.length >= 2 && (term !== trimmed || query.isFetching),
    active: trimmed.length >= 2,
  };
};
