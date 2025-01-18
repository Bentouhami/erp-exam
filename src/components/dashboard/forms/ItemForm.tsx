// path src/components/dashboard/forms/ItemForm.tsx

'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import UnitsDropDown from '@/components/UnitsDropDown';
import ItemClassDropDown from '@/components/ItemClassDropDown';
import ItemTaxMultiSelect from '@/components/ItemTaxMultiSelect';
import { toast } from 'react-toastify';
import ItemDetailsSection from "@/components/item-form/ItemDetailsSection";
import PricingSection from "@/components/item-form/PricingSection";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {API_DOMAIN} from "@/lib/utils/constants";
import QuantitySection from "@/components/item-form/QuantitySection";

const itemSchema = z.object({
    itemNumber: z.string().min(1, 'Item number is required'),
    label: z.string().min(1, 'Label is required'),
    description: z.string().optional(),
    retailPrice: z.number().min(0, 'Retail price must be a positive number'),
    purchasePrice: z.number().min(0, 'Purchase price must be a positive number'),
    countryId: z.string().min(1, 'Country is required'),
    vatId: z.string().min(1, 'VAT is required'),
    unitId: z.string().min(1, 'Unit is required'),
    classId: z.string().min(1, 'Class is required'),
    stockQuantity: z.number().min(0, 'Stock quantity must be a non-negative number'),
    minQuantity: z.number().min(0, 'Minimum quantity must be a non-negative number'),
    itemTaxes: z.array(z.number()).optional(),
});
type ItemFormData = z.infer<typeof itemSchema>;

interface ItemFormProps {
    itemId?: number;
}

export default function ItemForm({ itemId }: ItemFormProps) {
    const router = useRouter();
    const [countries, setCountries] = useState<{ id: number; name: string; countryCode: string }[]>([]);
    const [vatOptions, setVatOptions] = useState<{ id: number; vatType: string; vatPercent: number }[]>([]);

    const form = useForm<ItemFormData>({
        resolver: zodResolver(itemSchema),
        defaultValues: {
            itemNumber: '',
            label: '',
            description: '',
            purchasePrice: 0,
            retailPrice: 0,
            countryId: '',
            vatId: '',
            unitId: '',
            classId: '',
            stockQuantity: 0,
            minQuantity: 0,
        },
    });

    useEffect(() => {
        fetchCountries();
        if (itemId) {
            fetchItem(itemId);
        } else {
            generateItemNumber();
        }
    }, [itemId]);

    // Add country change handler to fetch corresponding VATs
    const handleCountryChange = async (countryId: string) => {
        form.setValue('countryId', countryId);
        form.setValue('vatId', ''); // Reset VAT selection
        await fetchVatOptions(countryId);
    };

    const fetchCountries = async () => {
        try {
            const response = await fetch(`${API_DOMAIN}/countries`);
            if (!response.ok) throw new Error('Failed to fetch countries');
            const data = await response.json();
            setCountries(data.countries);
        } catch (error) {
            console.error('Error fetching countries:', error);
            toast.error('Failed to fetch countries');
        }
    };

    const fetchVatOptions = async (countryId: string) => {
        try {
            const response = await fetch(`${API_DOMAIN}/vats?countryId=${countryId}`);
            if (!response.ok) throw new Error('Failed to fetch VAT options');
            const { vatTypes } = await response.json();
            setVatOptions(vatTypes);
        } catch (error) {
            console.error('Error fetching VAT options:', error);
            toast.error('Failed to fetch VAT options');
            setVatOptions([]);
        }
    };




    const fetchItem = async (id: number) => {
        try {
            const response = await fetch(`${API_DOMAIN}/items/${id}`);
            if (!response.ok) throw new Error('Failed to fetch item');
            const itemData = await response.json();
            form.reset(itemData);
        } catch (error) {
            console.error('Error fetching item:', error);
            toast.error('Failed to fetch item');
        }
    };

    const generateItemNumber = async () => {
        try {
            const response = await fetch(`${API_DOMAIN}/items/generate-number`);
            if (!response.ok) throw new Error('Failed to generate item number');
            const itemNumber = await response.json();
            form.setValue('itemNumber', itemNumber.itemNumber);
        } catch (error) {
            console.error('Error generating item number:', error);
            toast.error('Failed to generate item number');
        }
    };

    const onSubmit = async (data: ItemFormData) => {
        try {

            console.log('JSON data:', JSON.stringify(data)); // Log the JSON data for debugging')

            const response = await fetch(`${API_DOMAIN}/items/${itemId || ''}`, {
                method: itemId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to save item');
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
                {/* Item Details Section */}
                <ItemDetailsSection control={form.control} />

                {/* Pricing Section */}
                <PricingSection control={form.control} />

                {/* Country Selection */}
                <FormField
                    control={form.control}
                    name="countryId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Country</FormLabel>
                            <Select onValueChange={(value) => handleCountryChange(value)} defaultValue={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Country" />
                                </SelectTrigger>
                                <SelectContent>
                                    {countries.map((country) => (
                                        <SelectItem key={country.id} value={country.id.toString()}>
                                            {country.name} ({country.countryCode})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* VAT Selection */}
                <FormField
                    control={form.control}
                    name="vatId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>VAT</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select VAT" />
                                </SelectTrigger>
                                <SelectContent>
                                    {vatOptions.map((vat) => (
                                        <SelectItem key={vat.id} value={vat.id.toString()}>
                                            {vat.vatType} ({vat.vatPercent}%)
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                {/* Unit Selection */}
                <FormField
                    control={form.control}
                    name="unitId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Units</FormLabel>
                            <UnitsDropDown selectedUnitId={field.value} onSelect={(unitId) => field.onChange(unitId)} />
                            <FormMessage />
                        </FormItem>
                    )}
                />


                {/* Item Class Selection */}
                <FormField
                    control={form.control}
                    name="classId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Item Class</FormLabel>
                            <ItemClassDropDown selectedClassId={field.value} onSelect={(classId) => field.onChange(classId)} />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Stock Quantity */}
                <QuantitySection control={form.control} />

                {/*/!* Min Quantity *!/*/}
                {/*<FormField*/}
                {/*    control={form.control}*/}
                {/*    name="minQuantity"*/}
                {/*    render={({ field }) => (*/}
                {/*        <FormItem>*/}
                {/*            <FormLabel>Minimum Quantity</FormLabel>*/}
                {/*            <FormControl>*/}
                {/*                <Input type="number" {...field} />*/}
                {/*            </FormControl>*/}
                {/*            <FormMessage />*/}
                {/*        </FormItem>*/}
                {/*    )}*/}
                {/*/>*/}

                {/* Additional Taxes */}
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
