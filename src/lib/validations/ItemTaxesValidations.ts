import {z} from "zod";
import {ItemSchema} from "@/lib/validations/ItemValidations";
import {UtaxSchema} from "@/lib/validations/UtaxSchemaValidations";

export const ItemTaxesSchema = z.object({
    id: z.number(),
    itemId: z.number(),
    utaxId: z.number(),
    price: z.number().min(1, "Price is required"),

});

export const ItemTaxesCreateSchema = z.object({
    id: z.number().optional(),
    itemId: z.number(),
    utaxId: z.number(),
    price: z.number().min(1, "Price is required"),

});

export const ItemTaxesUpdateSchema = z.object({
    id: z.number(),
    itemId: z.number().optional(),
    utaxId: z.number().optional(),
    price: z.number().min(1, "Price is required").optional(),

});