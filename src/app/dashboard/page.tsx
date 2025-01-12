// path: src/app/dashboard/page.tsx

import React from 'react';
import DashboardCharts from "@/components/charts/DashboardCharts";

const DashboardPage = () => {
    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
            <DashboardCharts />
        </div>
    );
};

export default DashboardPage;