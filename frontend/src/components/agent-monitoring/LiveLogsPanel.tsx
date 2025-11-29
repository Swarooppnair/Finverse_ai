import React, { useEffect, useRef } from 'react';
import type { LogEntry } from '../../hooks/useAgentMonitoring';

interface LiveLogsPanelProps {
    logs: LogEntry[];
}

const LiveLogsPanel: React.FC<LiveLogsPanelProps> = ({ logs }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [logs]);

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-2 px-2">
                <h3 className="text-sm font-medium text-gray-400">System Logs</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse">
                    LIVE
                </span>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar"
            >
                {logs.map((log) => (
                    <div
                        key={log.id}
                        className="text-xs p-2 rounded border border-white/5 bg-black/20 hover:bg-white/5 transition-colors font-mono"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-gray-500">[{log.timestamp}]</span>
                            <span className={`
                uppercase text-[10px] font-bold
                ${log.type === 'error' ? 'text-red-400' :
                                    log.type === 'warning' ? 'text-yellow-400' :
                                        log.type === 'success' ? 'text-green-400' : 'text-blue-400'}
              `}>
                                {log.type}
                            </span>
                            <span className="text-gray-400">@{log.source}</span>
                        </div>
                        <p className="text-gray-300 pl-[5.5rem] -mt-4">{log.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LiveLogsPanel;
