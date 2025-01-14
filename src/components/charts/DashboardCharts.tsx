// path: src/components/charts/DashboardCharts.tsx

'use client';
import React, { useEffect, useState } from 'react';
import { RevenueChart } from './RevenueChart';
import { CustomerGrowthChart } from './CustomerGrowthChart';
import { TotalInvoicesChart } from './TotalInvoicesChart';

// Define the type for daily data
interface DailyData {
    [date: string]: {
        totalAmount: number;
        totalTtcAmount: number;
        totalCustomers: number;
    };
}

const DashboardCharts = () => {
    const [dailyData, setDailyData] = useState<DailyData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/v1/dashboard/monthly-summary');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data: DailyData = await response.json();
                setDailyData(data);
            } catch (err) {
                setError('Failed to fetch data');
                console.error('Error fetching daily data:', err);
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <div className="text-red-500 font-bold">Error: {error}</div>;
    }

    if (!dailyData) {
        return <div className="text-gray-500 font-bold">Loading...</div>;
    }

    const chartData = Object.entries(dailyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, data]) => ({
            name: date,
            invoices: Number(data.totalAmount.toFixed(2)),
            revenue: Number(data.totalTtcAmount.toFixed(2)),
            customers: data.totalCustomers,
        }));

    return (
        <div className="w-full  ">
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <TotalInvoicesChart data={chartData} />
                <RevenueChart data={chartData} />
                <CustomerGrowthChart data={chartData} />
            </div>
        </div>
    );
};

export default DashboardCharts;

