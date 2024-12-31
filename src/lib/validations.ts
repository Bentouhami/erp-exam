// path : src/lib/validations.ts
import {z} from "zod";

export const StockMovementsSchema = z.object({
    id: z.number().optional(),
    itemId : z.number().optional(),
    customerId : z.number().optional(),
    date : z.date().default(new Date()),
    quantity : z.number().min(1, "Quantity is required"),
    movementType : z.string().min(1, "Movement type is required"),
    description : z.string().optional(),
});



export const UserCreateSchema = z.object({
    id: z.number().optional(),
});
