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
      className={`p-2.5 rounded-full bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out ${
        isListening ? 'animate-pulse ring-2 ring-blue-500' : ''
      }`}
      aria-label="Voice Search"
    >
      <FaMicrophone className={`w-5 h-5 text-white ${isListening ? 'scale-110' : 'scale-100'}`} />
    </button>
  );
};

export default VoiceSearch;