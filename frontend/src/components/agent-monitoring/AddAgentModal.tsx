import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Server, FileText, Upload, Check, ChevronRight } from 'lucide-react';
import type { Agent } from '../../hooks/useAgentMonitoring';

interface AddAgentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (agent: Agent, formData: any) => void;
}

type AgentType = 'MCP' | 'RAG' | 'NORMAL' | null;

const AddAgentModal: React.FC<AddAgentModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [agentType, setAgentType] = useState<AgentType>(null);
    const [formData, setFormData] = useState({
        name: '',
        apiKey: '',
        context: '',
        files: null as FileList | null
    });

    const reset = () => {
        setAgentType(null);
        setFormData({ name: '', apiKey: '', context: '', files: null });
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Create new agent object
        const newAgent: Agent = {
            id: Date.now().toString(),
            name: formData.name,
            status: 'idle',
            icon: agentType === 'MCP' ? Server : FileText
        };

        onAdd(newAgent, { ...formData, type: agentType });
        reset();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-[#0F111A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div>
                        <h2 className="text-xl font-bold text-white">Add New Agent</h2>
                        <p className="text-sm text-gray-400">Configure a new autonomous agent for your swarm</p>
                    </div>
                    <button onClick={reset} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <AnimatePresence mode="wait">
                        {!agentType ? (
                            <motion.div
                                key="selection"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="grid grid-cols-2 gap-4"
                            >
                                <button
                                    onClick={() => setAgentType('MCP')}
                                    className="group p-6 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all text-left"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                                        <Server size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">MCP Server</h3>
                                    <p className="text-sm text-gray-400">Connect an external Model Context Protocol server. Requires API key and endpoint configuration.</p>
                                </button>

                                <button
                                    onClick={() => setAgentType('RAG')}
                                    className="group p-6 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all text-left"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                                        <FileText size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">RAG Agent</h3>
                                    <p className="text-sm text-gray-400">Create a Retrieval-Augmented Generation agent with custom knowledge base documents.</p>
                                </button>

                                <button
                                    onClick={() => setAgentType('NORMAL')}
                                    className="group p-6 rounded-xl bg-white/5 border border-white/10 hover:border-green-500/50 hover:bg-green-500/10 transition-all text-left col-span-2"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 mb-4 group-hover:scale-110 transition-transform">
                                        <FileText size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Normal Agent</h3>
                                    <p className="text-sm text-gray-400">Standard LLM agent with system prompt and API key.</p>
                                </button>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleSubmit}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                                    <button type="button" onClick={() => setAgentType(null)} className="hover:text-white">Selection</button>
                                    <ChevronRight size={14} />
                                    <span className="text-white font-medium">
                                        {agentType === 'MCP' ? 'MCP Server Configuration' :
                                            agentType === 'RAG' ? 'RAG Agent Configuration' :
                                                'Normal Agent Configuration'}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Agent Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                                            placeholder="e.g., FinanceHelper_01"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">API Key</label>
                                        <input
                                            required
                                            type="password"
                                            value={formData.apiKey}
                                            onChange={e => setFormData({ ...formData, apiKey: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                                            placeholder="sk-..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Context / System Prompt</label>
                                        <textarea
                                            required
                                            value={formData.context}
                                            onChange={e => setFormData({ ...formData, context: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-indigo-500 focus:outline-none transition-colors h-24 resize-none"
                                            placeholder="Define the agent's role and behavior..."
                                        />
                                    </div>

                                    {agentType === 'RAG' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Knowledge Base</label>
                                            <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-indigo-500/50 transition-colors cursor-pointer relative">
                                                <input
                                                    type="file"
                                                    multiple
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    onChange={e => setFormData({ ...formData, files: e.target.files })}
                                                />
                                                <Upload className="mx-auto text-gray-500 mb-2" size={24} />
                                                <p className="text-sm text-gray-300 font-medium">Click to upload documents</p>
                                                <p className="text-xs text-gray-500 mt-1">PDF, TXT, DOCX supported</p>
                                                {formData.files && (
                                                    <div className="mt-4 text-sm text-indigo-400 font-medium">
                                                        {formData.files.length} file(s) selected
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end gap-3 mt-8">
                                    <button
                                        type="button"
                                        onClick={reset}
                                        className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors flex items-center gap-2"
                                    >
                                        <Check size={18} />
                                        Create Agent
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default AddAgentModal;
