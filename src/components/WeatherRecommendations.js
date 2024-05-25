import { WiDaySunny, WiSnow, WiCloudy, WiThunderstorm, WiThermometer, WiUmbrella } from 'weather-icons-react';

const WeatherRecommendations = ({ weatherData }) => {
  const getRecommendations = (weather) => {
    const { main, weather: weatherDetails } = weather;
    const condition = weatherDetails[0].main;
    const temp = main.temp;

    if (condition === 'Rain') {
      return { message: "Don't forget your umbrella!", icon: <WiUmbrella size={48} color="#FFF" /> };
    }
    if (condition === 'Thunderstorm') {
      return { message: "Severe weather alert! Stay indoors and stay safe.", icon: <WiThunderstorm size={48} color="#FFF" /> };
    }
    if (condition === 'Snow') {
      return { message: "It's snowing! Wear warm clothes and drive safely.", icon: <WiSnow size={48} color="#FFF" /> };
    }
    if (condition === 'Clouds') {
      return { message: "It's cloudy. Perfect weather for a walk!", icon: <WiCloudy size={48} color="#FFF" /> };
    }

    if (temp > 30) {
      return { message: "It's very hot outside. Stay hydrated and avoid direct sunlight!", icon: <WiThermometer size={48} color="#FFF" /> };
    }
    if (temp > 25) {
      return { message: "It's a great day for the beach!", icon: <WiDaySunny size={48} color="#FFF" /> };
    }
    if (temp < 0) {
      return { message: "Stay warm and consider indoor activities!", icon: <WiSnow size={48} color="#FFF" /> };
    }

    return { message: "It's a nice day for a walk!", icon: <WiDaySunny size={48} color="#FFF" /> };
  };

  const recommendation = getRecommendations(weatherData);

  return (
    <div className="bg-gradient-to-r mb-4 from-green-500 to-teal-600 dark:from-gray-800 dark:to-gray-800 p-3 mt-4 rounded-xl shadow-lg text-center text-white">
      <h2 className="text-2xl font-bold mb-2">Recommendations</h2>
      <div className="flex flex-col items-center">
        {recommendation.icon}
        <p className="text-lg mt-2">{recommendation.message}</p>
      </div>
    </div>
  );
};

export default WeatherRecommendations;
