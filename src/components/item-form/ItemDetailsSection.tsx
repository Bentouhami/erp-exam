import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from "@/components/ui/input";
import { Control } from 'react-hook-form';

interface ItemDetailsSectionProps {
    control: Control<any>;
    showItemNumber: boolean;
}

export default function ItemDetailsSection({ control, showItemNumber }: ItemDetailsSectionProps) {
    console.log('Item Number:', control._formValues.itemNumber); // Debugging log
    console.log('Supplier Reference:', control._formValues.supplierReference); // Debugging log


    return (
        <div className="space-y-4">
            {showItemNumber && (
                <FormField
                    control={control}
                    name="itemNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Item Number</FormLabel>
                            <FormControl>
                                <Input disabled {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            {showItemNumber && (
                <FormField
                    control={control}
                    name="supplierReference"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Supplier Reference</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>


                    )}
                />
            )}

            <FormField
                control={control}
                name="label"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Label</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}