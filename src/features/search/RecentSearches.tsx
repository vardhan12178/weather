import { Clock } from 'react-feather';

interface RecentSearchesProps {
  searches: string[];
  onSearch: (term: string) => void;
}

const RecentSearches = ({ searches, onSearch }: RecentSearchesProps) => {
  if (searches.length === 0) return null;

  return (
    <div className="mt-4 w-full animate-fadeIn">
      <h3 className="text-xs font-bold text-slate-500 dark:text-white/40 uppercase tracking-wider mb-3 px-1">
        Recently viewed
      </h3>

      <div className="flex flex-wrap gap-2">
        {searches.map((search) => (
          <button
            key={search}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onSearch(search)}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200/80 dark:bg-white/10 border border-transparent dark:border-white/10 text-slate-700 dark:text-gray-200 hover:bg-brand-500 hover:text-white dark:hover:bg-brand-600 transition-all duration-200"
          >
            <Clock size={12} className="text-slate-600 dark:text-white/60 group-hover:text-white transition-colors" />
            <span className="text-sm font-medium">{search}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;
