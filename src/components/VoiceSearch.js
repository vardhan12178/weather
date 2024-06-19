import { useState } from 'react';
import { FaMicrophone } from 'react-icons/fa';

const VoiceSearch = ({ setLocation }) => {
  const [isListening, setIsListening] = useState(false);

  const handleVoiceSearch = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      console.error('Speech recognition error:', event.error);
    };

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setLocation(result);
    };

    recognition.start();
  };

  return (
    <button
      type="button"
      onClick={handleVoiceSearch}
      className={`p-1.5 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors dark:bg-gray-900 dark:hover:bg-gray-500 dark:focus:ring-2 dark:focus:ring-gray-500 dark:focus:outline-none ${isListening ? 'animate-pulse' : ''}`}
      style={{ marginLeft: '-35px', zIndex: '1', position: 'relative', top: '-5px' }}
    >
      <FaMicrophone />
    </button>
  );
};

export default VoiceSearch;
