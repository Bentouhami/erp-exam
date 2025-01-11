import prisma from '@/lib/db';

// Define the type for the summary object
type MonthlySummary = {
    [date: string]: {
        totalAmount: number;
        totalTtcAmount: number;
    };
};

/**
 * Fetches the daily summary of invoices
 */
export async function getMonthlyInvoiceSummary() {
    const dailySummary = await prisma.invoice.groupBy({
        by: ['issuedAt'],
        _sum: {
            totalAmount: true,
            totalTtcAmount: true,
        },
        orderBy: {
            issuedAt: 'asc',
        },
    });

    // Initialize the accumulator with the correct type
    const summaryByDay: MonthlySummary = dailySummary.reduce((acc, item) => {
        const date = item.issuedAt.toISOString().split('T')[0]; // Format YYYY-MM-DD
        acc[date] = {
            totalAmount: item._sum.totalAmount?.toNumber() || 0,
            totalTtcAmount: item._sum.totalTtcAmount?.toNumber() || 0,
        };
        return acc;
    }, {} as MonthlySummary);

    return summaryByDay;
}

/**
 * Fetches the daily summary of customers
 */
export async function getMonthlyCustomersSummary() {
    const dailySummary = await prisma.user.groupBy({
        by: ['createdAt'],
        where: {
            role: 'CUSTOMER',
        },
        _count: {
            id: true,
        },
        orderBy: {
            createdAt: 'asc',
        },
    });

    const summaryByDay = dailySummary.reduce((acc, item) => {
        const date = item.createdAt.toISOString().split('T')[0]; // Format YYYY-MM-DD
        acc[date] = { totalCustomers: item._count.id };
        return acc;
    }, {} as { [date: string]: { totalCustomers: number } });

    return summaryByDay;
}

