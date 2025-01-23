import prisma from "@/lib/db"

export async function generateInvoiceNumber(): Promise<string> {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, "0")

    try {
        return await prisma.$transaction(async (tx) => {
            const lastInvoice = await tx.invoice.findFirst({
                where: {
                    invoiceNumber: {
                        startsWith: `INV${year}${month}`,
                    },
                },
                orderBy: {
                    invoiceNumber: "desc",
                },
            })

            let nextNumber: number
            if (!lastInvoice) {
                nextNumber = 1
            } else {
                const lastSequence = Number.parseInt(lastInvoice.invoiceNumber.slice(-6), 10)
                nextNumber = lastSequence + 1
            }

            return `INV${year}${month}${nextNumber.toString().padStart(6, "0")}`
        })
    } catch (error) {
        console.error("Error generating invoice number:", error)
        throw new Error("Failed to generate invoice number")
    }
}

