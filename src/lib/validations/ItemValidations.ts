import {z} from "zod";
import {InvoiceDetailsSchema, ItemTaxesSchema, StockMovementsSchema} from "@/lib/validations";


export const ItemSchema = z.object({
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
    vatTypeId: z.number().optional(),
    unitId: z.number().optional(),
    classId: z.number().optional(),
    itemTaxes: z.array(ItemTaxesSchema).nonempty("Item taxes are required"),
    stockMovements: z.array(StockMovementsSchema).nonempty("Stock movements are required"),
    invoiceDetails: z.array(InvoiceDetailsSchema).nonempty("Invoice details are required"),
});
