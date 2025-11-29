import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '../context/DataContext';

const ForecastChart = () => {
    const { forecasts, currencySymbol } = useData();

    // Transform forecast data for Recharts
    const chartData = forecasts ? forecasts.labels.map((label, index) => ({
        name: label,
        income: forecasts.income[index] || 0,
        expense: forecasts.expense[index] || 0
    })) : [];

    if (!forecasts || chartData.length === 0) {
        return (
            <div className="glass-panel p-6 h-96 flex items-center justify-center">
                <p className="text-gray-400">Loading forecast data...</p>
            </div>
        );
    }

    return (
        <div className="glass-panel p-6 h-96">
            <h3 className="text-lg font-semibold mb-6">Cashflow Forecast</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(value) => `${currencySymbol}${value}`} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value: number) => [`${currencySymbol}${value.toLocaleString()}`, '']}
                    />
                    <Area type="monotone" dataKey="income" name="Income" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                    <Area type="monotone" dataKey="expense" name="Expense" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ForecastChart;
