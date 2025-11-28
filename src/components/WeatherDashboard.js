import React from 'react';
import Header from './Header';
import WeatherCard from './WeatherCard';
import WeatherForecast from './WeatherForecast';
import HourlyTemperature from './HourlyTemperature';
import WeatherAlerts from './WeatherAlerts';
import Footer from './Footer';
import NotFound from './NotFound';

const WeatherDashboard = ({ 
  data, 
  setLocation, 
  setCoordinates, 
  darkMode, 
  toggleDarkMode 
}) => {
  // FIXED: Destructure loading and error from 'data' here
  const { weatherData, aqi, location, coordinates, loading, error } = data;

  return (
    <div className="relative z-10 h-screen flex flex-col overflow-hidden font-sans">
      <Header
        setLocation={setLocation}
        setCoordinates={setCoordinates}
        toggleDarkMode={toggleDarkMode}
        darkMode={darkMode}
      />

      <main className="flex-grow w-full relative overflow-hidden flex flex-col items-center justify-center">
        {/* State 1: Loading */}
        {loading && (
           <div className="flex flex-col items-center gap-4 animate-pulse">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <div className="text-2xl font-light text-gray-800 dark:text-white">Scanning Atmosphere...</div>
           </div>
        )}
        
        {/* State 2: Error / Not Found */}
        {!loading && error && (
           <div className="z-50 w-full h-full flex items-center justify-center p-4">
             <NotFound />
           </div>
        )}

        {/* State 3: Success (The Dashboard) */}
        {!loading && !error && weatherData && (
          <div className="grid grid-cols-1 lg:grid-cols-12 h-full w-full gap-6 p-4 lg:p-8 animate-in fade-in duration-500">
            
            {/* COLUMN 1: LEFT SIDEBAR (Desktop Only) */}
            <div className="hidden lg:flex lg:col-span-3 flex-col justify-center h-[85%] mt-auto mb-auto">
               <h3 className="text-gray-500 dark:text-white/40 font-bold uppercase tracking-widest text-xs mb-4 pl-2">
                 5-Day Forecast
               </h3>
               <WeatherForecast location={location} coordinates={coordinates} />
            </div>

            {/* COLUMN 2: CENTER STAGE */}
            <div className="col-span-1 lg:col-span-6 flex flex-col items-center justify-center relative">
               <div className="absolute top-0 w-full max-w-md z-50">
                  <WeatherAlerts weatherData={weatherData} />
               </div>
               <WeatherCard weatherData={weatherData} aqi={aqi} setCoordinates={setCoordinates} />
            </div>

            {/* COLUMN 3: RIGHT SIDEBAR (Desktop Only) */}
            <div className="hidden lg:flex lg:col-span-3 flex-col justify-center h-[85%] mt-auto mb-auto">
               <h3 className="text-gray-500 dark:text-white/40 font-bold uppercase tracking-widest text-xs mb-4 text-right pr-2">
                 Hourly Trends
               </h3>
               <HourlyTemperature lat={coordinates.lat} lon={coordinates.lon} />
            </div>

            {/* MOBILE VIEW: Hourly First, Then 5-Day */}
            <div className="lg:hidden col-span-1 flex flex-col gap-8 overflow-y-auto pb-24 w-full px-2">
               
               {/* 1. Hourly Trends */}
               <div>
                  <h3 className="text-gray-500 dark:text-white/40 font-bold uppercase tracking-widest text-xs mb-3">
                    Hourly Trends
                  </h3>
                  <HourlyTemperature lat={coordinates.lat} lon={coordinates.lon} />
               </div>

               {/* 2. 5-Day Forecast */}
               <div>
                  <h3 className="text-gray-500 dark:text-white/40 font-bold uppercase tracking-widest text-xs mb-3">
                    5-Day Forecast
                  </h3>
                  <WeatherForecast location={location} coordinates={coordinates} />
               </div>

            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default WeatherDashboard;