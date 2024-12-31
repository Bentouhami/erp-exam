// path : src/lib/validations/CountryValidations.ts

import {z} from "zod";
import {CitySchema} from "@/lib/validations/CityValidations";

export const CountrySchema = z.object({
    id: z.number(),
    countryCode: z.string().min(1, "Country code is required"),
    name: z.string().min(1, "Name is required"),
    cities: z.array(CitySchema).nonempty("Cities are required"),
});

export const CountryCreateSchema = z.object({
    id: z.number().optional(),
    countryCode: z.string().min(1, "Country code is required"),
    name: z.string().min(1, "Name is required"),
    cities: z.array(CitySchema).nonempty("Cities are required"),
});

export const CountryUpdateSchema = z.object({
    id: z.number(),
    countryCode: z.string().min(1, "Country code is required").optional(),
    name: z.string().min(1, "Name is required").optional(),
    cities: z.array(CitySchema).nonempty("Cities are required").optional(),
});