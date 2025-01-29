// src/components/users/BaseUserForm.tsx
"use client";

import React from "react";
import { useFormContext, UseFormSetValue } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

// Import the type from userSchemas
import { CustomerFormData } from "@/lib/userSchemas";

type BaseUserFormProps = {
    formData: CustomerFormData; // not strictly needed, but if you want to pass it
    updateFormData: UseFormSetValue<CustomerFormData>;
    role: "ADMIN" | "ACCOUNTANT" | "SUPER_ADMIN" | "CUSTOMER";
};

export const BaseUserForm: React.FC<BaseUserFormProps> = ({ role }) => {
    const { control } = useFormContext<CustomerFormData>();
    const isCustomer = role === "CUSTOMER";

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

            {/* Staff roles only => password */}
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
                        <FormLabel>Phone Number</FormLabel>
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
