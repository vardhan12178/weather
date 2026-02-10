import React, { useState } from 'react';
import { Mic } from 'react-feather';

const VoiceSearch = ({ setLocation }) => {
  const [isListening, setIsListening] = useState(false);

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice search is not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
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
      className={`p-2 rounded-full transition-all duration-300 focus:outline-none ${
        isListening 
          ? 'bg-red-500 text-white animate-pulse shadow-md scale-110' 
          : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:bg-black/5 dark:hover:bg-white/10'
      }`}
      aria-label="Voice Search"
      title="Search by voice"
    >
      <Mic size={18} className={isListening ? 'animate-bounce' : ''} />
    </button>
  );
};

export default VoiceSearch;