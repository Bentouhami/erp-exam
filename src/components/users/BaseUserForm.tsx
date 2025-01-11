// path: src/components/users/BaseUserForm.tsx

'use client'

import React from 'react';
import * as z from 'zod';
import { Input } from "@/components/ui/input";
import {  FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFormContext, UseFormSetValue } from 'react-hook-form';

// Create a base schema without a password
export const baseFields = {
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    mobile: z.string().optional(),
};

// Create separate schemas for different roles
export const customerSchema = z.object({
    ...baseFields,
});

export const staffSchema = z.object({
    ...baseFields,
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Function to get the appropriate schema based on a role
export const getUserSchema = (role: 'ADMIN' | 'ACCOUNTANT' | 'SUPER_ADMIN' | 'CUSTOMER') => {
    return role === 'CUSTOMER' ? customerSchema : staffSchema;
};

// Export the CustomerFormData type
export type CustomerFormData = {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    mobile?: string;
    companyName?: string;
    vatNumber?: string;
    companyNumber?: string;
    exportNumber?: string;
    paymentTermDays: number;
} & (
    | { password?: never } // No password for customers
    | { password: string }  // Password required for staff roles
    );

type BaseUserFormProps = {
    formData: CustomerFormData;
    updateFormData: UseFormSetValue<CustomerFormData>;
    role: 'ADMIN' | 'ACCOUNTANT' | 'SUPER_ADMIN' | 'CUSTOMER';
};

export const BaseUserForm: React.FC<BaseUserFormProps> = ({  role }) => {
    const { control } = useFormContext<CustomerFormData>();
    const isCustomer = role === 'CUSTOMER';

    return (
        <div className="space-y-4">
            <FormField
                control={control}
                name="firstName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                            <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="lastName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input type="email" placeholder="john.doe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            {!isCustomer && (
                <FormField
                    control={control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="********" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}
            <FormField
                control={control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Phone (optional)</FormLabel>
                        <FormControl>
                            <Input placeholder="+1234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="mobile"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Mobile (optional)</FormLabel>
                        <FormControl>
                            <Input placeholder="+1234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};
