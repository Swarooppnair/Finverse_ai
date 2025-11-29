import React from 'react';
import type { MemoryStats } from '../../hooks/useAgentMonitoring';

interface MemoryStatePanelProps {
    memory: MemoryStats;
}

const MemoryStatePanel: React.FC<MemoryStatePanelProps> = ({ memory }) => {
    return (
        <div className="h-full flex flex-col justify-center gap-6 p-4">
            <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Short-term Memory</span>
                    <span>{memory.shortTerm}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${memory.shortTerm}%` }}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Long-term Memory</span>
                    <span>{memory.longTerm}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                        style={{ width: `${memory.longTerm}%` }}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <span className="text-sm text-gray-300">Active Contexts</span>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-lg font-bold text-white">{memory.activeAgents}</span>
                </div>
            </div>
        </div>
    );
};

export default MemoryStatePanel;
