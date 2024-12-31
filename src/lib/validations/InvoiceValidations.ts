import {z} from "zod";
import {InvoiceDetailsSchema, PaymentsSchema} from "@/lib/validations";

export const InvoiceCreateSchema = z.object({
    id: z.number().optional(),
    userId: z.number().optional(),
    invoiceNumber: z.string().min(1, "Invoice number is required"),
    issuedAt: z.date().default(new Date()),
    dueDate: z.date(),
    flag_accounting: z.boolean().default(false),
    totalAmount: z.number().min(1, "Total amount is required"),
    totalVatAmount: z.number(),
    totalTtcAmount: z.number(),
    invoiceDetails: z.array(InvoiceDetailsSchema).nonempty("Invoice details are required"),
    payments: z.array(PaymentsSchema).nonempty("Payments are required"),

})
