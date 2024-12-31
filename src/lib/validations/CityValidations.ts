// path : src/lib/validations/CityValidations.ts

import {z} from "zod";
import {CountrySchema} from "@/lib/validations/CountryValidations";
import {AddressSchema} from "@/lib/validations/AddressValidations";

export const CitySchema = z.object({
    id: z.number(),
    cityCode: z.string().min(1, "City code is required"),
    name: z.string().min(1, "Name is required"),
    countryId: z.number(),
    addresses: z.array(AddressSchema).nonempty("Addresses are required"),
});

export const CityCreateSchema = z.object({
    id: z.number().optional(),
    cityCode: z.string().min(1, "City code is required"),
    name: z.string().min(1, "Name is required"),
    countryId: z.number(),
    addresses: z.array(AddressSchema).nonempty("Addresses are required"),
});

export const CityUpdateSchema = z.object({
    id: z.number(),
    cityCode: z.string().min(1, "City code is required").optional(),
    name: z.string().min(1, "Name is required").optional(),
    countryId: z.number().optional(),
    addresses: z.array(AddressSchema).nonempty("Addresses are required").optional(),
});