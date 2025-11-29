import React, { useState, useEffect } from 'react';
import { Activity, Zap, AlertTriangle, Brain, HeartPulse, DollarSign, TrendingUp, Lock } from 'lucide-react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import {
    ResponsiveContainer, AreaChart, Area, CartesianGrid, Tooltip, XAxis, YAxis, BarChart, Bar, Cell
} from "recharts";

type TwinState = {
    impact: string;
    cashflowChange: number;
    runwayChange: number;
    riskLevel: string;
    message: string;
    advice?: string;
    timeline: { month: string; balance: number }[];
};

// --- Components ---

const LockedScreen = ({ navigate }: { navigate: (path: string) => void }) => (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="bg-gray-900 border border-white/10 p-8 rounded-2xl text-center max-w-md shadow-2xl">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Premium Feature</h3>
            <p className="text-gray-400 mb-6">
                Unlock FinTwin to simulate your financial future, predict cashflow, and get AI-powered recommendations.
            </p>
            <button
                onClick={() => navigate('/settings')}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center mx-auto"
            >
                Unlock FinTwin with Premium
                <TrendingUp className="w-4 h-4 ml-2" />
            </button>
        </div>
    </div>
);

const Header = ({ twin }: { twin: TwinState | null }) => (
    <div className="flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center">
                <Brain className="w-8 h-8 mr-3 text-cyan-400" />
                FinTwin — AI Financial Digital Twin
                <span className="ml-3 px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 rounded font-bold flex items-center">
                    BUSINESS ★
                </span>
            </h2>
            <p className="text-gray-400 text-sm mt-1">Real-time holographic simulation of your financial future.</p>
        </div>
        {twin && (
            <div className={`px-4 py-2 rounded-full border ${twin.riskLevel === 'Low' ? 'border-green-500/30 bg-green-500/10 text-green-400' :
                twin.riskLevel === 'Medium' ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400' :
                    'border-red-500/30 bg-red-500/10 text-red-400'
                } flex items-center`}>
                <HeartPulse className="w-4 h-4 mr-2" />
                Risk: {twin.riskLevel.toUpperCase()}
            </div>
        )}
    </div>
);

const Panel = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <div className="glass-panel p-6 border border-white/10 rounded-xl bg-white/5 backdrop-blur-md">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center">
            <span className="mr-2">{icon}</span>
            {title}
        </h3>
        {children}
    </div>
);

const TwinChart = ({ data }: { data: { month: string; balance: number }[] }) => (
    <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="month" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="balance" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" name="Projected Balance" />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);

const CashGraph = ({ data }: { data: { month: string; balance: number }[] }) => {
    // Calculate cashflow (change in balance)
    const cashflowData = data.map((item, index) => {
        const prevBalance = index > 0 ? data[index - 1].balance : item.balance; // Assume 0 change for first or use prev
        const change = item.balance - prevBalance;
        return { ...item, cashflow: change };
    });

    return (
        <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashflowData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="month" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                    />
                    <Bar dataKey="cashflow" radius={[4, 4, 0, 0]} name="Net Cashflow">
                        {cashflowData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.cashflow >= 0 ? '#10b981' : '#ef4444'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const RiskCard = ({ twin }: { twin: TwinState | null }) => {
    if (!twin) return <div className="text-gray-400">No simulation data available.</div>;
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-lg">
                <div className="text-xs text-gray-400">Risk Level</div>
                <div className={`text-xl font-bold ${twin.riskLevel === 'High' ? 'text-red-400' :
                    twin.riskLevel === 'Medium' ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                    {twin.riskLevel}
                </div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
                <div className="text-xs text-gray-400">Runway Change</div>
                <div className={`text-xl font-bold ${twin.runwayChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {twin.runwayChange > 0 ? '+' : ''}{twin.runwayChange} Months
                </div>
            </div>
            <div className="col-span-2 p-4 bg-white/5 rounded-lg">
                <div className="text-xs text-gray-400">Cashflow Impact</div>
                <div className={`text-xl font-bold ${twin.cashflowChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {twin.cashflowChange > 0 ? '+' : ''}{twin.cashflowChange}
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---

const FinTwin = () => {
    const { settings, currencySymbol } = useData();
    const navigate = useNavigate();

    const [twin, setTwin] = useState<TwinState | null>(null);
    const [loading, setLoading] = useState(false);

    // Check subscription. Allow Premium Pro, Business, Business SaaS, Enterprise.
    const allowedTiers = ["Premium Pro", "Business", "Business SaaS", "Enterprise"];
    const isLocked = !allowedTiers.includes(settings.subscriptionTier);

    // Trigger AI simulation
    const runTwin = async () => {
        setLoading(true);
        try {
            // Updated URL to correct backend endpoint
            const response = await axios.post("http://localhost:8000/api/findrop", {
                query: "simulate next 12 months",
                api_key: settings.apiKey
            });

            setTwin(response.data);
        } catch (e) {
            console.error("Simulation failed:", e);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!isLocked) {
            runTwin();
        }
    }, [isLocked]);

    if (isLocked) return <LockedScreen navigate={navigate} />;

    return (
        <div className="space-y-6 animate-fade-in relative">
            <Header twin={twin} />

            {loading ? (
                <div className="flex flex-col items-center justify-center h-[400px] glass-panel rounded-xl">
                    {/* Animated Avatar Loading State */}
                    <div className="relative w-32 h-32 mb-6">
                        <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full animate-ping"></div>
                        <div className="absolute inset-2 border-4 border-blue-500/50 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Brain className="w-16 h-16 text-cyan-400 animate-bounce" />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-white">FinTwin AI is thinking...</h3>
                    <p className="text-gray-400 mt-2">Orchestrating 5-Agent Pipeline</p>
                    <div className="flex space-x-2 mt-4 text-xs text-gray-500">
                        <span>Data</span>→<span>Forecast</span>→<span>Risk</span>→<span>Twin</span>→<span>Advice</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Timeline chart */}
                        <Panel title="12-Month Financial Projection" icon={<TrendingUp className="w-5 h-5 text-blue-400" />}>
                            {twin ? <TwinChart data={twin.timeline} /> : <div className="h-[300px] flex items-center justify-center text-gray-500">No data</div>}
                        </Panel>

                        {/* Cashflow bars */}
                        <Panel title="Cashflow Strength" icon={<DollarSign className="text-green-400 w-5 h-5" />}>
                            {twin ? <CashGraph data={twin.timeline} /> : <div className="h-[200px] flex items-center justify-center text-gray-500">No data</div>}
                        </Panel>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* AI Advisory */}
                        <div className="lg:col-span-2">
                            <Panel title="Strategic Advice" icon={<Zap className="text-yellow-400 w-5 h-5" />}>
                                <div className="p-4 text-sm text-gray-200 min-h-[100px] whitespace-pre-wrap">
                                    {/* Display specific advice field if available, else message */}
                                    {twin?.advice || twin?.message || "No advice generated."}
                                </div>
                            </Panel>
                        </div>

                        {/* Risk Advisory */}
                        <div className="lg:col-span-1">
                            <Panel title="Risk & Runway" icon={<AlertTriangle className="text-red-400 w-5 h-5" />}>
                                <RiskCard twin={twin} />
                            </Panel>
                        </div>
                    </div>
                </>
            )}

            <button
                onClick={runTwin}
                disabled={loading}
                className="w-full py-3 bg-blue-600 rounded-lg mt-4 font-bold hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {loading ? "Simulating..." : "🔄 Re-Simulate"}
            </button>
        </div>
    );
};

export default FinTwin;
