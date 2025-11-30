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
  const { weatherData, aqi, location, coordinates, loading, error } = data;

  return (
    // ROOT: h-screen keeps the app fitting the window
    <div className="relative z-10 h-screen flex flex-col font-sans bg-blue-300/10 dark:bg-slate-900 transition-colors duration-300">
      
      <Header
        setLocation={setLocation}
        setCoordinates={setCoordinates}
        toggleDarkMode={toggleDarkMode}
        darkMode={darkMode}
      />

      {/* MAIN: Adjusted flex properties for better vertical centering on small screens */}
      <main className="flex-grow w-full relative overflow-y-auto overflow-x-hidden flex flex-col items-center">
        
        {/* State 1: Loading */}
        {loading && (
           <div className="flex flex-col items-center justify-center h-full gap-4 animate-pulse">
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
          <div className="flex flex-col w-full max-w-[1600px] items-center">
            
            {/* LAYOUT FIX: Preserved your mobile optimizations (gap-3, p-2) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 w-full gap-3 sm:gap-6 p-2 sm:p-4 lg:p-6 animate-in fade-in duration-500">
              
              {/* COLUMN 1: LEFT SIDEBAR (Desktop Only) */}
              <div className="hidden lg:flex lg:col-span-3 flex-col justify-center h-full pt-10">
                 <WeatherForecast location={location} coordinates={coordinates} />
              </div>

              {/* COLUMN 2: CENTER STAGE */}
              {/* FIX: Removed 'lg:justify-center' so items stack naturally from the top */}
              <div className="col-span-1 lg:col-span-6 flex flex-col items-center justify-start relative mt-1 sm:mt-4 lg:mt-0">
                 
                 {/* ALERTS: OVERLAP FIX 
                     1. Removed 'lg:absolute' and 'lg:top-0'.
                     2. Added 'mb-4' for spacing.
                     Now the Alert is a solid block that pushes the WeatherCard down.
                 */}
                 <div className="w-full max-w-md z-50 mb-4 transition-all duration-300">
                    <WeatherAlerts weatherData={weatherData} />
                 </div>

                 <WeatherCard weatherData={weatherData} aqi={aqi} setCoordinates={setCoordinates} />
              </div>

              {/* COLUMN 3: RIGHT SIDEBAR (Desktop Only) */}
              <div className="hidden lg:flex lg:col-span-3 flex-col justify-center h-full pt-10">
                 <HourlyTemperature lat={coordinates.lat} lon={coordinates.lon} />
              </div>

              {/* MOBILE SPECIFIC SECTION */}
              <div className="lg:hidden col-span-1 flex flex-col gap-8 w-full px-1 mt-6 pb-6">
                 
                 {/* 1. Hourly Trends */}
                 <div className="w-full">
                    <HourlyTemperature lat={coordinates.lat} lon={coordinates.lon} />
                 </div>

                 {/* 2. 5-Day Forecast */}
                 <div className="w-full">
                    <WeatherForecast location={location} coordinates={coordinates} />
                 </div>

                 {/* MOVED FOOTER HERE FOR MOBILE SCROLL FLOW */}
                 <div className="w-full mt-4">
                    <Footer />
                 </div>

              </div>
            </div>

            {/* DESKTOP FOOTER */}
            <div className="hidden lg:block w-full mt-10 mb-6">
                <Footer />
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default WeatherDashboard;