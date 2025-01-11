// path: src/components/item-form/ItemDetailsSection.tsx
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Control } from 'react-hook-form';
import {Input} from "@/components/ui/input";

interface ItemDetailsSectionProps {
    control: Control<any>;
}

export default function ItemDetailsSection({ control }: ItemDetailsSectionProps) {
    return (
        <>
            <FormField
                control={control}
                name="itemNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Item Number</FormLabel>
                        <FormControl>
                            <Input {...field} disabled={true} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
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
        </>
    );
}
