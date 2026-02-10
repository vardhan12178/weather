import React from 'react';
import { motion } from 'framer-motion';
import { Wind, Droplet, Eye, Activity, Sunrise, Sunset, Thermometer } from 'react-feather';

// --- MINIMAL FLOATING STAT PILL ---
const StatPill = ({ icon: Icon, label, value, subValue, delay = 0, glassClass, textColor, textSubColor }) => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: delay }}
        className={`flex items-center gap-3 px-5 py-3 rounded-full ${glassClass} hover:bg-white/20 transition-all group`}
    >
        <Icon size={20} className={`${textColor} opacity-70 group-hover:opacity-100 transition-colors`} />
        <div className="flex flex-col">
            <span className={`text-lg font-black ${textColor} drop-shadow-sm tracking-tight`}>
                {value}{subValue && <span className={`text-sm font-medium ${textSubColor} ml-1`}>{subValue}</span>}
            </span>
            <span className={`text-[10px] font-bold uppercase ${textColor} opacity-50 tracking-widest`}>{label}</span>
        </div>
    </motion.div>
);

// --- DYNAMIC SUN ARC - Floating Style ---
const SunArc = ({ sunrise, sunset, timezone = 0, glassClass, textColor, textSubColor }) => {
    const now = Math.floor(Date.now() / 1000);
    const isDay = now >= sunrise && now <= sunset;

    let progress = 0;
    if (isDay) {
        progress = (now - sunrise) / (sunset - sunrise);
    } else {
        progress = now > sunset ? 1 : 0;
    }
    progress = Math.max(0, Math.min(1, progress));

    const angle = 180 - (progress * 180);
    const rad = (angle * Math.PI) / 180;
    const x = 90 + 80 * Math.cos(rad);
    const y = 90 - 80 * Math.sin(rad);

    const formatTime = (timestamp) => {
        const localTime = new Date((timestamp + timezone) * 1000);
        return localTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'UTC'
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className={`relative p-6 rounded-3xl ${glassClass} overflow-hidden flex flex-col justify-between min-h-[180px]`}
        >
            <div className="flex justify-between items-center w-full z-10">
                <div className="flex flex-col">
                    <div className={`flex items-center gap-1.5 ${textColor} opacity-50 mb-1`}>
                        <Sunrise size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Sunrise</span>
                    </div>
                    <span className={`text-xl font-black ${textColor} drop-shadow-sm ml-5`}>{formatTime(sunrise)}</span>
                </div>
                <div className="flex flex-col items-end">
                    <div className={`flex items-center gap-1.5 ${textColor} opacity-50 mb-1`}>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Sunset</span>
                        <Sunset size={14} />
                    </div>
                    <span className={`text-xl font-black ${textColor} drop-shadow-sm mr-5`}>{formatTime(sunset)}</span>
                </div>
            </div>

            {/* ARC VISUALIZATION */}
            <div className="relative h-28 w-full mt-2 flex justify-center items-end">
                <svg className="w-full h-full md:w-3/4 overflow-visible" viewBox="0 0 180 100" preserveAspectRatio="xMidYMax meet">
                    {/* Background Track */}
                    <path d="M 10,90 A 80,80 0 0,1 170,90" fill="none" stroke="currentColor" className={textColor} strokeOpacity="0.2" strokeWidth="3" strokeDasharray="6 6" />

                    {/* Progress Track */}
                    <path d="M 10,90 A 80,80 0 0,1 170,90" fill="none" stroke="url(#sunGradientNew)" strokeWidth="4" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - progress)} strokeLinecap="round" />

                    {/* Sun Icon */}
                    <motion.g
                        initial={{ x: 10, y: 90 }}
                        animate={{ x, y }}
                        transition={{ type: "spring", stiffness: 50, damping: 20 }}
                    >
                        <circle r="14" fill="url(#sunOrbNew)" />
                        <circle r="20" fill="rgba(251,191,36,0.3)" />
                    </motion.g>

                    <defs>
                        <linearGradient id="sunGradientNew" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#fbbf24" />
                            <stop offset="100%" stopColor="#f97316" />
                        </linearGradient>
                        <radialGradient id="sunOrbNew" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#fef3c7" />
                            <stop offset="100%" stopColor="#f59e0b" />
                        </radialGradient>
                    </defs>
                </svg>
            </div>

            {/* Horizon Line */}
            <div className={`absolute bottom-0 left-0 right-0 h-px ${textColor} opacity-10`}></div>
        </motion.div>
    );
};

const WeatherStats = ({ weatherData, unit, glassClass, textColor, textSubColor }) => {
    const { main, wind, visibility, sys, timezone } = weatherData;
    const { humidity, pressure, temp } = main;
    const { speed } = wind;
    const { sunrise, sunset } = sys;

    // Calculate dew point
    const calculateDewPoint = (temp, humidity) => {
        const a = 17.27;
        const b = 237.7;
        const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
        return (b * alpha) / (a - alpha);
    };

    const dewPoint = calculateDewPoint(temp, humidity);
    const getDelay = (index) => index * 0.08;

    return (
        <div className="flex flex-col gap-6 w-full">
            {/* SUN ARC - Full Width */}
            <SunArc sunrise={sunrise} sunset={sunset} timezone={timezone} glassClass={glassClass} textColor={textColor} textSubColor={textSubColor} />

            {/* STATS ROW - Horizontal Scroll on Mobile, Wrap on Desktop */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <StatPill icon={Wind} label="Wind" value={Math.round(speed)} subValue={unit === 'metric' ? 'm/s' : 'mph'} delay={getDelay(0)} glassClass={glassClass} textColor={textColor} textSubColor={textSubColor} />
                <StatPill icon={Droplet} label="Humidity" value={`${humidity}%`} delay={getDelay(1)} glassClass={glassClass} textColor={textColor} textSubColor={textSubColor} />
                <StatPill icon={Eye} label="Visibility" value={Math.round(visibility / 1000)} subValue="km" delay={getDelay(2)} glassClass={glassClass} textColor={textColor} textSubColor={textSubColor} />
                <StatPill icon={Activity} label="Pressure" value={pressure} subValue="hPa" delay={getDelay(3)} glassClass={glassClass} textColor={textColor} textSubColor={textSubColor} />
                <StatPill icon={Thermometer} label="Dew Point" value={`${Math.round(dewPoint)}°`} delay={getDelay(4)} glassClass={glassClass} textColor={textColor} textSubColor={textSubColor} />
            </div>
        </div>
    );
};

export default WeatherStats;

