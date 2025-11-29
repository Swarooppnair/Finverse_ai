import React from 'react';
import { motion } from 'framer-motion';
import { Play, Layout, Grid, Layers } from 'lucide-react';
import CanvasBoard from './CanvasBoard';
import type { Agent } from '../../hooks/useAgentMonitoring';

interface ObjectivePanelProps {
    isExecuting: boolean;
    onExecute: () => void;
    view: 'workflow' | 'canvas';
    setView: (view: 'workflow' | 'canvas') => void;
    availableAgents: Agent[];
    canvasAgents: Agent[];
    onAddAgent: (agent: Agent) => void;
    onRemoveAgent: (id: string) => void;
    userQuery: string;
    setUserQuery: (query: string) => void;
}

const ObjectivePanel: React.FC<ObjectivePanelProps> = ({
    isExecuting,
    onExecute,
    view,
    setView,
    availableAgents,
    canvasAgents,
    onAddAgent,
    onRemoveAgent,
    userQuery,
    setUserQuery
}) => {
    return (
        <div className="h-full flex flex-col gap-6">
            {view === 'workflow' ? (
                <>
                    <div>
                        <h2 className="text-lg font-bold text-white mb-3">User Objective</h2>
                        <div className="relative">
                            <textarea
                                value={userQuery}
                                onChange={(e) => setUserQuery(e.target.value)}
                                className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-gray-300 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all resize-none placeholder:text-gray-600"
                                placeholder="Enter your objective or query here... ORCHESTRATOR-X will decompose it, assign agents, and execute autonomously."
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onExecute}
                            disabled={isExecuting || !userQuery.trim()}
                            className={`
                                flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2
                                transition-all shadow-lg
                                ${isExecuting || !userQuery.trim()
                                    ? 'bg-gray-700 cursor-not-allowed opacity-50'
                                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-500/25'
                                }
                            `}
                        >
                            {isExecuting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Orchestrating...
                                </>
                            ) : (
                                <>
                                    <Play size={20} />
                                    Generate Workflow
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => setView('canvas')}
                            className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-medium transition-colors border border-white/5 hover:border-white/10"
                            title="Build Manually"
                        >
                            <Layers size={20} />
                        </button>
                    </div>
                </>
            ) : (
                <CanvasBoard
                    availableAgents={availableAgents}
                    canvasAgents={canvasAgents}
                    onAddAgent={onAddAgent}
                    onRemoveAgent={onRemoveAgent}
                    onExecute={onExecute}
                    isExecuting={isExecuting}
                />
            )}

            {view === 'workflow' && (
                <div className="flex-1 bg-black/40 rounded-3xl border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative">
                        <div className={`absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full ${isExecuting ? 'animate-pulse' : ''}`} />
                        <div className={`w-24 h-24 rounded-full border-4 border-indigo-500/30 flex items-center justify-center ${isExecuting ? 'animate-spin-slow' : ''}`}>
                            <div className={`w-12 h-12 rounded-full bg-indigo-500 ${isExecuting ? 'animate-ping' : ''}`} />
                        </div>
                    </div>

                    <h3 className="mt-8 text-xl font-bold text-white">
                        {isExecuting ? 'Orchestrating...' : 'Ready for Orchestration'}
                    </h3>
                    <p className="text-gray-500 text-sm mt-2 text-center max-w-xs">
                        {isExecuting
                            ? 'Agents are collaboratively solving the objective.'
                            : 'Provide an objective to start the autonomous agent workflow'}
                    </p>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4 mt-auto">
                <button
                    onClick={() => setView('workflow')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-medium transition-all ${view === 'workflow'
                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/30 text-indigo-300'
                        : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                >
                    <Layout size={18} />
                    Workflow View
                </button>
                <button
                    onClick={() => setView('canvas')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-medium transition-all ${view === 'canvas'
                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/30 text-indigo-300'
                        : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                >
                    <Grid size={18} />
                    Canvas Board
                </button>
            </div>
        </div>
    );
};

export default ObjectivePanel;
