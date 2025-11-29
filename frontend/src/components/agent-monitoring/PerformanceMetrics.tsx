import React from 'react';
import { motion } from 'framer-motion';
import type { Metric } from '../../hooks/useAgentMonitoring';

interface PerformanceMetricsProps {
    metrics: Metric[];
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics }) => {
    return (
        <div className="grid grid-cols-3 gap-4 h-full">
            {metrics.map((metric, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-xl group-hover:blur-2xl transition-all opacity-50" />
                    <div className="relative h-full aspect-square rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex flex-col items-center justify-center p-4 hover:border-cyan-500/30 transition-colors">
                        <span className="text-2xl font-bold text-white mb-1 font-mono">
                            {metric.value}
                        </span>
                        <span className="text-xs text-gray-400 uppercase tracking-wider text-center">
                            {metric.label}
                        </span>
                        {metric.unit && (
                            <span className="text-[10px] text-cyan-500/70 mt-1">
                                {metric.unit}
                            </span>
                        )}

                        {/* Circular progress indicator (decorative) */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1">
                            <circle
                                cx="50%"
                                cy="50%"
                                r="48%"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1"
                                className="text-white/5"
                            />
                            <circle
                                cx="50%"
                                cy="50%"
                                r="48%"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1"
                                strokeDasharray="100 100"
                                strokeDashoffset={30 + idx * 20}
                                className="text-cyan-500/30"
                            />
                        </svg>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default PerformanceMetrics;
