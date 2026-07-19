import React, { useState } from 'react';
import { Mic } from 'react-feather';

const VoiceSearch = ({ setLocation }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported] = useState(() => 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const handleVoiceSearch = () => {
    if (!isSupported) return;

    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      // Clean up the result (some browsers add a period at the end)
      setLocation(result.replace(/\.$/, ""));
    };

    recognition.start();
  };

  return (
    <button
      type="button"
      onClick={handleVoiceSearch}
      disabled={!isSupported}
      className={`grid h-10 w-10 place-items-center rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-35 ${
        isListening 
          ? 'bg-red-500 text-white animate-pulse shadow-md scale-110' 
          : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:bg-black/5 dark:hover:bg-white/10'
      }`}
      aria-label={isSupported ? 'Search by voice' : 'Voice search is unavailable'}
      title={isSupported ? 'Search by voice' : 'Voice search is unavailable in this browser'}
    >
      <Mic size={18} className={isListening ? 'animate-bounce' : ''} />
    </button>
  );
};

export default VoiceSearch;
