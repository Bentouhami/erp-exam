

import {z} from "zod";

export const VatSchema = z.object({
    id: z.number().optional(),
    vatTypeId: z.number().optional(),
    countryId: z.number().optional(),
    vatPercent: z.number().min(1, "VAT percent is required"),
})