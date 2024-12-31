// path : src/lib/validations/UtaxSchemaValidations.ts
import {z} from "zod";
import {ItemTaxesSchema} from "@/lib/validations/ItemTaxesValidations";
import {InvoiceDetailsSchema} from "@/lib/validations/InvoiceDetailsValidations";
import {StockMovementsSchema} from "@/lib/validations/StockMovementsValidations";

export const UtaxSchema = z.object({
    id: z.number(),
    label: z.string().min(1, "Label is required"),
    utaxTypeId: z.number(),
    itemTaxes: z.array(ItemTaxesSchema).nonempty("Item taxes are required"),
    stockMovements: z.array(StockMovementsSchema).nonempty("Stock movements are required"),
    invoiceDetails: z.array(InvoiceDetailsSchema).nonempty("Invoice details are required"),
});


export const UtaxCreateSchema = z.object({
    id: z.number().optional(),
    label: z.string().min(1, "Label is required"),
    utaxTypeId: z.number(),
    itemTaxes: z.array(ItemTaxesSchema).nonempty("Item taxes are required"),
    stockMovements: z.array(StockMovementsSchema).nonempty("Stock movements are required"),
    invoiceDetails: z.array(InvoiceDetailsSchema).nonempty("Invoice details are required"),
});

export const UtaxUpdateSchema = z.object({
    id: z.number(),
    label: z.string().min(1, "Label is required").optional(),
    utaxTypeId: z.number().optional(),
    itemTaxes: z.array(ItemTaxesSchema).nonempty("Item taxes are required").optional(),
    stockMovements: z.array(StockMovementsSchema).nonempty("Stock movements are required").optional(),
    invoiceDetails: z.array(InvoiceDetailsSchema).nonempty("Invoice details are required").optional(),
});