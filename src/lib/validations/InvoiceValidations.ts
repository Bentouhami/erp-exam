import {z} from "zod";
import {InvoiceDetailsSchema} from "@/lib/validations/InvoiceDetailsValidations";
import {PaymentsSchema} from "@/lib/validations/PaymentValidations";

export const InvoiceSchema = z.object({
    id: z.number(),
    userId: z.string(),
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


export const InvoiceCreateSchema = z.object({
    id: z.number().optional(),
    userId: z.string().optional(),
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

export const InvoiceUpdateSchema = z.object({
    id: z.number(),
    userId: z.string().optional(),
    invoiceNumber: z.string().min(1, "Invoice number is required").optional(),
    issuedAt: z.date().default(new Date()).optional(),
    dueDate: z.date().optional(),
    flag_accounting: z.boolean().default(false).optional(),
    totalAmount: z.number().min(1, "Total amount is required").optional(),
    totalVatAmount: z.number().optional(),
    totalTtcAmount: z.number().optional(),
    invoiceDetails: z.array(InvoiceDetailsSchema).nonempty("Invoice details are required").optional(),
    payments: z.array(PaymentsSchema).nonempty("Payments are required").optional(),

})
