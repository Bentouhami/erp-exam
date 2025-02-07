// path: src/app/api/v1/dashboard/monthly-summary/route.ts

import {NextRequest, NextResponse} from 'next/server';
import {getMonthlyCustomersSummary, getMonthlyInvoiceSummary} from "@/services/backend_Services/Bk_InvoiceService";
import {checkAuthStatus} from "@/lib/utils/auth-helper";

export async function GET(request: NextRequest) {


    if (request.method !== 'GET') {
        return NextResponse.json({error: 'Method not allowed'}, {status: 405});
    }

    console.log("log ====> GET method called in path src/app/api/v1/dashboard/monthly-summary/route.ts");

    // Verify if the user is authenticated
    const {isAuthenticated, role} = await checkAuthStatus();
    if (!isAuthenticated) return NextResponse.json({error: 'You must be connected.'}, {status: 401});
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN' && role !== 'ACCOUNTANT') return NextResponse.json({error: 'You must be an admin or an accountant to access this route.'}, {status: 401});

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

        if (!combinedData) return NextResponse.json({error: "No data found!"}, {status: 404})

        return NextResponse.json(
            combinedData,
            {
                status: 200,
                headers: {
                    'Cache-Control': 'no-store, max-age=0'
                }
            }
        );
    } catch (error) {
        console.error('Error fetching monthly summary:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch data'
            }, {
                status: 500,
                headers: {
                    'Cache-Control': 'no-store, max-age=0'
                }
            }
        );
    }
}

export const dynamic = "force-dynamic"

