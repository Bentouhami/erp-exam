// paht: src/components/charts/TotalInvoicesChart.tsx

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
    name: string;
    invoices: number;
}

interface TotalInvoicesChartProps {
    data: ChartData[];
}

export function TotalInvoicesChart({ data }: TotalInvoicesChartProps) {
    return (
        <div className="bg-white p-4 shadow rounded-lg hover:bg-yellow-50">
            <h3 className="text-lg font-semibold mb-4">Total Invoices</h3>
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
                            dataKey="invoices"
                            name="Total Invoices"
                            stroke="#8884d8"
                            strokeWidth={2}
                            dot={{ stroke: '#8884d8', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

