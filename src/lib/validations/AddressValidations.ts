// path : src/lib/validations/AddressValidations.ts

import {z} from "zod";
import {CitySchema} from "@/lib/validations/CityValidations";

export const AddressSchema = z.object({
    id: z.number(),
    street: z.string().min(1, "Street is required"),
    complement: z.string(),
    streetNumber: z.string(),
    boxNumber: z.string(),
    cityId: z.number(),
    userId: z.string(),
    createdAt: z.date().default(new Date()),
    updatedAt: z.date().default(new Date()),
});

export const AddressCreateSchema = z.object({
    id: z.number().optional(),
    street: z.string().min(1, "Street is required"),
    complement: z.string(),
    streetNumber: z.string(),
    boxNumber: z.string(),
    cityId: z.number(),
    userId: z.string(),
    createdAt: z.date().default(new Date()),
    updatedAt: z.date().default(new Date()),
});

export const AddressUpdateSchema = z.object({
    id: z.number(),
    street: z.string().min(1, "Street is required").optional(),
    complement: z.string().optional(),
    streetNumber: z.string().optional(),
    boxNumber: z.string().optional(),
    cityId: z.number().optional(),
    userId: z.string().optional(),
    createdAt: z.date().default(new Date()).optional(),
    updatedAt: z.date().default(new Date()).optional(),
});