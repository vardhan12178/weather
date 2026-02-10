import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin } from 'react-feather';
import VoiceSearch from './VoiceSearch';
import RecentSearches from './RecentSearches';

const popularCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat'
];

const SearchBox = ({ onSearch, isMobileOpen, setIsMobileOpen }) => {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef();

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        setRecentSearches(saved);
    }, []);

    useEffect(() => {
        if (input.trim()) {
            const filtered = [...new Set([...recentSearches, ...popularCities])]
                .filter(city => city.toLowerCase().includes(input.toLowerCase()));
            setSuggestions(filtered.slice(0, 5));
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
        if (term && /^[a-zA-Z\s,]+$/.test(term)) {
            onSearch(term);
            updateRecent(term);
            setInput('');
            setIsFocused(false);
            // If mobile, checking if we need to close prompt isn't handled here directly unless passed prop, 
            // but usually search implies closure of search UI in mobile if it was an overlay.
            // For this implementation effectively just clearing input is enough as parent handles data.
        }
    };

    // Logic to determine if dropdown should show
    const showDropdown = isFocused && (suggestions.length > 0 || (!input && recentSearches.length > 0));

    return (
        <div className={`relative w-full group ${isMobileOpen ? 'block' : 'hidden md:block'}`}>
            <form onSubmit={handleSubmit} className="relative w-full max-w-lg mx-auto">
                <div className="relative w-full transition-transform duration-300 group-focus-within:scale-105">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                        placeholder="Search city..."
                        className="w-full py-3 pl-12 pr-14 rounded-full bg-white/80 dark:bg-black/30 border border-white/20 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-xl shadow-lg transition-all"
                        autoFocus={isMobileOpen} // Auto focus on mobile open
                    />

                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                        {input && (
                            <button type="button" onClick={() => setInput('')} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
                                <X size={16} />
                            </button>
                        )}
                        <div className="border-l border-gray-300 dark:border-white/10 pl-2">
                            <VoiceSearch setLocation={handleSearch} />
                        </div>
                    </div>

                    {/* UNIFIED DROPDOWN */}
                    {showDropdown && (
                        <div className="absolute z-50 w-full mt-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-in fade-in slide-in-from-top-2 p-2">
                            {input && suggestions.length > 0 && (
                                <ul>
                                    {suggestions.map((city, idx) => (
                                        <li
                                            key={city}
                                            onClick={() => handleSearch(city)}
                                            className="px-4 py-3 cursor-pointer flex items-center space-x-3 hover:bg-blue-500/10 rounded-xl transition-colors"
                                        >
                                            <MapPin size={16} className="text-gray-400" />
                                            <span className="text-gray-800 dark:text-gray-200 font-medium">{city}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {!input && recentSearches.length > 0 && (
                                <div className="p-2">
                                    <RecentSearches searches={recentSearches} onSearch={handleSearch} />
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
