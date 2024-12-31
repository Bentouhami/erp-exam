// path : src/lib/validations/AddressTypeValidations.ts
import {z} from "zod";
import {CustomerAddressSchema} from "@/lib/validations/UserAddressValidations";

export const AddressTypeSchema = z.object({
    id: z.number(),
    name: z.string().min(1, "Name is required"),
    customerAddresses: z.array(CustomerAddressSchema).nonempty("Customer addresses are required"),
});

export const AddressTypeCreateSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Name is required"),
    customerAddresses: z.array(CustomerAddressSchema).nonempty("Customer addresses are required"),
});

export const AddressTypeUpdateSchema = z.object({
    id: z.number(),
    name: z.string().min(1, "Name is required").optional(),
    customerAddresses: z.array(CustomerAddressSchema).nonempty("Customer addresses are required").optional(),
});