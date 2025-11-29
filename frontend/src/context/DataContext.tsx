import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';

// --- Types ---
export type TransactionType = 'income' | 'expense';

export interface Transaction {
    id: string;
    date: string;
    amount: number;
    type: TransactionType;
    category: string;
    description?: string;
}

export interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
    priority: 'High' | 'Medium' | 'Low';
}

export interface UserSettings {
    currency: string;
    theme: 'dark' | 'light';
    notifications: boolean;
    riskTolerance: 'Low' | 'Medium' | 'High';
    subscriptionTier: 'Free' | 'Premium' | 'Premium Pro' | 'Business SaaS';
    apiKey?: string;
}

export interface ForecastData {
    labels: string[];
    income: number[];
    expense: number[];
    net_cashflow: number[];
}

export interface Anomaly {
    id: string;
    date: string;
    amount: number;
    description: string;
    risk_score: number;
    reason: string;
}

export interface Insights {
    monthly_burn_rate: number;
    runway_months: number;
    top_expense_category: string;
    savings_rate: string;
    net_worth_trend: string;
}

interface DataContextType {
    transactions: Transaction[];
    goals: Goal[];
    settings: UserSettings;
    forecasts: ForecastData | null;
    anomalies: Anomaly[];
    insights: Insights | null;

    // Derived Stats
    totalBalance: number;
    totalIncome: number;
    totalExpense: number;
    runwayMonths: number;
    monthlyBurnRate: number;
    currencySymbol: string;

    // Actions
    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    deleteTransaction: (id: string) => void;
    addGoal: (goal: Omit<Goal, 'id' | 'currentAmount'>) => void;
    updateGoal: (id: string, amount: number) => void; // Add to current amount
    deleteGoal: (id: string) => void;
    updateSettings: (newSettings: Partial<UserSettings>) => void;
    clearAllData: () => void;
}

// --- Context ---
const DataContext = createContext<DataContextType | undefined>(undefined);

// --- Provider ---
export const DataProvider = ({ children }: { children: ReactNode }) => {
    // API URL
    const API_URL = 'http://localhost:8000'; // Pointing to local backend which proxies/syncs

    // State
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [settings, setSettings] = useState<UserSettings>({
        currency: 'USD',
        theme: 'dark',
        notifications: true,
        riskTolerance: 'Medium',
        subscriptionTier: 'Free',
        apiKey: '',
    });
    const [forecasts, setForecasts] = useState<ForecastData | null>(null);
    const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
    const [insights, setInsights] = useState<Insights | null>(null);

    // Fetch Data on Mount and when settings change
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch live data from backend dashboard endpoint
                // Pass currency and api_key from settings
                const response = await axios.get(`${API_URL}/api/dashboard`, {
                    params: {
                        currency: settings.currency,
                        api_key: settings.apiKey
                    }
                });
                const data = response.data;

                if (data) {
                    if (data.transactions) {
                        const mappedTransactions: Transaction[] = data.transactions.map((t: any) => ({
                            id: t.transaction_id,
                            date: t.date,
                            amount: t.amount,
                            type: t.type === 'Credit' ? 'income' : 'expense',
                            category: t.description,
                            description: t.description
                        }));
                        setTransactions(mappedTransactions);
                    }
                    if (data.forecasts) setForecasts(data.forecasts);
                    if (data.anomalies) setAnomalies(data.anomalies);
                    if (data.insights) setInsights(data.insights);
                }

                // Goals are not provided by the external API, so we leave them empty.
                setGoals([]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [settings.currency, settings.apiKey]);

    // Derived Stats Calculations
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = totalIncome - totalExpense;

    // Simple Burn Rate
    const monthlyBurnRate = totalExpense > 0 ? totalExpense : 0;

    // Runway
    const runwayMonths = monthlyBurnRate > 0 ? Math.round((totalBalance / monthlyBurnRate) * 10) / 10 : 0;

    // Actions - Disabled/Removed as per user request
    const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
        console.warn("Add transaction is disabled.");
    };

    const deleteTransaction = (id: string) => {
        console.warn("Delete transaction is disabled.");
    };

    const addGoal = (goal: Omit<Goal, 'id' | 'currentAmount'>) => {
        console.warn("Add goal is disabled.");
    };

    const updateGoal = (id: string, amount: number) => {
        console.warn("Update goal is disabled.");
    };

    const deleteGoal = (id: string) => {
        console.warn("Delete goal is disabled.");
    };

    const updateSettings = (newSettings: Partial<UserSettings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const clearAllData = () => {
        // No-op
    };

    // Currency Symbol Helper
    const getCurrencySymbol = (code: string) => {
        const symbols: Record<string, string> = {
            USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥',
            AUD: 'A$', CAD: 'C$', CHF: 'Fr', CNY: '¥', NZD: 'NZ$',
            SEK: 'kr', KRW: '₩', SGD: 'S$', NOK: 'kr', MXN: '$',
            RUB: '₽', ZAR: 'R', TRY: '₺', BRL: 'R$', AED: 'د.إ',
            HKD: 'HK$'
        };
        return symbols[code] || '$';
    };

    const currencySymbol = getCurrencySymbol(settings.currency);

    return (
        <DataContext.Provider value={{
            transactions,
            goals,
            settings,
            forecasts,
            anomalies,
            insights,
            totalBalance,
            totalIncome,
            totalExpense,
            runwayMonths,
            monthlyBurnRate,
            currencySymbol,
            addTransaction,
            deleteTransaction,
            addGoal,
            updateGoal,
            deleteGoal,
            updateSettings,
            clearAllData,
        }}>
            {children}
        </DataContext.Provider>
    );
};

// --- Hook ---
export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
