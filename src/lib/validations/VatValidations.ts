// path : src/lib/validations/VatValidations.ts

import {z} from "zod";

export const VatCreateSchema = z.object({
    id: z.number().optional(),
    vatTypeId: z.number().optional(),
    countryId: z.number().optional(),
    vatPercent: z.number().min(1, "VAT percent is required"),
});

export const VatUpdateSchema = z.object({
    id: z.number(),
    vatTypeId: z.number().optional(),
    countryId: z.number().optional(),
    vatPercent: z.number().min(1, "VAT percent is required"),
});

