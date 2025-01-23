'use client'
import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {useFieldArray, useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {toast} from 'react-toastify'
import axios from "axios";
import {API_DOMAIN, DOMAIN} from "@/lib/utils/constants";
import CustomerSelect from "@/components/customers/CustomerSelect";
import {Delete, Plus, Save} from "lucide-react";
import ItemSelect from "@/components/item-form/ItemSelect";
import { Card } from '@/components/ui/card'
import InvoiceTotals from "@/components/invoices/InvoiceTotals";

const invoiceSchema = z.object({
    invoiceNumber: z.string(),
    issuedAt: z.string(),
    dueDate: z.string(),
    userId: z.string(),
    items: z.array(z.object({
        itemId: z.string(),
        quantity: z.number().min(1),
        discount: z.number().min(0).max(100),
    })),
    totalAmount: z.number().min(0), // Renamed from totalHT
    totalVatAmount: z.number().min(0), // Renamed from totalVAT
    totalTtcAmount: z.number().min(0), // Renamed from totalTTC
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

type User = {
    id: string;
    firstName: string;
    lastName: string;
    userNumber: string;
    vatNumber: string;
    name: string;
    isEnterprise: boolean;
    paymentTermDays: number;
};

type Item = {
    id: number;
    itemNumber: string;
    supplierReference?: string;
    label: string;
    description: string;
    retailPrice: number;
    purchasePrice: number;
    stockQuantity: number;
    minQuantity: number;

    vat: {
        id: number;
        vatType: 'REDUCED' | 'STANDARD';
        vatPercent: number;
    };
    unit: {
        id: number;
        name: string;
    };
    itemClass: {
        id: number;
        label: string;
    };

};

interface InvoiceFormProps {
    invoiceId?: number;
}

export default function InvoiceForm({invoiceId}: InvoiceFormProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalHT, setTotalHT] = useState(0);
    const [totalVAT, setTotalVAT] = useState(0);
    const [totalTTC, setTotalTTC] = useState(0);
    const router = useRouter();

    const form = useForm<InvoiceFormData>({
        resolver: zodResolver(invoiceSchema),
        defaultValues: {
            invoiceNumber: '',
            issuedAt: new Date().toISOString().split('T')[0],
            dueDate: new Date().toISOString().split('T')[0],
            userId: '',
            items: [{itemId: '', quantity: 1, discount: 0}],
            totalAmount: 0,
            totalVatAmount: 0,
            totalTtcAmount: 0,
        }
    });

    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: "items",
    });

    useEffect(() => {
        fetchUsersAndItems();

    }, []);
    useEffect(() => {
        const fetchInvoiceOrGenerateNumber = async () => {
            if (invoiceId) {
                // Fetch an existing invoice
                try {
                    await fetchInvoice(invoiceId)
                } catch (error) {
                    console.error("Error fetching invoice:", error)
                    toast.error("Failed to fetch invoice")
                }
            } else {
                // Generate a new invoice number
                try {
                    const invoiceNumber = await axios.get(`${API_DOMAIN}/invoices/generate-number`)
                    if (!invoiceNumber) {
                        throw new Error("Failed to generate invoice number")
                    }
                    console.log(`Generated invoice number: ${invoiceNumber}`)
                    // Set the invoice number in the form
                    form.reset();
                    form.setValue("invoiceNumber", invoiceNumber.data.invoiceNumber)
                    // form.setValue("invoiceNumber", invoiceNumber)
                } catch (error) {
                    console.error("Error generating invoice number:", error)
                    toast.error("Failed to generate invoice number")
                }
            }
            setLoading(false)
        }

        fetchInvoiceOrGenerateNumber()
    }, [invoiceId, form])

    const fetchUsersAndItems = async () => {
        try {
            const [usersResponse, itemsResponse] = await Promise.all([
                fetch(`${API_DOMAIN}/users/customers`),
                fetch(`${API_DOMAIN}/items`),
            ]);

            if (!usersResponse.ok || !itemsResponse.ok) {
                throw new Error('Failed to fetch data');
            }

            const usersData = await usersResponse.json();
            const itemsData = await itemsResponse.json();

            setUsers(usersData);
            setItems(itemsData);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch users and items');
        } finally {
            setLoading(false);
        }
    };

    const fetchInvoice = async (id: number) => {
        if (!id) {
            toast.error('InvoiceId not found');
            return;
        }
        try {
            const response = await axios.get(`${API_DOMAIN}/invoices/${id}`);
            if (response.status !== 200 || !response.data) {
                throw new Error('Failed to fetch invoice');
            }
            const invoiceData = response.data;
            form.reset(invoiceData);
        } catch (error) {
            console.error('Error fetching invoice:', error);
            toast.error('Failed to fetch invoice');
        }
    };

    const generateInvoiceNumber = async () => {
        try {
            const response = await fetch(`${API_DOMAIN}/invoices/generate-number`);
            if (!response.ok) {
                throw new Error('Failed to generate invoice number');
            }
            const {invoiceNumber} = await response.json();
            form.setValue('invoiceNumber', invoiceNumber);
        } catch (error) {
            console.error('Error generating invoice number:', error);
            toast.error('Failed to generate invoice number');
        }
    };

    const calculateDueDate = (userId: string) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            const issuedAt = new Date(form.getValues('issuedAt'));
            const paymentTermDays = user.paymentTermDays || 0;
            const dueDate = new Date(issuedAt);
            dueDate.setDate(dueDate.getDate() + paymentTermDays);
            form.setValue('dueDate', dueDate.toISOString().split('T')[0]);
        }
    };

    const calculateTotals = () => {
        const selectedItems = form.getValues('items');
        let ht = 0;
        let vat = 0;

        selectedItems.forEach(item => {
            const selectedItem = items.find(i => i.id.toString() === item.itemId);
            if (selectedItem) {
                const lineTotalHT = selectedItem.retailPrice * item.quantity * (1 - item.discount / 100);
                const lineVAT = lineTotalHT * (selectedItem.vat.vatPercent / 100);
                ht += lineTotalHT;
                vat += lineVAT;
            }
        });

        setTotalHT(parseFloat(ht.toFixed(2)));
        setTotalVAT(parseFloat(vat.toFixed(2)));
        setTotalTTC(parseFloat((ht + vat).toFixed(2)));

        console.log('Calculated Totals:', { ht, vat, ttc: ht + vat });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EUR',
        }).format(amount);
    };

    const onSubmit = async (data: InvoiceFormData) => {
        calculateTotals(); // Ensure totals are calculated before submission

        const updatedData = {
            ...data,
            totalAmount: totalHT,
            totalVatAmount: totalVAT,
            totalTtcAmount: totalTTC,
        };

        console.log('Invoice data with totals:', updatedData);

        try {
            const response = await fetch(`${API_DOMAIN}/invoices`, {
                method: invoiceId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                throw new Error('Failed to save invoice');
            }

            toast.success(`Invoice ${invoiceId ? 'updated' : 'created'} successfully`);

            // Clear the form data after successful submission
            form.reset({
                invoiceNumber: '', // Or generate a new number if required
                issuedAt: new Date().toISOString().split('T')[0],
                dueDate: new Date().toISOString().split('T')[0],
                userId: '',
                items: [{ itemId: '', quantity: 1, discount: 0 }],
                totalAmount: 0,
                totalVatAmount: 0,
                totalTtcAmount: 0,
            });

            // Redirect to the invoice list
            router.push(`${DOMAIN}/dashboard/invoices`);
        } catch (error) {
            console.error('Error saving invoice:', error);
            toast.error('Failed to save invoice');
        }
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                 Invoice Number and Dates
                <FormField
                    control={form.control}
                    name="invoiceNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Invoice Number</FormLabel>
                            <FormControl>
                                <Input {...field} disabled />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="issuedAt"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Issue Date</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dueDate"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Due Date</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* Customer Selection */}
                <FormField
                    control={form.control}
                    name="userId"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Customer</FormLabel>
                            <CustomerSelect
                                customersList={users}
                                selectedUserId={field.value}
                                onSelect={(value) => {
                                    field.onChange(value);
                                    calculateDueDate(value);
                                }}
                            />
                            <FormMessage/>
                        </FormItem>
                    )}
                />


                {/* Items Section */}
                <div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Line #</TableHead>
                                <TableHead>Item</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Discount (%)</TableHead>
                                <TableHead>Unit Price</TableHead>
                                <TableHead>Total (HT)</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fields.map((field, index) => (
                                <TableRow key={field.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        <FormField
                                            control={form.control}
                                            name={`items.${index}.itemId`}
                                            render={({field}) => (
                                                <FormItem>
                                                    <ItemSelect
                                                        items={items}
                                                        selectedItemId={field.value}
                                                        onSelect={(itemId) => {
                                                            field.onChange(itemId);
                                                            const selectedItem = items.find((i) => i.id.toString() === itemId);
                                                            if (selectedItem) {
                                                                form.setValue(`items.${index}.quantity`, 1);
                                                                form.setValue(`items.${index}.discount`, 0);
                                                                calculateTotals();
                                                            }
                                                        }}
                                                    />
                                                </FormItem>
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <FormField
                                            control={form.control}
                                            name={`items.${index}.quantity`}
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            {...field}
                                                            onChange={(e) => {
                                                                field.onChange(parseInt(e.target.value));
                                                                calculateTotals();
                                                            }}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <FormField
                                            control={form.control}
                                            name={`items.${index}.discount`}
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            {...field}
                                                            onChange={(e) => {
                                                                field.onChange(parseFloat(e.target.value));
                                                                calculateTotals();
                                                            }}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </TableCell>

                                    <TableCell>
                                        {items.find(i => i.id.toString() === field.itemId)?.retailPrice || 0} €
                                    </TableCell>

                                    <TableCell>
                                        {(() => {
                                            const selectedItem = items.find(i => i.id.toString() === field.itemId);
                                            if (selectedItem) {
                                                const unitPrice = selectedItem.retailPrice;
                                                const discount = form.getValues(`items.${index}.discount`);
                                                const quantity = form.getValues(`items.${index}.quantity`);
                                                return (unitPrice * quantity * (1 - discount / 100)).toFixed(2);
                                            }
                                            return '0.00';
                                        })()} €
                                    </TableCell>

                                    <TableCell>
                                        <Button type="button" variant="destructive" onClick={() => remove(index)}>
                                            <Delete className="mr-2 h-4 w-4"/> Remove
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Button type="button" onClick={() => append({itemId: '', quantity: 1, discount: 0})}>
                        <Plus className="mr-2 h-4 w-4"/> Add Item
                    </Button>
                </div>

                {/* Totals Section */}
                <InvoiceTotals totalHT={ formatCurrency(totalHT) } totalVAT={ formatCurrency(totalVAT) } totalTTC={ formatCurrency(totalTTC) } />


                <Button type="submit">
                    <Save className="mr-2 h-4 w-4"/> Save Invoice
                </Button>
            </form>
        </Form>
    );
}
