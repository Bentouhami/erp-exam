// path: src/components/item-form/QuantitySection.tsx

import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';

interface QuantitySectionProps {
    control: Control<any>;
}

export default function QuantitySection({ control }: QuantitySectionProps) {
    return (
        <>
            <FormField
                control={control}
                name="stockQuantity"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Stock Quantity</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                step="1"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="minQuantity"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Minimum Quantity</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                step="1"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
}
