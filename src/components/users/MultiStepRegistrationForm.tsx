'use client'

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "./StepIndicator";
import { BaseUserForm, BaseUserFormData, baseUserSchema } from "./BaseUserForm";
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const customerSchema = baseUserSchema.extend({
    companyName: z.string().optional(),
    vatNumber: z.string().optional(),
    companyNumber: z.string().optional(),
    exportNumber: z.string().optional(),
    paymentTermDays: z.number().int().nonnegative().default(0),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface MultiStepRegistrationFormProps {
    role: 'ADMIN' | 'ACCOUNTANT' | 'SUPER_ADMIN' | 'CUSTOMER';
}

export function MultiStepRegistrationForm({ role }: MultiStepRegistrationFormProps) {
    const [step, setStep] = useState(1);
    const form = useForm<CustomerFormData>({
        resolver: zodResolver(customerSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            phone: '',
            mobile: '',
            companyName: '',
            vatNumber: '',
            companyNumber: '',
            exportNumber: '',
            paymentTermDays: 0,
        },
    });

    const handleNext = () => {
        form.trigger().then((isValid) => {
            if (isValid) {
                setStep((prevStep) => prevStep + 1);
            }
        });
    };

    const handlePrevious = () => {
        setStep((prevStep) => prevStep - 1);
    };

    const onSubmit = async (data: CustomerFormData) => {
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...data, role }),
            });

            if (!response.ok) {
                throw new Error('Failed to create user');
            }

            toast.success(`${role} created successfully`);
        } catch (error) {
            console.error('Error creating user:', error);
            toast.error(`Failed to create ${role}`);
        }
    };

    const totalSteps = role === 'CUSTOMER' ? 3 : 2;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-2xl px-4 mx-auto">
                <StepIndicator currentStep={step} totalSteps={totalSteps} />

                {step === 1 && (
                    <BaseUserForm formData={form.getValues()} updateFormData={form.setValue} />
                )}

                {step === 2 && role === 'CUSTOMER' && (
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Name (optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Acme Inc." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="vatNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>VAT Number (optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="VAT123456789" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="companyNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Number (optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="COMP123456" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="exportNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Export Number (optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="EXP123456" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                )}

                {step === 3 && role === 'CUSTOMER' && (
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="paymentTermDays"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payment Term (days)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} />
                                    </FormControl>
                                    <FormDescription>Number of days for payment term (0 for immediate payment)</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                )}

                <div className="flex justify-between">
                    {step > 1 && (
                        <Button type="button" onClick={handlePrevious}>
                            Previous
                        </Button>
                    )}
                    {step < totalSteps ? (
                        <Button type="button" onClick={handleNext} className="ml-auto">
                            Next
                        </Button>
                    ) : (
                        <Button type="submit" className="ml-auto">
                            Create {role}
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    );
}

