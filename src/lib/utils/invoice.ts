// path: src/lib/utils/invoice.ts

import prisma from "@/lib/db";
export async function generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();

    // Rechercher la dernière facture émise pour l'année en cours
    const lastInvoice = await prisma.invoice.findFirst({
        where: {
            invoiceNumber: {
                startsWith: `${year}-`, // Factures commençant par l'année en cours
            },
        },
        orderBy: {
            invoiceNumber: "desc", // Facture avec le plus grand numéro
        },
    });

    let nextNumber = 1; // Par défaut, commence à 1 si aucune facture pour l'année

    if (lastInvoice) {
        // Extraire le dernier numéro et l'incrémenter
        const lastNumberPart = parseInt(lastInvoice.invoiceNumber.split("-").pop() || "0", 10);
        nextNumber = lastNumberPart + 1;
    }

    // Construire le numéro de facture au format "YYYY-XXXX"
    const nextInvoiceNumber = `${year}-${nextNumber.toString().padStart(4, "0")}`;

    return nextInvoiceNumber;
}
