import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAgentMonitoring } from '../hooks/useAgentMonitoring';
import AgentSwarmList from '../components/agent-monitoring/AgentSwarmList';
import ObjectivePanel from '../components/agent-monitoring/ObjectivePanel';
import SystemStatusPanel from '../components/agent-monitoring/SystemStatusPanel';
import WorkflowEditor from '../components/agent-monitoring/WorkflowEditor';

const AgentMonitoring: React.FC = () => {
    const {
        agents,
        systemStatus,
        memory,
        metrics,
        isExecuting,
        executeWorkflow,
        view,
        setView,
        canvasAgents,
        addToCanvas,
        removeFromCanvas,
        addAgent,
        userQuery,
        setUserQuery,
        workflowNodes,
        workflowEdges,
        workflowExplanation,
        workflowOutput,
        isOutputVisible,
        setIsOutputVisible,
        saveWorkflow,
        executionLogs,
        activeNodeId
    } = useAgentMonitoring();

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full p-6 bg-[#0B0C15] overflow-hidden"
            >
                <div className="h-full grid grid-cols-12 gap-6">
                    {/* Left Column: Agent Swarm */}
                    <div className="col-span-3 h-full">
                        <AgentSwarmList agents={agents} onAddAgent={addAgent} />
                    </div>

                    {/* Center Column: Objective & Visualization */}
                    <div className="col-span-6 h-full">
                        <ObjectivePanel
                            isExecuting={isExecuting}
                            onExecute={executeWorkflow}
                            view={view}
                            setView={setView}
                            availableAgents={agents}
                            canvasAgents={canvasAgents}
                            onAddAgent={addToCanvas}
                            onRemoveAgent={removeFromCanvas}
                            userQuery={userQuery}
                            setUserQuery={setUserQuery}
                        />
                    </div>

                    {/* Right Column: System Status */}
                    <div className="col-span-3 h-full">
                        <SystemStatusPanel
                            status={systemStatus}
                            memory={memory}
                            metrics={metrics}
                        />
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {view === 'canvas' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50"
                    >
                        <WorkflowEditor
                            agents={agents}
                            onClose={() => setView('workflow')}
                            onExecute={executeWorkflow}
                            onSave={saveWorkflow}
                            workflowNodes={workflowNodes}
                            workflowEdges={workflowEdges}
                            explanation={workflowExplanation}
                            output={workflowOutput}
                            isOutputVisible={isOutputVisible}
                            setIsOutputVisible={setIsOutputVisible}
                            executionLogs={executionLogs}
                            activeNodeId={activeNodeId}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AgentMonitoring;
