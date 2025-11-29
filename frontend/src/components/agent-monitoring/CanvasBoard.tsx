import React from 'react';
import { motion, Reorder } from 'framer-motion';
import { X, Play } from 'lucide-react';
import type { Agent } from '../../hooks/useAgentMonitoring';

interface CanvasBoardProps {
    availableAgents: Agent[];
    canvasAgents: Agent[];
    onAddAgent: (agent: Agent) => void;
    onRemoveAgent: (id: string) => void;
    onExecute: () => void;
    isExecuting: boolean;
}

const CanvasBoard: React.FC<CanvasBoardProps> = ({
    availableAgents,
    canvasAgents,
    onAddAgent,
    onRemoveAgent,
    onExecute,
    isExecuting
}) => {
    return (
        <div className="h-full flex flex-col gap-4">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 relative overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-[20px_20px] opacity-10 pointer-events-none">
                    {/* Dot grid pattern */}
                    <div className="w-full h-full" style={{
                        backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }} />
                </div>

                <div className="h-full flex gap-4">
                    {/* Sidebar for available agents */}
                    <div className="w-48 flex flex-col gap-2 border-r border-white/10 pr-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Available Agents</h3>
                        {availableAgents.map(agent => (
                            <motion.div
                                key={agent.id}
                                layoutId={agent.id}
                                onClick={() => onAddAgent(agent)}
                                whileHover={{ scale: 1.02, x: 2 }}
                                whileTap={{ scale: 0.98 }}
                                className="p-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 hover:border-indigo-500/50 transition-colors flex items-center gap-2"
                            >
                                <agent.icon size={16} className="text-indigo-400" />
                                <span className="text-sm text-gray-200">{agent.name}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Canvas Area */}
                    <div className="flex-1 relative">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Workflow Canvas</h3>

                        {canvasAgents.length === 0 ? (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-sm border-2 border-dashed border-white/10 rounded-xl">
                                Select agents to add them to the workflow
                            </div>
                        ) : (
                            <Reorder.Group
                                axis="y"
                                values={canvasAgents}
                                onReorder={() => { }} // No-op for now, just visual
                                className="space-y-4 max-w-md mx-auto"
                            >
                                {canvasAgents.map((agent, index) => (
                                    <Reorder.Item key={agent.id} value={agent}>
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="relative p-4 rounded-xl bg-indigo-900/20 border border-indigo-500/30 backdrop-blur-sm flex items-center justify-between group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-mono text-indigo-300 border border-indigo-500/30">
                                                    {index + 1}
                                                </div>
                                                <agent.icon size={20} className="text-indigo-400" />
                                                <span className="font-medium text-white">{agent.name}</span>
                                            </div>

                                            <button
                                                onClick={() => onRemoveAgent(agent.id)}
                                                className="p-1 rounded-lg hover:bg-white/10 text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <X size={16} />
                                            </button>

                                            {/* Connector Line */}
                                            {index < canvasAgents.length - 1 && (
                                                <div className="absolute left-7 top-full w-0.5 h-4 bg-indigo-500/30 -mb-4 z-0" />
                                            )}
                                        </motion.div>
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>
                        )}
                    </div>
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onExecute}
                disabled={isExecuting || canvasAgents.length === 0}
                className={`
          w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3
          shadow-lg transition-all
          ${isExecuting || canvasAgents.length === 0
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-500/25'}
        `}
            >
                <Play size={20} fill="currentColor" />
                {isExecuting ? 'Executing Workflow...' : 'Execute Canvas Workflow'}
            </motion.button>
        </div>
    );
};

export default CanvasBoard;
