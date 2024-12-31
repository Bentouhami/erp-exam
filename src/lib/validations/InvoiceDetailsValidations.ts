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
    userId: z.string().optional(),

});

export const InvoiceDetailsCreateSchema = z.object({
    id: z.number().optional(),
    invoiceId: z.number(),
    itemId: z.number(),
    lineNumber: z.number(),
    quantity: z.number().min(1, "Quantity is required"),
    discount: z.number(),
    unitPrice: z.number().min(1, "Unit price is required"),
    vatBaseAmount: z.number().min(1, "VAT base amount is required"),
    vatAmount: z.number().min(1, "VAT amount is required"),
    totalPrice: z.number().min(1, "Total price is required"),
    userId: z.string(),

});

export const InvoiceDetailsUpdateSchema = z.object({
    id: z.number(),
    invoiceId: z.number().optional(),
    itemId: z.number().optional(),
    lineNumber: z.number().optional(),
    quantity: z.number().min(1, "Quantity is required").optional(),
    discount: z.number().optional(),
    unitPrice: z.number().min(1, "Unit price is required").optional(),
    vatBaseAmount: z.number().min(1, "VAT base amount is required").optional(),
    vatAmount: z.number().min(1, "VAT amount is required").optional(),
    totalPrice: z.number().min(1, "Total price is required").optional(),
    userId: z.string().optional(),

});