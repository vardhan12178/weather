import { WiHumidity, WiStrongWind, WiThermometer } from 'react-icons/wi';

const WeatherCard = ({ weatherData, error }) => {
  if (error) {
    return (
      <div className="bg-red-600 dark:bg-red-800 p-6 rounded-xl shadow-lg text-center text-white">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-2">Error</h2>
        <p className="text-lg sm:text-xl mb-2">{error}</p>
        <p className="text-3xl sm:text-5xl font-bold mb-4">😞</p>
      </div>
    );
  }

  const iconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-gray-800 dark:to-gray-700 p-3 rounded-xl shadow-lg text-center text-white">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-2">{weatherData.name}</h2>
      <img src={iconUrl} alt={weatherData.weather[0].description} className="mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-4" />
      <p className="text-lg sm:text-xl capitalize mb-2">{weatherData.weather[0].description}</p>
      <p className="text-3xl text-yellow-200 dark:text-yellow-200 sm:text-5xl font-bold mb-4">{weatherData.main.temp}°C</p>
      <div className="flex flex-col sm:flex-row justify-around text-lg mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="flex flex-col items-center">
          <WiThermometer className="w-6 h-6 mr-2 text-blue-300 dark:text-gray-300" />
          <p className="font-semibold">RealFeel</p>
          <p>{weatherData.main.feels_like}°C</p>
        </div>
        <div className="flex flex-col items-center">
          <WiHumidity className="w-6 h-6 mr-2 text-blue-300 dark:text-gray-300" />
          <p className="font-semibold">Humidity</p>
          <p>{weatherData.main.humidity}%</p>
        </div>
        <div className="flex flex-col items-center">
          <WiStrongWind className="w-6 h-6 mr-2 text-blue-300 dark:text-gray-300" />
          <p className="font-semibold">Wind</p>
          <p>{weatherData.wind.speed} m/s</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
