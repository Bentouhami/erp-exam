// path src/components/dashboard/forms/IsEnterpriseForm.tsx
// src/components/dashboard/forms/IsEnterpriseForm.tsx
"use client";

import React from "react";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Switch} from "@/components/ui/switch";
import {useFormContext} from "react-hook-form";

// Import the combined form type
import {CustomerFormData} from "@/lib/userSchemas";

const IsEnterpriseForm: React.FC = () => {
    const {control, watch} = useFormContext<CustomerFormData>();
    const isEnterprise = watch("isEnterprise");

    return (
        <div className="space-y-4">
            {/* isEnterprise Switch */}
            <FormField
                control={control}
                name="isEnterprise"
                render={({field}) => (
                    <FormItem className="flex flex-row items-center justify-between border p-4">
                        <div>
                            <FormLabel>Enterprise Customer</FormLabel>
                            <FormDescription>
                                Toggle if this customer is an enterprise
                            </FormDescription>
                        </div>
                        <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            {/* Payment term days */}
            <FormField
                control={control}
                name="paymentTermDays"
                render={({field, fieldState}) => (
                    <FormItem>
                        <FormLabel>Payment Term (days)</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                            />
                        </FormControl>
                        <FormDescription>Days for payment term (0 = immediate)</FormDescription>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            {isEnterprise && (
                <>
                    <FormField
                        control={control}
                        name="companyName"
                        render={({field, fieldState}) => (
                            <FormItem>
                                <FormLabel>Company Name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="companyNumber"
                        render={({field, fieldState}) => (
                            <FormItem>
                                <FormLabel>Company Number</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        className={fieldState.error ? "border-red-500" : ""}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="exportNumber"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Export Number</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </>
            )}
        </div>
    );
};

export default IsEnterpriseForm;
