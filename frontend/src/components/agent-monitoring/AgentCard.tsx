import React from 'react';
import { motion } from 'framer-motion';
import type { Agent } from '../../hooks/useAgentMonitoring';

interface AgentCardProps {
    agent: Agent;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
    const statusColor = {
        idle: 'bg-gray-500',
        working: 'bg-green-500',
        error: 'bg-red-500'
    }[agent.status];

    const glowColor = {
        idle: 'shadow-gray-500/20',
        working: 'shadow-green-500/20',
        error: 'shadow-red-500/20'
    }[agent.status];

    const Icon = agent.icon;

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={`relative p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg ${glowColor} hover:shadow-xl transition-all duration-300`}
        >
            <div className="flex justify-between items-start mb-3">
                <div className="p-2 rounded-lg bg-white/10 text-cyan-400">
                    <Icon size={20} />
                </div>
                <div className={`w-2 h-2 rounded-full ${statusColor} animate-pulse`} />
            </div>

            <h3 className="text-lg font-semibold text-white mb-1">{agent.name}</h3>
            <p className="text-xs text-gray-400 mb-3 h-8 line-clamp-2">{agent.description}</p>

            <div className="flex items-center text-xs text-cyan-300/80 bg-cyan-950/30 px-2 py-1 rounded border border-cyan-900/30">
                <span className="mr-1">⚡</span>
                {agent.lastActivity}
            </div>
        </motion.div>
    );
};

export default AgentCard;
