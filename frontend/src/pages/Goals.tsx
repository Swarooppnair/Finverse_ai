import React, { useState } from 'react';
import { Target, Plus, Calendar, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';

const Goals = () => {
    const { goals, addGoal, updateGoal, deleteGoal, currencySymbol } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [deadline, setDeadline] = useState('');
    const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

    const handleSubmit = () => {
        if (!name || !targetAmount || !deadline) return;

        addGoal({
            name,
            targetAmount: parseFloat(targetAmount),
            deadline,
            priority
        });

        setIsModalOpen(false);
        setName('');
        setTargetAmount('');
        setDeadline('');
        setPriority('Medium');
    };

    const handleAddSavings = (id: string) => {
        const amount = prompt(`Enter amount to add to this goal (${currencySymbol}):`);
        if (amount) {
            updateGoal(id, parseFloat(amount));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Financial Goals</h1>
                    <p className="text-gray-400">Track and manage your financial targets.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors"
                >
                    <Plus size={18} />
                    <span>Add New Goal</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map((goal) => {
                    const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);

                    return (
                        <div key={goal.id} className="glass-panel p-6 border border-white/10 hover:border-primary/50 transition-colors group relative">
                            <button
                                onClick={() => deleteGoal(goal.id)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <AlertCircle size={16} />
                            </button>

                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-primary/20 rounded-xl">
                                    <Target className="text-primary w-6 h-6" />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${goal.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                                        goal.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-green-500/20 text-green-400'
                                    }`}>
                                    {goal.priority} Priority
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-1">{goal.name}</h3>
                            <div className="flex items-center text-gray-400 text-sm mb-4">
                                <Calendar size={14} className="mr-1" />
                                <span>Target: {goal.deadline}</span>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Progress</span>
                                    <span className="text-white font-medium">{Math.round(progress)}%</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>{currencySymbol}{goal.currentAmount.toLocaleString()}</span>
                                    <span>{currencySymbol}{goal.targetAmount.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleAddSavings(goal.id)}
                                className="w-full py-2 border border-white/10 hover:bg-white/5 rounded-lg text-sm font-medium text-white transition-colors"
                            >
                                + Add Savings
                            </button>
                        </div>
                    );
                })}

                {goals.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 glass-panel border border-dashed border-white/20">
                        <Target className="w-12 h-12 text-gray-600 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No Goals Yet</h3>
                        <p className="text-gray-400 text-center max-w-md mb-6">
                            Set financial targets to track your progress. Add a goal to get started!
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-6 py-2 bg-primary hover:bg-primary/90 rounded-lg font-medium transition-colors"
                        >
                            Create First Goal
                        </button>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create Financial Goal"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Goal Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                            placeholder="e.g., Emergency Fund, New Car"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Target Amount ({currencySymbol})</label>
                        <input
                            type="number"
                            value={targetAmount}
                            onChange={(e) => setTargetAmount(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                            placeholder="10000"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Target Date</label>
                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary [color-scheme:dark]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Priority</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['Low', 'Medium', 'High'].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPriority(p as any)}
                                    className={`py-2 rounded-lg text-sm font-medium border transition-colors ${priority === p
                                        ? 'bg-primary/20 border-primary text-primary'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 rounded-lg transition-colors mt-2"
                    >
                        Create Goal
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Goals;
