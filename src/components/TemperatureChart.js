import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const TemperatureChart = ({ forecastData, unit }) => {
    if (!forecastData || !forecastData.list) return null;

    // Prepare data for 24 hours (8 data points * 3 hours = 24 hours)
    const chartData = forecastData.list.slice(0, 8).map(item => ({
        time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: 'numeric', hour12: true }),
        temp: Math.round(item.main.temp),
        feelsLike: Math.round(item.main.feels_like),
        timestamp: item.dt
    }));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 rounded-xl p-3 shadow-lg">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
                        {payload[0].payload.time}
                    </p>
                    <p className="text-sm font-black text-blue-600 dark:text-blue-400">
                        Temp: {payload[0].value}°{unit === 'metric' ? 'C' : 'F'}
                    </p>
                    {payload[1] && (
                        <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                            Feels: {payload[1].value}°{unit === 'metric' ? 'C' : 'F'}
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-full flex flex-col"
        >
            <h3 className="text-slate-700 dark:text-white font-bold text-xs mb-4 ml-1 uppercase tracking-widest flex items-center gap-2">
                <span>24-Hour Temperature Trend</span>
                <div className="h-px bg-slate-700/10 dark:bg-white/20 flex-grow"></div>
            </h3>

            <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="feelsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#c084fc" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" className="dark:opacity-30" />
                    <XAxis
                        dataKey="time"
                        stroke="#64748b"
                        style={{ fontSize: '10px', fontWeight: 'bold' }}
                        tick={{ fill: '#64748b' }}
                        className="dark:stroke-slate-300"
                    />
                    <YAxis
                        stroke="#64748b"
                        style={{ fontSize: '10px', fontWeight: 'bold' }}
                        tick={{ fill: '#64748b' }}
                        domain={['dataMin - 2', 'dataMax + 2']}
                        className="dark:stroke-slate-300"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="temp"
                        stroke="#60a5fa"
                        strokeWidth={3}
                        fill="url(#tempGradient)"
                        dot={{ fill: '#60a5fa', r: 4 }}
                        activeDot={{ r: 6, fill: '#60a5fa' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="feelsLike"
                        stroke="#c084fc"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        fill="url(#feelsGradient)"
                        dot={{ fill: '#c084fc', r: 3 }}
                    />
                </AreaChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-blue-400"></div>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-200">Temperature</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-purple-400 border-dashed"></div>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-200">Feels Like</span>
                </div>
            </div>
        </motion.div>
    );
};

export default TemperatureChart;
