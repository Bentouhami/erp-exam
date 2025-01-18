'use client';

import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {StepIndicator} from "./StepIndicator";
import {BaseUserForm, getUserSchema} from "./BaseUserForm";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import axios from "axios";
import {API_DOMAIN} from "@/lib/utils/constants";
import {useRouter} from "next/navigation";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Switch} from "@/components/ui/switch";

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
    isEnterprise: boolean;
} & (
    | { password?: never } // No password for customers
    | { password: string } // Password required for staff roles
    );

interface MultiStepRegistrationFormProps {
    role: "ADMIN" | "ACCOUNTANT" | "SUPER_ADMIN" | "CUSTOMER";
}

export function MultiStepRegistrationForm({role}: MultiStepRegistrationFormProps) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<CustomerFormData>(() => getDefaultValues(role));
    const totalSteps = role === "CUSTOMER" ? 2 : 2;

    const form = useForm<CustomerFormData>({
        resolver: zodResolver(getUserSchema(role)),
        defaultValues: getDefaultValues(role),
    });

    const isEnterprise = form.watch("isEnterprise");

    // Watch for changes to isEnterprise and clear enterprise-specific fields if set to false
    React.useEffect(() => {
        if (!isEnterprise) {
            form.setValue("companyName", "");
            form.setValue("vatNumber", "");
            form.setValue("companyNumber", "");
            form.setValue("exportNumber", "");
        }
    }, [isEnterprise, form]);

    const handleNext = async (e: React.MouseEvent) => {
        e.preventDefault();
        const isValid = await form.trigger();
        if (isValid) {
            setFormData((prev) => ({
                ...prev,
                ...form.getValues(),
            }));
            setStep((prevStep) => prevStep + 1);
        }
    };

    const handlePrevious = () => {
        setStep((prevStep) => prevStep - 1);
    };

    const onSubmit = async () => {
        const payload = {
            ...formData,
            ...form.getValues(),
            role,
        };

        console.log("Submitting payload:", payload);

        try {
            const response = await axios.post(`${API_DOMAIN}/users/register`, payload);
            if (response.status === 201) {
                toast.success("User created successfully!");
                setTimeout(() => router.push("/dashboard/users"), 3000);
            }
        } catch (error) {
            console.error("Error creating user:", error);
            toast.error("Failed to create user. Please try again.");
        }
    };

    return (
        <div className="space-y-8 w-full max-w-2xl px-4 mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-2xl px-4 mx-auto">
                    <StepIndicator currentStep={step} totalSteps={totalSteps}/>

                    {step === 1 && (
                        <div className="space-y-4">
                            <BaseUserForm formData={form.getValues()} updateFormData={form.setValue} role={role}/>
                        </div>
                    )}

                    {step === 2 && role === "CUSTOMER" && (
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="isEnterprise"
                                render={({field}) => (
                                    <FormItem
                                        className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Enterprise Customer</FormLabel>
                                            <FormDescription>
                                                Toggle if this customer is an enterprise
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange}/>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="paymentTermDays"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Payment Term (days)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Number of days for payment term (0 for immediate payment)
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {isEnterprise && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="companyName"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Company Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Acme Inc." {...field} />
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
                                                <FormLabel>Company Number</FormLabel>
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
                                                <FormLabel>Export Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="EXP123456" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}

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
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar theme="colored"/>
        </div>
    );
}

function getDefaultValues(role: "ADMIN" | "ACCOUNTANT" | "SUPER_ADMIN" | "CUSTOMER") {
    return {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        mobile: "",
        isEnterprise: false,
        companyName: "",
        vatNumber: "",
        companyNumber: "",
        exportNumber: "",
        paymentTermDays: 0,
        ...(role !== "CUSTOMER" && {password: ""}),
    };
}
