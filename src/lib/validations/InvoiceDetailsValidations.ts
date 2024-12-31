import {z} from "zod";

export const InvoiceDetailsSchema = z.object({
    id: z.number().optional(),
    invoiceId: z.number().optional(),
    itemId: z.number().optional(),
    lineNumber: z.number().optional(),
    quantity: z.number().min(1, "Quantity is required"),
    discount: z.number().optional(),
    unitPrice: z.number().min(1, "Unit price is required"),
    vatBaseAmount: z.number().min(1, "VAT base amount is required"),
    vatAmount: z.number().min(1, "VAT amount is required"),
    totalPrice: z.number().min(1, "Total price is required"),
    customerId: z.number().optional(),

});