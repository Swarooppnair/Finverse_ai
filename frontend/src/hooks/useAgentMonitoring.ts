import { useState, useEffect } from 'react';
import { Brain, Database, Terminal, FileText, Shield, Layers } from 'lucide-react';

export interface Agent {
  id: string;
  name: string;
  status: 'idle' | 'working' | 'waiting';
  icon: any;
}

export interface SystemStatus {
  activeAgent: string;
  step: string;
  verification: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  source: string;
  message: string;
}

export interface MemoryStats {
  shortTerm: number;
  agentContext: number;
}

export interface PerformanceMetrics {
  tasksCompleted: number;
  avgResponse: string;
}

// Helper to map icon names (simplified)
const getIconByName = (name: string) => {
  if (name.includes('Data')) return Database;
  if (name.includes('Execution')) return Terminal;
  if (name.includes('Reasoning')) return Brain;
  if (name.includes('Verification')) return Shield;
  if (name.includes('Writer')) return FileText;
  if (name.includes('Planner')) return Layers;
  return Brain;
};

export const useAgentMonitoring = () => {
  const [agents, setAgents] = useState<Agent[]>([
    { id: '1', name: 'PlannerAgent', status: 'idle', icon: Layers },
    { id: '2', name: 'DataAgent', status: 'idle', icon: Database },
    { id: '3', name: 'ExecutionAgent', status: 'idle', icon: Terminal },
    { id: '4', name: 'ReasoningAgent', status: 'idle', icon: Brain },
    { id: '5', name: 'VerificationAgent', status: 'idle', icon: Shield },
    { id: '6', name: 'WriterAgent', status: 'idle', icon: FileText },
  ]);

  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    activeAgent: '-',
    step: 'Idle',
    verification: '-'
  });

  const [memory, setMemory] = useState<MemoryStats>({
    shortTerm: 0,
    agentContext: 0
  });

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    tasksCompleted: 0,
    avgResponse: '0ms'
  });

  const [isExecuting, setIsExecuting] = useState(false);
  const [view, setView] = useState<'workflow' | 'canvas'>('workflow');
  const [canvasAgents, setCanvasAgents] = useState<Agent[]>([]);
  const [userQuery, setUserQuery] = useState('');

  // New state for enhanced orchestration
  const [workflowNodes, setWorkflowNodes] = useState<any[]>([]);
  const [workflowEdges, setWorkflowEdges] = useState<any[]>([]);
  const [workflowExplanation, setWorkflowExplanation] = useState('');
  const [workflowOutput, setWorkflowOutput] = useState('');
  const [isOutputVisible, setIsOutputVisible] = useState(false);

  // Fetch agents from backend on mount
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/agents');
        if (response.ok) {
          const data = await response.json();
          // Map backend agents to frontend structure
          const mappedAgents = data.map((a: any) => ({
            id: a.id,
            name: a.name,
            status: a.status,
            icon: a.type === 'prebuilt' ? getIconByName(a.name) : Brain
          }));
          setAgents(mappedAgents);
        }
      } catch (error) {
        console.error('Failed to fetch agents:', error);
      }
    };
    fetchAgents();
  }, []);
  const generateWorkflow = async (query: string) => {
    console.log('generateWorkflow called with query:', query);
    setSystemStatus({ activeAgent: 'Orchestrator', step: 'Designing Workflow Architecture', verification: 'Pending' });

    try {
      console.log('Sending request to Backend Orchestrator...');
      const response = await fetch('http://127.0.0.1:8000/api/generate-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend API Error:', response.status, errorText);
        addLog('error', 'Orchestrator', `Backend Error: ${response.status} - ${errorText}`);
        return null;
      }

      const parsed = await response.json();
      console.log('Backend Workflow Response:', parsed);

      setWorkflowExplanation(parsed.explanation);
      return parsed;

    } catch (error) {
      console.error('Orchestration failed', error);
      addLog('error', 'Orchestrator', `Orchestration failed: ${error}`);
      return null;
    }
  };

  const generateFinalOutput = async (query: string, context: string) => {
    console.log('generateFinalOutput called');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/generate-output', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, context })
      });

      if (!response.ok) {
        console.error('Backend Output Error:', response.status);
        setWorkflowOutput('Failed to generate final output from backend.');
        return;
      }

      const data = await response.json();
      console.log('Backend Output Response:', data);

      if (data.output) {
        setWorkflowOutput(data.output);
        setIsOutputVisible(true);
      }

    } catch (error) {
      console.error('Output generation failed', error);
      setWorkflowOutput('Failed to generate final output.');
    }
  };

  const [executionLogs, setExecutionLogs] = useState<LogEntry[]>([]);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  const addLog = (type: 'info' | 'warning' | 'error' | 'success', source: string, message: string) => {
    setExecutionLogs(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      timestamp: new Date().toLocaleTimeString(),
      type,
      source,
      message
    }]);
  };

  const executeWorkflow = async () => {
    console.log('executeWorkflow called. userQuery:', userQuery);
    setView('canvas'); // Switch immediately to canvas
    setIsExecuting(true);
    setExecutionLogs([]);
    setWorkflowNodes([]);
    setWorkflowEdges([]);
    setActiveNodeId(null);
    setIsOutputVisible(false);

    // 1. Analyze Request
    setSystemStatus({ activeAgent: 'Orchestrator', step: 'Analyzing Request', verification: 'Pending' });
    addLog('info', 'Orchestrator', `Analyzing user request: "${userQuery}"`);
    await new Promise(r => setTimeout(r, 1500));

    // 2. Generate Plan (Gemini)
    let generatedPlan = null;
    if (userQuery) {
      addLog('info', 'PlannerAgent', 'Decomposing objective into atomic tasks...');
      generatedPlan = await generateWorkflow(userQuery);
    }

    if (!generatedPlan) {
      addLog('error', 'Orchestrator', 'Failed to generate workflow plan.');
      setIsExecuting(false);
      return;
    }

    // 3. Live Build & Execute Loop
    const nodes = generatedPlan.nodes;
    const edges = generatedPlan.edges;

    // Helper to find edges for a node
    const getEdgesForNode = (nodeId: string) => edges.filter((e: any) => e.target === nodeId);

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      // Add Node
      setWorkflowNodes(prev => [...prev, {
        ...node,
        data: { ...node.data, status: 'working', icon: getIconByName(node.data.name) } // Set to working initially
      }]);

      // Add connecting edges
      const nodeEdges = getEdgesForNode(node.id);
      if (nodeEdges.length > 0) {
        setWorkflowEdges(prev => [...prev, ...nodeEdges.map((e: any) => ({ ...e, animated: true }))]);
      }

      setActiveNodeId(node.id);
      setSystemStatus({ activeAgent: node.data.name, step: 'Executing Task', verification: 'In Progress' });
      addLog('info', node.data.name, `Starting task: ${node.data.label || 'Processing...'}`);

      // Simulate Processing Time
      await new Promise(r => setTimeout(r, 2000));

      // Mark as Completed
      setWorkflowNodes(prev => prev.map(n => n.id === node.id ? { ...n, data: { ...n.data, status: 'idle' } } : n));
      addLog('success', node.data.name, `Task completed successfully.`);

      // Update Metrics
      setMetrics(prev => ({
        tasksCompleted: prev.tasksCompleted + 1,
        avgResponse: `${Math.floor(Math.random() * 200 + 300)}ms`
      }));
    }

    setActiveNodeId(null);
    setSystemStatus({ activeAgent: '-', step: 'Workflow Completed', verification: 'Passed' });
    addLog('success', 'Orchestrator', 'All tasks finished. Compiling final results...');

    await new Promise(r => setTimeout(r, 1000));

    // 4. Final Output
    if (userQuery) {
      await generateFinalOutput(userQuery, workflowExplanation);
    }

    setIsExecuting(false);
  };

  const addToCanvas = (agent: Agent) => {
    if (!canvasAgents.find(a => a.id === agent.id)) {
      setCanvasAgents(prev => [...prev, { ...agent, status: 'idle' }]);
    }
  };

  const removeFromCanvas = (agentId: string) => {
    setCanvasAgents(prev => prev.filter(a => a.id !== agentId));
  };

  const addAgent = async (newAgent: Agent, formData?: any) => {
    // Optimistic update
    setAgents(prev => [...prev, { ...newAgent, status: 'working' }]);

    try {
      if (formData) {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('agent_type', formData.type);
        data.append('api_key', formData.apiKey);
        data.append('context', formData.context);

        if (formData.files) {
          for (let i = 0; i < formData.files.length; i++) {
            data.append('files', formData.files[i]);
          }
        }

        const response = await fetch('http://127.0.0.1:8000/api/add-agent', {
          method: 'POST',
          body: data,
        });

        if (!response.ok) {
          throw new Error('Failed to add agent to backend');
        }

        const result = await response.json();
        console.log('Agent added to backend:', result);

        // After "processing" context, go to idle
        setTimeout(() => {
          setAgents(prev => prev.map(a => a.id === newAgent.id ? { ...a, status: 'idle' } : a));
        }, 2000);
      }
    } catch (error) {
      console.error('Error adding agent:', error);
      // Revert or show error state
      setAgents(prev => prev.map(a => a.id === newAgent.id ? { ...a, status: 'idle' } : a)); // Just reset status for now
    }
  };

  const saveWorkflow = async (name: string) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          nodes: workflowNodes,
          edges: workflowEdges,
          explanation: workflowExplanation
        })
      });
      if (response.ok) {
        console.log('Workflow saved successfully');
      }
    } catch (error) {
      console.error('Failed to save workflow:', error);
    }
  };

  return {
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
  };
};
