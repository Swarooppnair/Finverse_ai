import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Brain, Database, Terminal, FileText, Shield, Layers, Activity } from 'lucide-react';

const icons: Record<string, any> = {
    PlannerAgent: Layers,
    DataAgent: Database,
    ExecutionAgent: Terminal,
    ReasoningAgent: Brain,
    VerificationAgent: Shield,
    WriterAgent: FileText,
    Orchestrator: Brain,
    'Financial Analyst': Activity,
    'Memory Manager': Database,
    'Risk Assessor': Shield
};

const AgentNode = ({ data }: { data: any }) => {
    const Icon = data.icon || icons[data.name] || Brain;

    return (
        <div className={`
      px-4 py-3 rounded-xl shadow-lg border min-w-[180px]
      ${data.status === 'working'
                ? 'bg-indigo-900/40 border-indigo-500/50 shadow-indigo-500/20'
                : 'bg-[#1A1B26] border-white/10 hover:border-white/20'}
      transition-all
    `}>
            <Handle type="target" position={Position.Left} className="!bg-indigo-500 !w-3 !h-3" />

            <div className="flex items-center gap-3">
                <div className={`
          p-2 rounded-lg 
          ${data.status === 'working' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/5 text-gray-400'}
        `}>
                    <Icon size={18} />
                </div>
                <div>
                    <div className="text-sm font-bold text-gray-200">{data.name}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                        {data.status === 'working' ? 'Processing...' : 'Idle'}
                    </div>
                </div>
            </div>

            <Handle type="source" position={Position.Right} className="!bg-indigo-500 !w-3 !h-3" />
        </div>
    );
};

export default memo(AgentNode);
