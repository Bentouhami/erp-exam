'use client'

import React, { useState} from "react";
import {Button} from "@/components/ui/button";
import {StepIndicator} from "./StepIndicator";
import {BaseUserForm, getUserSchema} from "./BaseUserForm";
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import axios from "axios";
import {API_DOMAIN} from "@/lib/utils/constants";
import {useRouter} from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


type CustomerFormData = {
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

interface MultiStepRegistrationFormProps {
    role: 'ADMIN' | 'ACCOUNTANT' | 'SUPER_ADMIN' | 'CUSTOMER';
}

export function MultiStepRegistrationForm({ role }: MultiStepRegistrationFormProps) {
    const router = useRouter();
    const [step, setStep] = useState(1);

    // Function to get default values based on the role
    const getDefaultValues = (role: 'ADMIN' | 'ACCOUNTANT' | 'SUPER_ADMIN' | 'CUSTOMER') => {
        const commonValues = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            mobile: '',
            companyName: '',
            vatNumber: '',
            companyNumber: '',
            exportNumber: '',
            paymentTermDays: 0,
        };

        if (role === 'CUSTOMER') {
            return commonValues;
        }

        return { ...commonValues, password: '' };
    };

    const form = useForm<CustomerFormData>({
        resolver: zodResolver(getUserSchema(role)),
        defaultValues: getDefaultValues(role),
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
            if (role === 'CUSTOMER') {
                data.password = data.password || '';
            }

            const response = await axios.post(`${API_DOMAIN}/users/register`, {...data, role});

            if (response.status === 201) {
                toast.success("User created successfully!");
                setTimeout(() => {
                    router.push("/auth");
                }, 3000);
                return;
            }

        } catch (error) {
            console.error("Error creating user:", error);

            if (axios.isAxiosError(error) && error.response) {
                const {status, data} = error.response;

                if (status === 409 && data.message === "User already exists!") {
                    toast.error("User already exists!", {autoClose: 3000});
                    setTimeout(() => {
                        router.push("/auth");
                    }, 3000);
                    return;

                }
                toast.error(data.message || `Failed to create ${role}`, {autoClose: 3000});
            } else {
                toast.error(`Failed to create ${role}!`, {autoClose: 3000});

            }
        }
    };


    const totalSteps = role === 'CUSTOMER' ? 3 : 2;

    return (
        <div className="space-y-8 w-full max-w-2xl px-4 mx-auto">

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-2xl px-4 mx-auto">
                    <StepIndicator currentStep={step} totalSteps={totalSteps}/>

                    {step === 1 && (
                        <BaseUserForm formData={form.getValues()} updateFormData={form.setValue} role={role}/>
                    )}

                    {step === 2 && role === 'CUSTOMER' && (
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="companyName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Company Name (optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Acme Inc." {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="vatNumber"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>VAT Number (optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="VAT123456789" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="companyNumber"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Company Number (optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="COMP123456" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="exportNumber"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Export Number (optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="EXP123456" {...field} />
                                        </FormControl>
                                        <FormMessage/>
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
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Payment Term (days)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field}
                                                   onChange={(e) => field.onChange(parseInt(e.target.value, 10))}/>
                                        </FormControl>
                                        <FormDescription>Number of days for payment term (0 for immediate
                                            payment)</FormDescription>
                                        <FormMessage/>
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
                        {(role === 'CUSTOMER' && step < totalSteps) ? (
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
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar theme="colored"/>
        </div>
    );
}

