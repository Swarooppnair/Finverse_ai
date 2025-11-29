import React from 'react';
import { motion } from 'framer-motion';
import { Play, Share2, GitMerge } from 'lucide-react';

interface WorkflowRunnerProps {
    onExecuteWorkflow: () => void;
    onExecuteNode: () => void;
    onConnectBoard: () => void;
}

const WorkflowRunner: React.FC<WorkflowRunnerProps> = ({ onExecuteWorkflow, onExecuteNode, onConnectBoard }) => {
    const buttons = [
        { label: 'Execute Workflow', icon: Play, color: 'from-blue-600 to-blue-400', action: onExecuteWorkflow },
        { label: 'Execute Node', icon: GitMerge, color: 'from-cyan-600 to-cyan-400', action: onExecuteNode },
        { label: 'Connect Board', icon: Share2, color: 'from-indigo-600 to-indigo-400', action: onConnectBoard },
    ];

    return (
        <div className="flex flex-col gap-3 h-full justify-center">
            {buttons.map((btn, idx) => (
                <motion.button
                    key={idx}
                    onClick={btn.action}
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative overflow-hidden p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-all text-left"
                >
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r ${btn.color} transition-opacity`} />
                    <div className="flex items-center gap-3 relative z-10">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${btn.color} shadow-lg shadow-cyan-500/20`}>
                            <btn.icon size={18} className="text-white" />
                        </div>
                        <span className="font-medium text-gray-200 group-hover:text-white transition-colors">
                            {btn.label}
                        </span>
                    </div>
                </motion.button>
            ))}
        </div>
    );
};

export default WorkflowRunner;
