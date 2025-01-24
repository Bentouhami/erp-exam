// path : src/lib/utils/item.ts

import prisma from "@/lib/db";

export async function generateItemNumber(): Promise<string> {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, "0")

    try {
        return await prisma.$transaction(async (tx) => {

            // Find the last item created this year
            const lastItem = await tx.item.findFirst({
                where: {
                    itemNumber: {
                        startsWith: `ITM${year}${month}`
                    }
                },
                orderBy: {
                    itemNumber: 'desc'
                }
            });

            let nextNumber: number
            if (!lastItem) {
                nextNumber = 1
            } else {
                const lastSequence = Number.parseInt(lastItem.itemNumber.slice(-6), 10)
                nextNumber = lastSequence + 1
            }

            return `ITM${year}${month}${nextNumber.toString().padStart(6, "0")}`
        })
    } catch (error) {
        console.error("Error generating invoice number:", error)
        throw new Error("Failed to generate invoice number")
    }
}