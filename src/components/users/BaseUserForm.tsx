'use client'

import React from 'react';
import * as z from 'zod';
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFormContext, UseFormSetValue } from 'react-hook-form';

export const baseUserSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    phone: z.string().optional(),
    mobile: z.string().optional(),
});

export type BaseUserFormData = z.infer<typeof baseUserSchema>;

type CustomerFormData = BaseUserFormData & {
    companyName?: string;
    vatNumber?: string;
    companyNumber?: string;
    exportNumber?: string;
    paymentTermDays: number;
};

interface BaseUserFormProps {
    formData: BaseUserFormData;
    updateFormData: UseFormSetValue<CustomerFormData>;
}

export const BaseUserForm: React.FC<BaseUserFormProps> = ({ formData, updateFormData }) => {
    const { control } = useFormContext<CustomerFormData>();

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

