// path: src/app/api/v1/dashboard/summary/route.ts
'use server'

import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/db";
import {auth} from "@/auth/auth";
import {checkAuthStatus} from "@/lib/utils/auth-helper";

/**
 * @method GET - Fetches summary data for the dashboard
 * @param req  - The incoming request object
 */
export async function GET(req: NextRequest) {

    if (req.method !== 'GET') {
        return NextResponse.json(
            {
                message: 'Method not allowed'
            }, {
                status: 405,
                headers: {'Cache-Control': 'no-store, max-age=0'}
            }
        );
    }
    const {isAuthenticated, role} = await checkAuthStatus();
    if (!isAuthenticated) return NextResponse.json({error: 'You must be connected.'}, {status: 401});
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN' && role !== 'ACCOUNTANT') return NextResponse.json({error: 'You must be an admin or an accountant to access this route.'}, {status: 401});


    console.log("log ====> GET method called in path src/app/api/v1/dashboard/summary/route.ts");


    try {
        const totalInvoices = await prisma.invoice.count();
        const totalCustomers = await prisma.user.count({where: {role: 'CUSTOMER'}});
        const totalItems = await prisma.item.count();
        const totalRevenue = await prisma.invoice.aggregate({
            _sum: {
                totalAmount: true,
            },
        });

        console.log("log ====> totalRevenue in GET method in path src/app/api/v1/dashboard/summary/route.ts:", totalRevenue);


        // Extract the total sum value
        const totalAmountSum = totalRevenue._sum.totalAmount ?? 0;

        return NextResponse.json({totalInvoices, totalCustomers, totalItems, totalAmountSum}, {
            status: 200,
            headers: {'Cache-Control': 'no-store, max-age=0'}
        });
    } catch (error) {
        console.error('Error fetching summary data:', error);
        return NextResponse.json({message: 'Error fetching summary data'}, {status: 500, headers: {'Cache-Control': 'no-store, max-age=0'}});
    }
}