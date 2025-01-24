// src/services/backend_Services/Bk_InvoiceService.ts
import prisma from '@/lib/db';

type PeriodSummary = {
    [period: string]: {
        totalAmount: number;
        totalTtcAmount: number;
    };
};

type CustomerPeriodSummary = {
    [period: string]: {
        totalCustomers: number;
    };
};

// Generic function for invoice summaries
async function getInvoiceSummary(period: 'month' | 'week') {
    const dateFormat = period === 'month' ? 'YYYY-MM' : 'IYYY"-W"IW';
    const groupBy = period === 'month' ? 'month' : 'week';

    const result: any[] = await prisma.$queryRaw`
        SELECT
            to_char("issuedAt", ${dateFormat}) as period,
            SUM("totalAmount") as "totalAmount",
            SUM("totalTtcAmount") as "totalTtcAmount"
        FROM "invoices"
        GROUP BY period
        ORDER BY period
    `;

    return result.reduce((acc: PeriodSummary, row) => {
        acc[row.period] = {
            totalAmount: Number(row.totalAmount),
            totalTtcAmount: Number(row.totalTtcAmount)
        };
        return acc;
    }, {});
}

// Generic function for customer summaries
async function getCustomerSummary(period: 'month' | 'week') {
    const dateFormat = period === 'month' ? 'YYYY-MM' : 'IYYY"-W"IW';

    const result: any[] = await prisma.$queryRaw`
        SELECT
            to_char("createdAt", ${dateFormat}) as period,
            COUNT("id") as "totalCustomers"
        FROM "users"
        WHERE "role" = 'CUSTOMER'
        GROUP BY period
        ORDER BY period
    `;

    return result.reduce((acc: CustomerPeriodSummary, row) => {
        acc[row.period] = {
            totalCustomers: Number(row.totalCustomers)
        };
        return acc;
    }, {});
}

// Updated service functions
export async function getMonthlyInvoiceSummary() {
    return getInvoiceSummary('month');
}

export async function getWeeklyInvoiceSummary() {
    return getInvoiceSummary('week');
}

export async function getMonthlyCustomersSummary() {
    return getCustomerSummary('month');
}

export async function getWeeklyCustomersSummary() {
    return getCustomerSummary('week');
}