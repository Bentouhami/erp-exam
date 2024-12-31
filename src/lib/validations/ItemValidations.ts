import {z} from "zod";
import {InvoiceDetailsSchema} from "@/lib/validations/InvoiceDetailsValidations";
import {ItemTaxesSchema} from "@/lib/validations/ItemTaxesValidations";
import {StockMovementsSchema} from "@/lib/validations/StockMovementsValidations";

export const ItemSchema = z.object({
    id: z.number(),
    itemNumber: z.string().min(1, "Item number is required"),
    supplierReference: z.string(),
    barcode: z.string(),
    label: z.string().min(1, "Label is required"),
    description: z.string(),
    purchasePrice: z.number().min(1, "Purchase price is required"),
    retailPrice: z.number().min(1, "Retail price is required"),
    stockQuantity: z.number().min(1, "Stock quantity is required"),
    minQuantity: z.number().min(1, "Min quantity is required"),
    vatTypeId: z.number(),
    unitId: z.number(),
    classId: z.number(),
    itemTaxes: z.array(ItemTaxesSchema).nonempty("Item taxes are required"),
    stockMovements: z.array(StockMovementsSchema).nonempty("Stock movements are required"),
    invoiceDetails: z.array(InvoiceDetailsSchema).nonempty("Invoice details are required"),
});


export const ItemCreateSchema = z.object({
    id: z.number().optional(),
    itemNumber: z.string().min(1, "Item number is required"),
    supplierReference: z.string().optional(),
    barcode: z.string().optional(),
    label: z.string().min(1, "Label is required"),
    description: z.string().optional(),
    purchasePrice: z.number().min(1, "Purchase price is required"),
    retailPrice: z.number().min(1, "Retail price is required"),
    stockQuantity: z.number().min(1, "Stock quantity is required"),
    minQuantity: z.number().min(1, "Min quantity is required"),
    vatTypeId: z.number(),
    unitId: z.number().optional(),
    classId: z.number().optional(),
    itemTaxes: z.array(ItemTaxesSchema).nonempty("Item taxes are required"),
    stockMovements: z.array(StockMovementsSchema).nonempty("Stock movements are required"),
    invoiceDetails: z.array(InvoiceDetailsSchema).nonempty("Invoice details are required"),
});

export const ItemUpdateSchema = z.object({
    id: z.number(),
    itemNumber: z.string().min(1, "Item number is required").optional(),
    supplierReference: z.string().optional(),
    barcode: z.string().optional(),
    label: z.string().min(1, "Label is required").optional(),
    description: z.string().optional(),
    purchasePrice: z.number().min(1, "Purchase price is required").optional(),
    retailPrice: z.number().min(1, "Retail price is required").optional(),
    stockQuantity: z.number().min(1, "Stock quantity is required").optional(),
    minQuantity: z.number().min(1, "Min quantity is required").optional(),
    vatTypeId: z.number().optional(),
    unitId: z.number().optional(),
    classId: z.number().optional(),
    itemTaxes: z.array(ItemTaxesSchema).nonempty("Item taxes are required").optional(),
    stockMovements: z.array(StockMovementsSchema).nonempty("Stock movements are required").optional(),
    invoiceDetails: z.array(InvoiceDetailsSchema).nonempty("Invoice details are required").optional(),
});
