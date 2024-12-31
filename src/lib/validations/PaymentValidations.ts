import {z} from "zod";

export const PaymentsSchema = z.object({
    id: z.number().optional(),
    invoiceId: z.number().optional(),
    paymentDate: z.date().default(new Date()),
    amount: z.number().min(1, "Amount is required"),
    paymentModeId: z.number().optional(),
    customerId: z.number().optional(),

})