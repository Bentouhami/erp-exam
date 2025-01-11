// path: src/components/item-form/PricingSection.tsx

import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';

interface PricingSectionProps {
    control: Control<any>;
}

export default function PricingSection({ control }: PricingSectionProps) {
    return (
        <>
            <FormField
                control={control}
                name="purchasePrice"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Purchase Price</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                step="0.01"
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
                name="retailPrice"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Retail Price</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                step="0.01"
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
