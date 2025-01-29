// src/lib/schemas/userSchemas.ts
import * as z from "zod";

// ----- Base fields -----
const baseFields = {
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    mobile: z.string().optional(),
};


// ----- Enterprise fields (conditionally required) -----
const enterpriseFields = {
    isEnterprise: z.boolean().default(false),
    // Remove any .min(1,...)
    companyName: z.string().optional(),
    companyNumber: z.string().optional(),
    exportNumber: z.string().optional(),
    paymentTermDays: z.number().nonnegative("Payment term must be a positive number").optional(),
    vatNumber: z.string().optional(),
};

// ----- Address fields (always required) -----
const addressFields = {
    countryId: z.string().min(1, "Country is required"),
    cityId: z.string().min(1, "City is required"),
    street: z.string().min(1, "Street is required"),
    streetNumber: z.string().min(1, "Street number is required"),
    complement: z.string().optional(),
    boxNumber: z.string().optional(),
    addressType: z.string().min(1, "Address type is required"),
};

// ----- Staff fields -----
const staffFields = {
    password: z.string().min(8, "Password must be at least 8 characters"),
};


// ----- Customer schema = base + enterprise + address -----
const customerSchema = z
    .object({
        ...baseFields,
        ...enterpriseFields,
        ...addressFields,
    })
    .refine(
        (data) => {
            // If not enterprise => skip
            if (!data.isEnterprise) return true;
            // If enterprise => require these two fields be non-empty
            return Boolean(data.companyName && data.companyNumber);
        },
        {
            message: "Company name & number are required when enterprise is true",
            path: ["companyName"], // or use superRefine to set multiple error paths
        },
    );

// ----- Staff schema = base + staff + address -----
const staffSchema = z.object({
    ...baseFields,
    ...staffFields,
    ...addressFields,
});

// Picks the correct schema based on role
export function getUserSchema(
    role: "ADMIN" | "ACCOUNTANT" | "SUPER_ADMIN" | "CUSTOMER",
) {
    return role === "CUSTOMER" ? customerSchema : staffSchema;
}

// A single type that covers both schemas
export type CustomerFormData = z.infer<typeof customerSchema> & {
    password?: string; // staff needs password, customer does not
};
