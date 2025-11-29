import React from 'react';
import { FileText, CheckCircle, AlertTriangle, Calendar, Download } from 'lucide-react';
import { useData } from '../context/DataContext';

const Reports = () => {
    const { totalIncome, transactions, currencySymbol, settings } = useData();

    // Simple Tax Logic for Demo
    const taxableIncome = Math.max(0, totalIncome - 12500); // Standard deduction example
    const estimatedTax = taxableIncome * 0.2; // Flat 20% rate for demo
    const filingStatus = totalIncome > 0 ? "Pending" : "Not Required";
    const dueDate = "April 15, 2026";

    const handleDownload = () => {
        window.print();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Tax & Compliance Reports</h1>
                    <p className="text-gray-400">Automated tax filing and compliance status based on your data.</p>
                </div>
                <button
                    onClick={handleDownload}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors"
                >
                    <Download size={18} />
                    <span>Download Report</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6">
                    <h3 className="text-gray-400 text-sm font-medium">Total Income</h3>
                    <p className="text-2xl font-bold text-white mt-1">{currencySymbol}{totalIncome.toLocaleString()}</p>
                </div>
                <div className="glass-panel p-6">
                    <h3 className="text-gray-400 text-sm font-medium">Taxable Income (Est.)</h3>
                    <p className="text-2xl font-bold text-white mt-1">{currencySymbol}{taxableIncome.toLocaleString()}</p>
                </div>
                <div className="glass-panel p-6 border-primary/50 bg-primary/10">
                    <h3 className="text-primary text-sm font-medium">Estimated Tax Liability</h3>
                    <p className="text-2xl font-bold text-white mt-1">{currencySymbol}{estimatedTax.toLocaleString()}</p>
                </div>
            </div>

            <div className="glass-panel p-6">
                <h3 className="text-lg font-semibold mb-4">Filing Status</h3>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <Calendar className="text-gray-400" />
                        <div>
                            <p className="text-white font-medium">Due Date</p>
                            <p className="text-sm text-gray-500">{dueDate}</p>
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${filingStatus === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                        }`}>
                        {filingStatus}
                    </span>
                </div>
            </div>

            {/* Transaction Summary for Report */}
            <div className="glass-panel p-6">
                <h3 className="text-lg font-semibold mb-4">Transaction Summary</h3>
                {transactions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="text-xs uppercase bg-white/5 text-gray-300">
                                <tr>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Category</th>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.slice(0, 5).map((t) => (
                                    <tr key={t.id} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="px-4 py-3">{t.date}</td>
                                        <td className="px-4 py-3">{t.category}</td>
                                        <td className="px-4 py-3 capitalize">{t.type}</td>
                                        <td className={`px-4 py-3 text-right font-medium ${t.type === 'income' ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                            {t.type === 'income' ? '+' : '-'}{currencySymbol}{t.amount.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {transactions.length > 5 && (
                            <p className="text-center text-xs text-gray-500 mt-4">Showing last 5 transactions</p>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">No transactions recorded yet.</p>
                )}
            </div>
        </div>
    );
};

export default Reports;
