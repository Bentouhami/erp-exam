// path : src/lib/validations/PaymentModeValidations.ts

// PaymentModeSchema
import {z} from "zod";
import {PaymentsSchema} from "@/lib/validations/PaymentValidations";

export const PaymentModeSchema = z.object({
    id: z.number(),
    name: z.string().min(1, "Name is required"),
    payments: z.array(PaymentsSchema).nonempty("Payments are required"),
});

export const PaymentModeCreateSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Name is required"),
    payments: z.array(PaymentsSchema).nonempty("Payments are required"),
});

export const PaymentModeUpdateSchema = z.object({
    id: z.number(),
    name: z.string().min(1, "Name is required").optional(),
    payments: z.array(PaymentsSchema).nonempty("Payments are required").optional(),
});