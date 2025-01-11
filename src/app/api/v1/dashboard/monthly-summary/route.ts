// path: src/app/api/v1/dashboard/monthly-summary/route.ts

import { NextResponse } from 'next/server';
import { getMonthlyCustomersSummary, getMonthlyInvoiceSummary } from "@/services/backend_Services/Bk_InvoiceService";

export async function GET() {
    try {
        // get the monthly invoice summary
        const invoiceMonthlySummary = await getMonthlyInvoiceSummary();
        // get the monthly customer summary
        const customerMonthlySummary = await getMonthlyCustomersSummary();

        // Combine the data into a single object
        const combinedData = Object.keys(invoiceMonthlySummary).reduce((acc, month) => {
            acc[month] = {
                totalAmount: invoiceMonthlySummary[month].totalAmount,
                totalTtcAmount: invoiceMonthlySummary[month].totalTtcAmount,
                totalCustomers: customerMonthlySummary[month]?.totalCustomers || 0
            };
            return acc;
        }, {} as { [month: string]: { totalAmount: number; totalTtcAmount: number; totalCustomers: number } });

        return NextResponse.json(combinedData, { status: 200 });
    } catch (error) {
        console.error('Error fetching monthly summary:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

