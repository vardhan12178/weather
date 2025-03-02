const RecentSearches = ({ searches, onSearch }) => (
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Searches</h3>
      <ul className="mt-2 space-y-1">
        {searches.map((search, index) => (
          <li
            key={index}
            onClick={() => onSearch(search)}
            className="cursor-pointer text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {search}
          </li>
        ))}
      </ul>
    </div>
  );
  
  export default RecentSearches;