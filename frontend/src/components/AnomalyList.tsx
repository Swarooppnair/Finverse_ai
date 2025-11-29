import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useData } from '../context/DataContext';

const AnomalyList = () => {
    const { anomalies, currencySymbol } = useData();

    if (!anomalies || anomalies.length === 0) {
        return (
            <div className="glass-panel p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Risk Radar</h3>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Safe</span>
                </div>
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <CheckCircle className="w-12 h-12 mb-2 text-green-500/50" />
                    <p>No anomalies detected.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Risk Radar</h3>
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">{anomalies.length} Alerts</span>
            </div>

            <div className="space-y-4">
                {anomalies.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                        <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${item.risk_score > 0.5 ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                <AlertTriangle className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">{item.reason}</p>
                                <p className="text-xs text-gray-500">{item.date} • {item.description}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-white">{currencySymbol}{item.amount.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 capitalize">{item.risk_score > 0.7 ? 'High' : 'Medium'} Risk</p>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-6 py-2 text-sm text-primary hover:text-white transition-colors">
                View All Alerts
            </button>
        </div>
    );
};

export default AnomalyList;
