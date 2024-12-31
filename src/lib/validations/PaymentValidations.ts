// path : src/lib/validations/PaymentValidations.ts

import {z} from "zod";

// PaymentSchema
export const PaymentsSchema = z.object({
    id: z.number(),
    invoiceId: z.number(),
    paymentDate: z.date().default(new Date()),
    amount: z.number().min(1, "Amount is required"),
    paymentModeId: z.number(),
    userId: z.string(),

});

export const PaymentsCreateSchema = z.object({
    id: z.number().optional(),
    invoiceId: z.number(),
    paymentDate: z.date().default(new Date()),
    amount: z.number().min(1, "Amount is required"),
    paymentModeId: z.number(),
    userId: z.string(),

});

export const PaymentsUpdateSchema = z.object({
    id: z.number(),
    invoiceId: z.number().optional(),
    paymentDate: z.date().default(new Date()).optional(),
    amount: z.number().min(1, "Amount is required").optional(),
    paymentModeId: z.number().optional(),
    userId: z.string().optional(),
});
