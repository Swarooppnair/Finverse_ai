import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    Background,
    type Connection,
    type Edge,
    type Node,
    BackgroundVariant,
    MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { X, Play, Save, FileText, Info, ChevronRight, ChevronLeft, CheckCircle, Activity, Terminal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import AgentNode from './AgentNode';
import type { Agent } from '../../hooks/useAgentMonitoring';
import { Brain, Database, Terminal as TerminalIcon, Shield, Layers } from 'lucide-react';

const nodeTypes = {
    agent: AgentNode,
};

// Icon mapping helper
const getIcon = (iconName: string) => {
    switch (iconName) {
        case 'Database': return Database;
        case 'Terminal': return TerminalIcon;
        case 'Brain': return Brain;
        case 'Shield': return Shield;
        case 'FileText': return FileText;
        case 'Layers': return Layers;
        default: return Brain;
    }
};

interface WorkflowEditorProps {
    agents: Agent[];
    onClose: () => void;
    onExecute: () => void;
    onSave: (name: string) => void;
    workflowNodes?: any[];
    workflowEdges?: any[];
    explanation?: string;
    output?: string;
    isOutputVisible?: boolean;
    setIsOutputVisible?: (visible: boolean) => void;
    executionLogs?: any[];
    activeNodeId?: string | null;
}

const initialNodes: Node[] = [
    {
        id: '1',
        type: 'agent',
        position: { x: 250, y: 100 },
        data: { name: 'PlannerAgent', status: 'idle' },
    },
];

const WorkflowEditorContent: React.FC<WorkflowEditorProps> = ({
    agents,
    onClose,
    onExecute,
    onSave,
    workflowNodes,
    workflowEdges,
    explanation,
    output,
    isOutputVisible,
    setIsOutputVisible,
    executionLogs = [],
    activeNodeId
}) => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
    const [showSidebar, setShowSidebar] = useState(true);
    const [sidebarTab, setSidebarTab] = useState<'context' | 'logs'>('context');
    const [workflowName, setWorkflowName] = useState('New Workflow');

    const handleSave = () => {
        const name = prompt("Enter workflow name:", workflowName);
        if (name) {
            setWorkflowName(name);
            onSave(name);
        }
    };

    // Auto-switch to logs tab when execution starts
    useEffect(() => {
        if (executionLogs.length > 0) {
            setSidebarTab('logs');
            setShowSidebar(true);
        }
    }, [executionLogs.length]);

    // Sync with generated workflow and active node
    useEffect(() => {
        if (workflowNodes && workflowNodes.length > 0) {
            const mappedNodes = workflowNodes.map((node) => ({
                ...node,
                type: 'agent',
                data: {
                    ...node.data,
                    icon: getIcon(node.data.icon),
                    // Highlight active node
                    status: node.id === activeNodeId ? 'working' : (node.data.status || 'idle')
                },
                // Add glow effect for active node
                style: node.id === activeNodeId ? {
                    filter: 'drop-shadow(0 0 15px rgba(99, 102, 241, 0.6))',
                    border: '2px solid #6366f1',
                    transition: 'all 0.3s ease'
                } : { transition: 'all 0.3s ease' }
            }));

            setNodes(mappedNodes);
        }

        if (workflowEdges) {
            const mappedEdges = workflowEdges.map(edge => ({
                ...edge,
                markerEnd: { type: MarkerType.ArrowClosed },
                style: { stroke: '#6366f1', strokeWidth: 2 },
                animated: true
            }));
            setEdges(mappedEdges);
        }
    }, [workflowNodes, workflowEdges, activeNodeId, setNodes, setEdges]);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#6366f1' } }, eds)),
        [setEdges],
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
            const type = event.dataTransfer.getData('application/reactflow');
            const agentData = JSON.parse(event.dataTransfer.getData('application/agentData'));

            if (typeof type === 'undefined' || !type || !reactFlowBounds || !reactFlowInstance) {
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });

            const newNode: Node = {
                id: `${agentData.id}_${Date.now()}`,
                type: 'agent',
                position,
                data: { name: agentData.name, status: 'idle' },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, setNodes],
    );

    const onDragStart = (event: React.DragEvent, nodeType: string, agent: Agent) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('application/agentData', JSON.stringify(agent));
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#0B0C15] flex flex-col">
            {/* Header */}
            <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0B0C15]">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-white">Workflow Orchestrator</h2>
                    <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono">
                        AI Powered
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
                    >
                        <Save size={16} />
                        Save
                    </button>
                    <button
                        onClick={onExecute}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium transition-colors"
                    >
                        <Play size={16} />
                        Execute Workflow
                    </button>
                    {output && (
                        <button
                            onClick={() => setIsOutputVisible?.(!isOutputVisible)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors border ${isOutputVisible ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-gray-300'}`}
                        >
                            <FileText size={16} />
                            {isOutputVisible ? 'Hide Output' : 'Show Output'}
                        </button>
                    )}
                    <div className="w-px h-6 bg-white/10 mx-2" />
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Sidebar */}
                <div className={`
                    ${showSidebar ? 'w-80' : 'w-12'} 
                    transition-all duration-300 border-r border-white/10 bg-[#0F111A] flex flex-col
                `}>
                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                        {showSidebar && (
                            <div className="flex bg-white/5 rounded-lg p-1">
                                <button
                                    onClick={() => setSidebarTab('context')}
                                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${sidebarTab === 'context' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    Context
                                </button>
                                <button
                                    onClick={() => setSidebarTab('logs')}
                                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${sidebarTab === 'logs' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    Live Logs
                                </button>
                            </div>
                        )}
                        <button onClick={() => setShowSidebar(!showSidebar)} className="p-1 hover:bg-white/10 rounded text-gray-400">
                            {showSidebar ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                        </button>
                    </div>

                    {showSidebar && (
                        <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
                            {sidebarTab === 'context' ? (
                                <>
                                    {explanation ? (
                                        <div className="space-y-4">
                                            <div className="text-sm text-gray-300 leading-relaxed">
                                                {explanation}
                                            </div>
                                            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                                                <h4 className="text-xs font-bold text-indigo-300 uppercase mb-2">Orchestration Strategy</h4>
                                                <ul className="text-xs text-gray-400 space-y-1">
                                                    <li className="flex items-center gap-2"><CheckCircle size={12} /> Analyzed user intent</li>
                                                    <li className="flex items-center gap-2"><CheckCircle size={12} /> Selected optimal agents</li>
                                                    <li className="flex items-center gap-2"><CheckCircle size={12} /> Defined data flow</li>
                                                </ul>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500 italic">
                                            Build a workflow manually or use the AI Orchestrator to generate one.
                                        </div>
                                    )}

                                    <div className="mt-8">
                                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Available Agents</h4>
                                        <div className="space-y-2">
                                            {agents.map((agent) => (
                                                <div
                                                    key={agent.id}
                                                    onDragStart={(event) => onDragStart(event, 'agent', agent)}
                                                    draggable
                                                    className="p-2 rounded bg-white/5 border border-white/5 hover:border-indigo-500/50 cursor-grab flex items-center gap-2"
                                                >
                                                    <agent.icon size={14} className="text-gray-400" />
                                                    <span className="text-xs text-gray-300">{agent.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-3">
                                    {executionLogs.length === 0 ? (
                                        <div className="text-sm text-gray-500 italic text-center mt-10">
                                            Waiting for execution to start...
                                        </div>
                                    ) : (
                                        executionLogs.map((log) => (
                                            <div key={log.id} className="p-3 rounded-lg bg-white/5 border border-white/5 text-xs animate-in slide-in-from-left duration-300">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className={`font-bold ${log.type === 'error' ? 'text-red-400' :
                                                            log.type === 'success' ? 'text-green-400' :
                                                                'text-indigo-400'
                                                        }`}>
                                                        {log.source}
                                                    </span>
                                                    <span className="text-gray-500">{log.timestamp}</span>
                                                </div>
                                                <div className="text-gray-300">{log.message}</div>
                                            </div>
                                        ))
                                    )}
                                    {/* Auto-scroll anchor */}
                                    <div className="h-0" />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Canvas */}
                <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        nodeTypes={nodeTypes}
                        fitView
                        className="bg-[#0B0C15]"
                    >
                        <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#333" />
                        <Controls className="bg-white/10 border border-white/10 text-white fill-white" />
                    </ReactFlow>
                </div>

                {/* Output Panel Overlay */}
                {isOutputVisible && (
                    <div className="absolute right-0 top-0 bottom-0 w-[600px] bg-[#0F111A] border-l border-white/10 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0B0C15]">
                            <h3 className="font-bold text-white flex items-center gap-2"><FileText size={16} className="text-green-400" /> Execution Output</h3>
                            <button onClick={() => setIsOutputVisible?.(false)} className="text-gray-400 hover:text-white">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            <div className="prose prose-invert prose-sm max-w-none">
                                <ReactMarkdown>{output || 'Generating output...'}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const WorkflowEditor = (props: WorkflowEditorProps) => (
    <ReactFlowProvider>
        <WorkflowEditorContent {...props} />
    </ReactFlowProvider>
);

export default WorkflowEditor;
