import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const useDashboardData = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/dashboard`);
                setData(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch dashboard data');
                setLoading(false);
                // Use mock data for demo if backend is not running
                console.warn("Backend not reachable, using mock data");
                setData({
                    totalBalance: 124500,
                    forecasts: {
                        income: [50000, 52000, 51000, 55000, 58000, 60000],
                        expense: [30000, 31000, 29000, 35000, 32000, 33000],
                        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
                    },
                    anomalies: [],
                    insights: {
                        monthly_burn_rate: 45000,
                        runway_months: 18
                    }
                });
            }
        };

        fetchData();
    }, []);

    return { data, loading, error, setData };
};
