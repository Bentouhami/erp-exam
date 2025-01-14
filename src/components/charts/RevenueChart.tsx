// path: src/components/charts/RevenueChart.tsx

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
    name: string;
    revenue: number;
}

interface RevenueChartProps {
    data: ChartData[];
}

export function RevenueChart({ data }: RevenueChartProps) {
    return (
        <div className="bg-white p-4 rounded-lg shadow hover:bg-yellow-50">
            <h3 className="text-lg font-semibold mb-4">Revenue Over Time</h3>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            name="Total Revenue"
                            stroke="#82ca9d"
                            strokeWidth={2}
                            dot={{ stroke: '#82ca9d', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

