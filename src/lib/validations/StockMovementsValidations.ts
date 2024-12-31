import {z} from "zod";


export const StockMovementsSchema = z.object({
    id: z.number(),
    itemId : z.number(),
    userId: z.string(),
    date : z.date().default(new Date()),
    quantity : z.number().min(1, "Quantity is required"),
    movementType : z.string().min(1, "Movement type is required"),
    description : z.string(),
});

export const StockMovementsCreateSchema = z.object({
    id: z.number().optional(),
    itemId : z.number(),
    userId: z.string(),
    date : z.date().default(new Date()),
    quantity : z.number().min(1, "Quantity is required"),
    movementType : z.string().min(1, "Movement type is required"),
    description : z.string(),
});

export const StockMovementsUpdateSchema = z.object({
    id: z.number().optional(),
    itemId : z.number().optional(),
    userId: z.string().optional(),
    date : z.date().default(new Date()).optional(),
    quantity : z.number().min(1, "Quantity is required").optional(),
    movementType : z.string().min(1, "Movement type is required").optional(),
    description : z.string().optional(),
});