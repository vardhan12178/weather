import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { Droplet } from 'react-feather';

const PrecipitationChart = ({ forecastData }) => {
    if (!forecastData || !forecastData.list) return null;

    // Prepare data for precipitation probability
    const chartData = forecastData.list.slice(0, 8).map(item => ({
        time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: 'numeric', hour12: true }),
        rain: Math.round((item.pop || 0) * 100), // Probability of precipitation as percentage
        timestamp: item.dt
    }));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 rounded-xl p-3 shadow-lg">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
                        {payload[0].payload.time}
                    </p>
                    <div className="flex items-center gap-2">
                        <Droplet size={14} className="text-blue-500" />
                        <p className="text-sm font-black text-blue-600 dark:text-blue-400">
                            {payload[0].value}% chance
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Color based on precipitation probability
    const getBarColor = (value) => {
        if (value >= 70) return '#3b82f6'; // High - Blue
        if (value >= 40) return '#60a5fa'; // Medium - Light Blue
        return '#93c5fd'; // Low - Very Light Blue
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-full flex flex-col"
        >
            <h3 className="text-slate-700 dark:text-white font-bold text-xs mb-4 ml-1 uppercase tracking-widest flex items-center gap-2">
                <Droplet size={14} className="text-blue-400" />
                <span>Precipitation Probability</span>
                <div className="h-px bg-slate-700/10 dark:bg-white/20 flex-grow"></div>
            </h3>

            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                        domain={[0, 100]}
                        ticks={[0, 25, 50, 75, 100]}
                        label={{ value: '%', position: 'insideLeft', style: { fill: '#64748b', fontSize: '10px' } }}
                        className="dark:stroke-slate-300"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="rain" radius={[8, 8, 0, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getBarColor(entry.rain)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-200">High (70%+)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-blue-400"></div>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-200">Medium (40-70%)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-blue-300"></div>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-200">Low (&lt;40%)</span>
                </div>
            </div>
        </motion.div>
    );
};

export default PrecipitationChart;
