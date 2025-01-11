// path: src/components/ItemForm.tsx
'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {Form, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import ItemDetailsSection from '@/components/item-form/ItemDetailsSection';
import PricingSection from '@/components/item-form/PricingSection';
import UnitsDropDown from '@/components/UnitsDropDown';
import {toast} from "react-toastify";
import ItemTaxMultiSelect from "@/components/ItemTaxMultiSelect";
import ItemClassDropDown from "@/components/ItemClassDropDown";

const itemSchema = z.object({
    itemNumber: z.string().min(1, 'Item number is required'),
    label: z.string().min(1, 'Label is required'),
    description: z.string().optional(),
    retailPrice: z.number().min(0, 'Retail price must be a positive number'),
    purchasePrice: z.number().min(0, 'Purchase price must be a positive number'),
    vatType: z.enum(['REDUCED', 'STANDARD', 'EXEMPT']),
    unitId: z.string().min(1, 'Unit is required'),
    classId: z.string().min(1, 'Class is required'), // Add classId as string
    itemTaxes: z.array(z.number()).optional(), // Add itemTaxes as an optional array of numbers
});


type ItemFormData = z.infer<typeof itemSchema>;

interface ItemFormProps {
    itemId?: number;
}

export default function ItemForm({ itemId }: ItemFormProps) {
    const router = useRouter();

    const form = useForm<ItemFormData>({
        resolver: zodResolver(itemSchema),
        defaultValues: {
            itemNumber: '',
            label: '',
            description: '',
            purchasePrice: 0,
            retailPrice: 0,
            vatType: 'STANDARD',
            unitId: '',
        },
    });

    useEffect(() => {
        if (itemId) {
            fetchItem(itemId);
        } else {
            fetch('/api/v1/items/generate-number')
                .then(async (response) => {
                    if (!response.ok) {
                        throw new Error('Failed to generate item number');
                    }
                    const itemNumber = await response.json();
                    form.setValue('itemNumber', itemNumber.itemNumber);
                })
                .catch((error) => {
                    console.error('Error generating item number:', error);
                    toast.error('Failed to generate item number');
                });
        }
    }, [itemId]);

    const fetchItem = async (id: number) => {
        if (!id) toast.error('ItemId not found');
        try {
            const response = await fetch(`/api/v1/items/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch item');
            }
            const itemData = await response.json();
            form.reset(itemData);
        } catch (error) {
            console.error('Error fetching item:', error);
            toast.error('Failed to fetch item');
        }
    };

    const onSubmit = async (data: ItemFormData) => {
        const payload = {
            ...data,
            unitId: parseInt(data.unitId, 10),
            classId: parseInt(data.classId, 10),
            itemTaxes: data.itemTaxes || [],
        };

        try {
            const response = await fetch(`/api/v1/items/${itemId || ''}`, {
                method: itemId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to save item');
            }

            toast.success(`Item ${itemId ? 'updated' : 'created'} successfully`);
            router.push('/dashboard/items');
        } catch (error) {
            console.error('Error saving item:', error);
            toast.error('Failed to save item');
        }
    };



    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <ItemDetailsSection control={form.control} />
                <PricingSection control={form.control} />
                <FormField
                    control={form.control}
                    name="unitId"
                    render={({ field }) => (
                        <UnitsDropDown
                            selectedUnitId={field.value}
                            onSubmit={(unitId) => field.onChange(unitId)}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="classId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Item Class</FormLabel>
                            <ItemClassDropDown
                                selectedClassId={field.value}
                                onSelect={(classId) => field.onChange(classId)}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="itemTaxes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Additional Taxes</FormLabel>
                            <ItemTaxMultiSelect
                                selectedTaxIds={field.value || []}
                                onChange={(selectedIds) => field.onChange(selectedIds)}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Save Item</Button>
            </form>
        </Form>
    );
}
