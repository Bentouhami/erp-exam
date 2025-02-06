// path: src/lib/utils/invoice.ts

import prisma from "@/lib/db";

/**
 * Generates a new invoice number for the given year and month.
 *
 * @returns An object containing the invoice number and its numeric part.
 * @throws An error if the invoice number cannot be generated.
 * @example const { invoiceNumber, numericPart } = await generateInvoiceNumber();
 */
export async function generateInvoiceNumber(): Promise<{ invoiceNumber: string; numericPart: string }> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");

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
            });

            let nextNumber: number;
            if (!lastInvoice) {
                nextNumber = 1;
            } else {
                const lastSequence = Number.parseInt(lastInvoice.invoiceNumber.slice(-6), 10);
                nextNumber = lastSequence + 1;
            }

            // Generate full invoice number
            const invoiceNumber = `INV${year}${month}${nextNumber.toString().padStart(6, "0")}`;

            // Extract numeric part (remove "INV" prefix)
            const numericPart = invoiceNumber.replace("INV", "");

            return { invoiceNumber, numericPart };
        });
    } catch (error) {
        console.error("Error generating invoice number:", error);
        throw new Error("Failed to generate invoice number");
    }
}


/**
 * Generates a valid communication VCS for the given invoice number.
 *
 * @param numericInvoiceNumber The invoice number in numeric format (e.g., "12345678").
 * @returns The communication VCS string.
 */
export function generateCommunicationVCS(numericInvoiceNumber: string): string {
    // Convert numeric string to a valid number
    const baseNumber = parseInt(numericInvoiceNumber, 10);

    // Compute modulo 97
    const modulo = baseNumber % 97;
    const checkDigits = (97 - modulo).toString().padStart(2, "0"); // Ensure 2 digits

    // Format the VCS with check digits
    return `+++${numericInvoiceNumber.slice(0, 3)}/${numericInvoiceNumber.slice(3, 7)}/${numericInvoiceNumber.slice(7)}${checkDigits}+++`;
}


