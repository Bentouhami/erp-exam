// path : src/lib/utils/item.ts

import prisma from "@/lib/db";

export async function generateItemNumber(): Promise<string> {
    // Get the current year and month
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2); // Get last 2 digits of the year
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    // Find the last item created this year
    const lastItem = await prisma.item.findFirst({
        where: {
            itemNumber: {
                startsWith: `ITM${year}${month}`
            }
        },
        orderBy: {
            itemNumber: 'desc'
        }
    });

    let sequenceNumber: number;

    if (!lastItem) {
        // If no items exist for this month, start with 1
        sequenceNumber = 1;
    } else {
        // Extract the sequence number from the last item number
        // Format: ITM2501000001 -> extract the last 6 digits
        const lastSequence = parseInt(lastItem.itemNumber.slice(-6));
        sequenceNumber = lastSequence + 1;
    }

    // Format: ATM + YY + MM + 000001
    // Example: ITM2501000001
    const formattedNumber = `ITM${year}${month}${sequenceNumber.toString().padStart(6, '0')}`;

    return formattedNumber;
}