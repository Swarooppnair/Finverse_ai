import React from 'react';
import type { SystemStatus, MemoryStats, PerformanceMetrics } from '../../hooks/useAgentMonitoring';

interface SystemStatusPanelProps {
    status: SystemStatus;
    memory: MemoryStats;
    metrics: PerformanceMetrics;
}

const SystemStatusPanel: React.FC<SystemStatusPanelProps> = ({ status, memory, metrics }) => {
    return (
        <div className="h-full flex flex-col gap-6">
            <h2 className="text-lg font-bold text-white">System Status</h2>

            {/* Current Cycle Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                <h3 className="text-sm font-semibold text-white">Current Cycle</h3>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Active Agent:</span>
                        <span className="text-gray-200 font-mono">{status.activeAgent}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Step:</span>
                        <span className="text-white font-medium">{status.step}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Verification:</span>
                        <span className={`text-sm font-medium ${status.verification === 'Passed' ? 'text-green-400' :
                                status.verification === 'Verified' ? 'text-green-400' :
                                    status.verification === 'Pending' ? 'text-yellow-400' :
                                        'text-gray-400'
                            }`}>
                            {status.verification}
                        </span>
                    </div>
                </div>
            </div>

            {/* Memory State Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                <h3 className="text-sm font-semibold text-white">Memory State</h3>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>Short-term</span>
                            <span>{memory.shortTerm}%</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gray-600 rounded-full transition-all duration-500"
                                style={{ width: `${memory.shortTerm}%` }}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>Agent Context</span>
                            <span>{memory.agentContext}%</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gray-600 rounded-full transition-all duration-500"
                                style={{ width: `${memory.agentContext}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Metrics Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 flex-1">
                <h3 className="text-sm font-semibold text-white mb-4">Performance Metrics</h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-bold text-white mb-1">{metrics.tasksCompleted}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider leading-tight">Tasks<br />Completed</span>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-bold text-purple-300 mb-1">{metrics.avgResponse}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider leading-tight">Avg<br />Response</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemStatusPanel;
