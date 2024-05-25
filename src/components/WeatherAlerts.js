const WeatherAlerts = ({ weatherData }) => {
  const showAlert = (weather) => {
    const condition = weather.weather[0].main;

    switch (condition) {
      case 'Thunderstorm':
        return "⚠️ Severe Thunderstorm Alert!";
      case 'Snow':
        return "❄️ Snow Alert!";
      case 'Rain':
        return "☔️ Rain Alert!";
      case 'Clear':
        if (weather.main.temp > 35) {
          return "🔥 Extreme Heat Alert!";
        }
        break; // Add break statement here
      case 'Haze':
        if (weather.main.temp > 35) {
          return "🔥 Extreme Heat Alert!";
        } else if (weather.main.temp < 0) {
          return "🥶 Extreme Cold Alert!";
        }
        break; // Add break statement here
      default:
        return null;
    }
  };

  const alertMessage = showAlert(weatherData);

  return (
    alertMessage && (
      <div className="bg-red-600 dark:bg-gray-800 text-white text-center p-4 mb-4 rounded-lg shadow-md">
        <p className="font-bold">{alertMessage}</p>
      </div>
    )
  );
};

export default WeatherAlerts;
