const Favorites = ({ favorites, onSearch, onRemove }) => (
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Favorites</h3>
      <ul className="mt-2 space-y-1">
        {favorites.map((fav, index) => (
          <li key={index} className="flex items-center justify-between">
            <span
              onClick={() => onSearch(fav)}
              className="cursor-pointer text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {fav}
            </span>
            <button
              onClick={() => onRemove(fav)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
  
  export default Favorites;