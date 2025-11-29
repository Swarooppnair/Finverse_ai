import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import clsx from 'clsx';

interface KPIBoxProps {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: React.ElementType;
}

const KPIBox: React.FC<KPIBoxProps> = ({ title, value, change, trend, icon: Icon }) => {
    return (
        <div className="glass-panel p-6 relative overflow-hidden group hover:bg-white/10 transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon className="w-16 h-16 text-white" />
            </div>

            <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-white/5 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className={clsx(
                    "flex items-center text-sm font-medium px-2 py-1 rounded-full",
                    trend === 'up' ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"
                )}>
                    {trend === 'up' ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                    {change}
                </div>
            </div>

            <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
            <p className="text-3xl font-bold mt-1 text-white">{value}</p>
        </div>
    );
};

export default KPIBox;
