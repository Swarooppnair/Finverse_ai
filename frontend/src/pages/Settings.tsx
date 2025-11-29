import React from 'react';
import { Bell, Wallet, LogOut, Trash2, Check, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { convertPrice, getCurrencySymbol } from '../utils/currency';

const Settings = () => {
    const { logout } = useAuth();
    const { settings, updateSettings, clearAllData } = useData();

    const handleClearData = () => {
        if (confirm("Are you sure you want to clear all your financial data? This cannot be undone.")) {
            clearAllData();
            alert("All data has been reset.");
        }
    };

    const getPlanPrice = (plan: { name: string; price: number }) => {
        if (settings.currency === 'INR') {
            const inrPrices: Record<string, number> = {
                "Free": 0,
                "Premium": 799,
                "Premium Pro": 7999,
                "Business SaaS": 19999
            };
            return inrPrices[plan.name]?.toLocaleString('en-IN');
        }
        return convertPrice(plan.price, settings.currency);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-gray-400">Manage your account and application preferences.</p>
            </div>

            <div className="glass-panel p-6 space-y-6">
                <div className="flex items-center space-x-4 pb-6 border-b border-white/10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold text-white">
                        S
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Swaroop</h2>
                        <p className="text-gray-400">swaroop@finverse.ai</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white flex items-center">
                        <Wallet className="w-5 h-5 mr-2 text-primary" />
                        Preferences
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Currency</label>
                            <select
                                value={settings.currency}
                                onChange={(e) => updateSettings({ currency: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                            >
                                {[
                                    { code: "USD", name: "US Dollar ($)" },
                                    { code: "EUR", name: "Euro (€)" },
                                    { code: "GBP", name: "British Pound (£)" },
                                    { code: "INR", name: "Indian Rupee (₹)" },
                                    { code: "JPY", name: "Japanese Yen (¥)" },
                                    { code: "AUD", name: "Australian Dollar (A$)" },
                                    { code: "CAD", name: "Canadian Dollar (C$)" },
                                    { code: "CHF", name: "Swiss Franc (Fr)" },
                                    { code: "CNY", name: "Chinese Yuan (¥)" },
                                    { code: "NZD", name: "New Zealand Dollar (NZ$)" },
                                    { code: "SEK", name: "Swedish Krona (kr)" },
                                    { code: "KRW", name: "South Korean Won (₩)" },
                                    { code: "SGD", name: "Singapore Dollar (S$)" },
                                    { code: "NOK", name: "Norwegian Krone (kr)" },
                                    { code: "MXN", name: "Mexican Peso ($)" },
                                    { code: "RUB", name: "Russian Ruble (₽)" },
                                    { code: "ZAR", name: "South African Rand (R)" },
                                    { code: "TRY", name: "Turkish Lira (₺)" },
                                    { code: "BRL", name: "Brazilian Real (R$)" },
                                    { code: "AED", name: "UAE Dirham (د.إ)" },
                                    { code: "HKD", name: "Hong Kong Dollar (HK$)" },
                                ].map((c) => (
                                    <option key={c.code} value={c.code} className="bg-[#0F111A] text-white">
                                        {c.code} - {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Risk Tolerance</label>
                            <select
                                value={settings.riskTolerance}
                                onChange={(e) => updateSettings({ riskTolerance: e.target.value as any })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                            >
                                <option value="Low" className="bg-[#0F111A] text-white">Low (Conservative)</option>
                                <option value="Medium" className="bg-[#0F111A] text-white">Medium (Balanced)</option>
                                <option value="High" className="bg-[#0F111A] text-white">High (Aggressive)</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="text-sm text-gray-400">OpenRouter API Key (for AI Features)</label>
                        <div className="relative mt-1">
                            <input
                                type="password"
                                value={settings.apiKey || ''}
                                onChange={(e) => updateSettings({ apiKey: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                placeholder="sk-or-..."
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Required for Chat, FinDrop, and Tax Reports.</p>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10">
                    <h3 className="text-lg font-medium text-white flex items-center">
                        <Bell className="w-5 h-5 mr-2 text-primary" />
                        Notifications
                    </h3>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                            <p className="text-white font-medium">Enable Notifications</p>
                            <p className="text-sm text-gray-400">Receive alerts for anomalies and tax deadlines</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.notifications}
                                onChange={(e) => updateSettings({ notifications: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10">
                    <h3 className="text-lg font-medium text-white flex items-center">
                        <Crown className="w-5 h-5 mr-2 text-primary" />
                        Subscription Plan
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            {
                                name: "Free",
                                price: 0,
                                features: ["Basic Dashboard", "Manual Tracking", "Standard Reports"],
                                recommended: false
                            },
                            {
                                name: "Premium",
                                price: 199,
                                features: ["AI Insights", "Advanced Analytics", "Goal Tracking", "Priority Support"],
                                recommended: true
                            },
                            {
                                name: "Premium Pro",
                                price: 2999,
                                features: ["Everything in Premium", "Wealth Forecasting", "Tax Optimization", "Dedicated Advisor"],
                                recommended: false
                            },
                            {
                                name: "Business SaaS",
                                price: 9999,
                                features: ["Everything in Pro", "API Access", "White Labeling", "Custom Integrations", "SLA"],
                                recommended: false
                            }
                        ].map((plan) => (
                            <div
                                key={plan.name}
                                className={`relative p-4 rounded-xl border ${plan.recommended
                                    ? 'bg-primary/10 border-primary'
                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                                    } transition-all cursor-pointer group`}
                            >
                                {plan.recommended && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full">
                                        RECOMMENDED
                                    </div>
                                )}
                                <div className="text-center mb-4">
                                    <h4 className="text-lg font-bold text-white">{plan.name}</h4>
                                    <div className="text-2xl font-bold text-primary mt-2">
                                        {getCurrencySymbol(settings.currency)}{getPlanPrice(plan)}<span className="text-sm text-gray-400 font-normal">/mo</span>
                                    </div>
                                </div>
                                <ul className="space-y-2 mb-4">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start text-sm text-gray-400">
                                            <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => updateSettings({ subscriptionTier: plan.name as any })}
                                    className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${settings.subscriptionTier === plan.name
                                        ? 'bg-green-500 text-black cursor-default'
                                        : plan.recommended
                                            ? 'bg-primary text-black hover:bg-primary/90'
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                        }`}
                                >
                                    {settings.subscriptionTier === plan.name ? "Active Plan" : "Upgrade"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex space-x-4">
                    <button
                        onClick={logout}
                        className="flex items-center px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                    >
                        <LogOut size={18} className="mr-2" />
                        Sign Out
                    </button>
                    <button
                        onClick={handleClearData}
                        className="flex items-center px-4 py-2 bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 rounded-lg transition-colors"
                    >
                        <Trash2 size={18} className="mr-2" />
                        Clear All Data
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
