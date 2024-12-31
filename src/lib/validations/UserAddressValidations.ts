// path : src/lib/validations/UserAddressValidations.ts

import {z} from "zod";
import {AddressSchema} from "@/lib/validations/AddressValidations";

export const UserAddressSchema = z.object({
    id: z.number(),
    addressId: z.number(),
    addressTypeId: z.number(),
    userId: z.string(),
    createdAt: z.date().default(new Date()),
    updatedAt: z.date().default(new Date()),
});

export const CustomerAddressSchema = z.object({
    id: z.number(),
    addressId: z.number(),
    addressTypeId: z.number(),
    userId: z.string(),
    createdAt: z.date().default(new Date()),
    updatedAt: z.date().default(new Date()),
});

export const UserAddressCreateSchema = z.object({
    id: z.number().optional(),
    addressId: z.number(),
    addressTypeId: z.number(),
    userId: z.string(),
    createdAt: z.date().default(new Date()),
    updatedAt: z.date().default(new Date()),
});

export const UserAddressUpdateSchema = z.object({
    id: z.number(),
    addressId: z.number().optional(),
    addressTypeId: z.number().optional(),
    userId: z.string().optional(),
    createdAt: z.date().default(new Date()).optional(),
    updatedAt: z.date().default(new Date()).optional(),
});