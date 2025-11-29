import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, TrendingDown, TrendingUp, AlertTriangle, DollarSign, Calendar, Activity } from 'lucide-react';
import axios from 'axios';
import { useData } from '../context/DataContext';

const FinDrop: React.FC = () => {
    const [query, setQuery] = useState('');
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationResult, setSimulationResult] = useState<any>(null);

    const { settings } = useData();

    const handleSimulation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsSimulating(true);
        setSimulationResult(null);

        try {
            const response = await axios.post('http://localhost:8000/api/findrop', {
                query: query,
                api_key: settings.apiKey
            });
            setSimulationResult(response.data);
        } catch (error) {
            console.error("Simulation error:", error);
            alert("Failed to generate simulation. Please check your API key in Settings.");
        } finally {
            setIsSimulating(false);
        }
    };

    return (
        <div className="h-screen bg-[#0F111A] text-white p-8 overflow-hidden flex flex-col">
            <header className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    FinDrop AI
                </h1>
                <p className="text-gray-400 mt-2">The "What If" Financial Life Simulator</p>
            </header>

            <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full gap-8">
                {/* Input Section */}
                <div className="w-full">
                    <form onSubmit={handleSimulation} className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
                        <div className="relative bg-white/5 border border-white/10 rounded-2xl p-2 flex items-center gap-4">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="What if I quit my job for 4 months?"
                                className="flex-1 bg-transparent border-none outline-none text-lg px-4 py-3 text-white placeholder-gray-500"
                            />
                            <button
                                type="submit"
                                disabled={isSimulating}
                                className="p-3 bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSimulating ? (
                                    <Activity className="animate-spin" size={24} />
                                ) : (
                                    <Send size={24} />
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Suggestions */}
                    {!simulationResult && !isSimulating && (
                        <div className="mt-6 flex flex-wrap gap-3 justify-center">
                            {[
                                "What if I buy a MacBook on EMI?",
                                "What if I move to Bangalore?",
                                "What if I switch my credit card?"
                            ].map((suggestion, i) => (
                                <button
                                    key={i}
                                    onClick={() => setQuery(suggestion)}
                                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Results Section */}
                <AnimatePresence mode="wait">
                    {simulationResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            {/* Main Impact Card */}
                            <div className="col-span-full bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                                <div className={`absolute top-0 right-0 p-4 ${simulationResult.impact === 'negative' ? 'text-red-400' : 'text-green-400'}`}>
                                    {simulationResult.impact === 'negative' ? <TrendingDown size={32} /> : <TrendingUp size={32} />}
                                </div>
                                <h3 className="text-xl font-bold mb-2">Simulation Result</h3>
                                <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
                                    {simulationResult.message}
                                </p>
                            </div>

                            {/* Metrics */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4 text-gray-400">
                                    <DollarSign size={20} />
                                    <span className="font-medium">Cashflow Impact</span>
                                </div>
                                <div className={`text-3xl font-bold ${simulationResult.cashflowChange < 0 ? 'text-red-400' : 'text-green-400'}`}>
                                    {simulationResult.cashflowChange > 0 ? '+' : ''}{simulationResult.cashflowChange}
                                    <span className="text-sm text-gray-500 font-normal ml-2">monthly</span>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4 text-gray-400">
                                    <Calendar size={20} />
                                    <span className="font-medium">Runway Impact</span>
                                </div>
                                <div className="text-3xl font-bold text-orange-400">
                                    {simulationResult.runwayChange}
                                    <span className="text-sm text-gray-500 font-normal ml-2">months</span>
                                </div>
                            </div>

                            {/* Risk Warning */}
                            <div className="col-span-full bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-start gap-4">
                                <AlertTriangle className="text-red-400 shrink-0" size={24} />
                                <div>
                                    <h4 className="text-red-400 font-bold mb-1">High Risk Detected</h4>
                                    <p className="text-red-400/80 text-sm">
                                        This decision significantly shortens your financial runway. Ensure you have an emergency fund covering at least 6 months of expenses before proceeding.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default FinDrop;
