import {z} from "zod";

export const ItemTaxesSchema = z.object({
    id: z.number().optional(),
    itemId : z.number().optional(),
    utaxId : z.number().optional(),
    price: z.number().min(1, "Price is required"),


})