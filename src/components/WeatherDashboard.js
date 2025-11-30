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
            
            {/* LAYOUT FIX: 
                - Reduced 'gap-6' to 'gap-3 sm:gap-6' to save vertical space on mobile.
                - Reduced 'p-4' to 'p-2 sm:p-4' to widen the usable area on small screens.
            */}
            <div className="grid grid-cols-1 lg:grid-cols-12 w-full gap-3 sm:gap-6 p-2 sm:p-4 lg:p-6 animate-in fade-in duration-500">
              
              {/* COLUMN 1: LEFT SIDEBAR (Desktop Only) */}
              <div className="hidden lg:flex lg:col-span-3 flex-col justify-center h-full pt-10">
                 <WeatherForecast location={location} coordinates={coordinates} />
              </div>

              {/* COLUMN 2: CENTER STAGE */}
              {/* LAYOUT FIX: 
                 - Changed 'mt-4' to 'mt-1 sm:mt-4' to pull the card higher on mobile.
              */}
              <div className="col-span-1 lg:col-span-6 flex flex-col items-center justify-start lg:justify-center relative mt-1 sm:mt-4 lg:mt-0">
                 
                 {/* ALERTS: Optimized margin */}
                 <div className="w-full max-w-md z-50 mb-2 lg:mb-0 lg:absolute lg:top-0">
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

            {/* DESKTOP FOOTER (Hidden on mobile to avoid double footer if you move it above) */}
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