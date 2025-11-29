import React, { useState } from 'react';
import { DollarSign, TrendingUp, Wallet, Activity } from 'lucide-react';
import KPIBox from '../components/KPIBox';
import ForecastChart from '../components/ForecastChart';
import AnomalyList from '../components/AnomalyList';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';

const Dashboard = () => {
    const {
        totalBalance,
        totalIncome,
        totalExpense,
        runwayMonths,
        transactions,
        currencySymbol,
        settings
    } = useData();

    console.log('Current Subscription Tier:', settings.subscriptionTier);

    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const handleExport = () => {
        setIsExportModalOpen(true);
    };

    const downloadCSV = () => {
        // Flatten data for CSV
        const rows = [
            ['Metric', 'Value'],
            ['Total Balance', `${currencySymbol}${totalBalance}`],
            ['Total Income', `${currencySymbol}${totalIncome}`],
            ['Total Expense', `${currencySymbol}${totalExpense}`],
            ['Runway (Months)', runwayMonths],
            [],
            ['Date', 'Type', 'Category', 'Amount'],
            ...transactions.map(t => [
                t.date,
                t.type,
                t.category,
                `${currencySymbol}${t.amount}`
            ])
        ];

        const csvContent = "data:text/csv;charset=utf-8,"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "financial_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsExportModalOpen(false);
    };

    const handlePDF = () => {
        setIsExportModalOpen(false);
        setTimeout(() => {
            window.print();
        }, 500);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Financial Overview</h1>
                    <p className="text-gray-400">Welcome back, Swaroop. Here's your financial health.</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors"
                    >
                        Export Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPIBox
                    title="Total Balance"
                    value={`${currencySymbol}${totalBalance.toLocaleString()}`}
                    change={totalBalance >= 0 ? "+0%" : "-0%"}
                    trend={totalBalance >= 0 ? "up" : "down"}
                    icon={Wallet}
                />
                <KPIBox
                    title="Total Income"
                    value={`${currencySymbol}${totalIncome.toLocaleString()}`}
                    change="+0%"
                    trend="up"
                    icon={DollarSign}
                />
                <KPIBox
                    title="Total Expenses"
                    value={`${currencySymbol}${totalExpense.toLocaleString()}`}
                    change="+0%"
                    trend="down"
                    icon={Activity}
                />
                <KPIBox
                    title="Runway"
                    value={`${runwayMonths} Months`}
                    change={runwayMonths > 6 ? "+1" : "-1"}
                    trend={runwayMonths > 6 ? "up" : "down"}
                    icon={TrendingUp}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ForecastChart />
                </div>
                <div>
                    <AnomalyList />
                </div>
            </div>

            {/* Export Modal */}
            <Modal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                title="Export Report"
            >
                <div className="space-y-4">
                    <p className="text-gray-300">Select the format you want to export your report in:</p>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={handlePDF}
                            className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex flex-col items-center justify-center space-y-2 transition-colors"
                        >
                            <span className="text-2xl">📄</span>
                            <span className="text-sm font-medium text-white">PDF (Print)</span>
                        </button>
                        <button
                            onClick={downloadCSV}
                            className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex flex-col items-center justify-center space-y-2 transition-colors"
                        >
                            <span className="text-2xl">📊</span>
                            <span className="text-sm font-medium text-white">CSV</span>
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Dashboard;
