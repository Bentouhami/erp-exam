// src/app/api/v1/dashboard/weekly-summary/route.ts
import { NextResponse } from 'next/server';
import { getWeeklyInvoiceSummary, getWeeklyCustomersSummary } from "@/services/backend_Services/Bk_InvoiceService";

export async function GET() {
    try {
        const invoiceSummary = await getWeeklyInvoiceSummary();
        const customerSummary = await getWeeklyCustomersSummary();

        const combinedData = Object.keys(invoiceSummary).reduce((acc, week) => {
            acc[week] = {
                totalAmount: invoiceSummary[week].totalAmount,
                totalTtcAmount: invoiceSummary[week].totalTtcAmount,
                totalCustomers: customerSummary[week]?.totalCustomers || 0
            };
            return acc;
        }, {} as { [week: string]: { totalAmount: number; totalTtcAmount: number; totalCustomers: number } });

        if(!combinedData) return NextResponse.json({ error: 'No data found' }, { status: 404 });

        return NextResponse.json(combinedData, { status: 200 });
    } catch (error) {
        console.error('Error fetching weekly summary:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

export const dynamic = "force-dynamic";