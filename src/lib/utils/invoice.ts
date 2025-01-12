// path: src/lib/utils/invoice.ts

import prisma from "@/lib/db";
export async function generateInvoiceNumber(): Promise<string> {

    // Get the current year and month
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2); // Get last 2 digits of year
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    // Rechercher la dernière facture émise pour l'année en cours
    const lastInvoice = await prisma.invoice.findFirst({
        where: {
            invoiceNumber: {
                startsWith: `INV${year}${month}`
            },
        },
        orderBy: {
            invoiceNumber: "desc", // Facture avec le plus grand numéro
        },
    });

    let nextNumber : number; // Par défaut, commence à 1 si aucune facture pour l'année

    if(!lastInvoice) {
        nextNumber = 1;
    } else {
        // Extraire le dernier numéro et l'incrémenter
        const lastSequence = parseInt(lastInvoice.invoiceNumber.slice(-6));
        nextNumber = lastSequence + 1;
    }

    // Example:     inv 2401000001
    const nextInvoiceNumber = `INV${year}${month}${nextNumber.toString().padStart(6, '0')}`;
    return nextInvoiceNumber;
}
