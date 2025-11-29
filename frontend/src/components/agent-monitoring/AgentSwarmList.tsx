import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { Agent } from '../../hooks/useAgentMonitoring';
import AddAgentModal from './AddAgentModal';

interface AgentSwarmListProps {
    agents: Agent[];
    onAddAgent: (agent: Agent, formData?: any) => void;
}

const AgentSwarmList: React.FC<AgentSwarmListProps> = ({ agents, onAddAgent }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="h-full flex flex-col gap-4">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-white leading-tight">
                        Agent<br />Swarm
                    </h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        <Plus size={16} />
                        Add Agent
                    </button>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                    {agents.map((agent) => (
                        <div
                            key={agent.id}
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData('application/reactflow', 'agent');
                                e.dataTransfer.setData('application/agentData', JSON.stringify(agent));
                                e.dataTransfer.effectAllowed = 'move';
                            }}
                            className={`
                flex items-center justify-between p-4 rounded-2xl
                bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10
                transition-all cursor-grab active:cursor-grabbing group hover:translate-x-1
              `}
                        >
                            <span className="font-medium text-gray-200 group-hover:text-white transition-colors">
                                {agent.name}
                            </span>
                            <div className={`
                w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]
                ${agent.status === 'working' ? 'text-green-400 animate-pulse' : 'text-gray-600'}
              `} />
                        </div>
                    ))}
                </div>
            </div>

            <AddAgentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={onAddAgent}
            />
        </>
    );
};

export default AgentSwarmList;
