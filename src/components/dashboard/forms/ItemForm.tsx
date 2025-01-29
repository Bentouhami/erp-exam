import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import UnitsDropDown from '@/components/UnitsDropDown';
import ItemClassDropDown from '@/components/ItemClassDropDown';
import ItemTaxMultiSelect from '@/components/ItemTaxMultiSelect';
import { toast } from 'react-toastify';
import ItemDetailsSection from "@/components/item-form/ItemDetailsSection";
import PricingSection from "@/components/item-form/PricingSection";
import { API_DOMAIN } from "@/lib/utils/constants";
import QuantitySection from "@/components/item-form/QuantitySection";
import axios from 'axios';
import VatsDropDown from "@/components/dashboard/dropdowns/VatsDropDown";
import CountriesDropDown from "@/components/dashboard/dropdowns/CountriesDropDown";

const itemSchema = z.object({
    itemNumber: z.string(),
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
    const [loading, setLoading] = useState(true);

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

    const countryId = form.watch('countryId'); // Watch for changes to countryId


    useEffect(() => {
        const fetchData = async () => {
            if (itemId) {
                await fetchItem(itemId);
            } else {
                await generateItemNumber();
            }
            setLoading(false);
        };

        fetchData();
    }, [itemId]);

    const handleCountryChange = async (countryId: string) => {
        form.setValue('countryId', countryId);
        form.setValue('vatId', '');
    };

    const fetchItem = async (id: number) => {
        try {
            const response = await fetch(`${API_DOMAIN}/items/${id}`);
            if (!response.ok) throw new Error('Failed to fetch item');
            const itemData = await response.json();
            form.reset({
                ...itemData,
                vatId: itemData.vat?.id?.toString() || '',
                unitId: itemData.unit?.id?.toString() || '',
                classId: itemData.itemClass?.id?.toString() || '',
                purchasePrice: parseInt(itemData.purchasePrice) || 0,
                retailPrice: parseInt(itemData.retailPrice) || 0,
                stockQuantity: parseInt(itemData.stockQuantity) || 0,
                minQuantity: parseInt(itemData.minQuantity) || 0,
                countryId: itemData.country?.id?.toString() || '',
            });
        } catch (error) {
            console.error('Error fetching item:', error);
            toast.error('Failed to fetch item');
        }
    };

    const generateItemNumber = async () => {
        try {
            const response = await axios.get(`${API_DOMAIN}/items/generate-number`, {
                headers: {
                    "Cache-Control": "no-cache",
                    Pragma: "no-cache",
                    Expires: "0",
                },
            });
            if (!response.data.itemNumber) {
                throw new Error('Failed to generate item number');
            }
            console.log(`Generated item number: ${response.data.itemNumber}`);
            form.setValue('itemNumber', response.data.itemNumber);
        } catch (error) {
            console.error('Error generating item number:', error);
            toast.error('Failed to generate item number');
        }
    };

    const onSubmit = async (data: ItemFormData) => {
        console.log('Form submitted with data:', data); // Debugging line
        const isValid = await form.trigger(); // Manually trigger validation
        if (!isValid) {
            console.log('Form validation errors:', form.formState.errors); // Debugging line
            return;
        }
        try {
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



    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(
                    onSubmit,
                    (errors) => console.error("Validation errors:", errors) // Debug validation errors
                )}
                className="space-y-8"
            >
                <div>
                    <ItemDetailsSection control={form.control} showItemNumber={!itemId} />
                    <PricingSection control={form.control} />

                    {/* COUNTRIES SECTION */}
                    <FormField
                        control={form.control}
                        name="countryId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Country</FormLabel>
                                <CountriesDropDown
                                    selectedCountryId={field.value}
                                    onSelect={(countryId) => {
                                        field.onChange(countryId); // Set the selected country in the form
                                        form.setValue('vatId', ''); // Reset the VAT when the country changes
                                    }}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* VATS SECTION */}
                    <FormField
                        control={form.control}
                        name="vatId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>VAT</FormLabel>
                                <VatsDropDown
                                    selectedVatId={field.value}
                                    countryId={form.getValues('countryId')}
                                    onSelect={field.onChange}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* UNITS SECTION */}
                    <FormField
                        control={form.control}
                        name="unitId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Units</FormLabel>
                                <UnitsDropDown selectedUnitId={field.value}
                                               onSelect={(unitId) => field.onChange(unitId)} />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ITEM CLASS SECTION */}
                    <FormField
                        control={form.control}
                        name="classId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Item Class</FormLabel>
                                <ItemClassDropDown selectedClassId={field.value}
                                                   onSelect={(classId) => field.onChange(classId)} />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* QUANTITY SECTION */}
                    <QuantitySection control={form.control} />

                    {/* TAXES SECTION */}
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
                </div>
                <Button
                    type="submit"
                    onClick={() => console.log("Save Item button clicked")} // Debug button click
                >
                    Save Item
                </Button>
            </form>
        </Form>
    );
}