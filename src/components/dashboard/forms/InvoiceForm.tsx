// path: src/components/dashboard/forms/InvoiceForm.tsx

'use client'
import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {useFieldArray, useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios from 'axios'
import {toast} from 'react-toastify'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table'
import CustomerSelect from '@/components/customers/CustomerSelect'
import ItemSelect from '@/components/item-form/ItemSelect'
import InvoiceTotals from '@/components/invoices/InvoiceTotals'
import {Delete, Plus, Save} from 'lucide-react'
import {API_DOMAIN, DOMAIN} from '@/lib/utils/constants'

/* Schema definition with zod for essential fields */
const invoiceSchema = z.object({
    id: z.string(),
    invoiceNumber: z.string(),
    communicationVCS: z.string(),
    issuedAt: z.string(),
    dueDate: z.string(),
    userId: z.string(),
    items: z.array(
        z.object({
            itemId: z.string(),
            quantity: z.number().min(1),
            discount: z.number().min(0).max(100),
            vatPercent: z.number().optional(),
        })
    ),
    totalAmount: z.number(),
    totalVatAmount: z.number(),
    totalTtcAmount: z.number(),
})

type InvoiceFormData = z.infer<typeof invoiceSchema>

interface InvoiceFormProps {
    invoiceId?: number
}

export default function InvoiceForm({invoiceId}: InvoiceFormProps) {
    const router = useRouter()
    const [users, setUsers] = useState<any[]>([])
    const [itemsList, setItemsList] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [totals, setTotals] = useState({totalHT: 0, totalVAT: 0, totalTTC: 0})
    const [groupedVAT, setGroupedVAT] = useState<Record<string, { vatBaseAmount: number; vatAmount: number }>>({});

    // Initialize the form with default values
    const form = useForm<InvoiceFormData>({
        resolver: zodResolver(invoiceSchema),
        defaultValues: {
            id: '',
            invoiceNumber: '',
            communicationVCS: '',
            issuedAt: new Date().toISOString().split('T')[0],
            dueDate: new Date().toISOString().split('T')[0],
            userId: '',
            items: [{itemId: '', quantity: 1, discount: 0, vatPercent: 0}],
            totalAmount: 0,
            totalVatAmount: 0,
            totalTtcAmount: 0,
        },
    })
    const selectedUserId = form.watch('userId');

    // Manage dynamic items
    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: 'items',
    })

    // Fetch customers and items; process customers to include country info.
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, itemsRes] = await Promise.all([
                    fetch(`${API_DOMAIN}/users/customers`),
                    fetch(`${API_DOMAIN}/items`),
                ])
                const usersData = await usersRes.json()
                // Process each user to extract countryId from their primary address (BILLING or HOME)
                const processedUsers = usersData.map((user: any) => {
                    const primaryAddress = user.userAddress?.find((addr: any) =>
                        addr.addressType === 'BILLING' || addr.addressType === 'HOME'
                    )
                    return {
                        ...user,
                        countryId: primaryAddress?.address?.city?.country?.id || null,
                        countryName: primaryAddress?.address?.city?.country?.name || 'Unknown Country',
                        isEnterprise: user.isEnterprise,
                    }
                })

                setUsers(processedUsers)

                const itemsData = await itemsRes.json()
                setItemsList(itemsData)
            } catch (error) {
                toast.error('Failed to fetch users or items')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])


    // Fetch invoice data (for edit) or generate a new invoice number and communication VCS (for create)
    useEffect(() => {
        const fetchInvoiceData = async () => {
            if (invoiceId) {
                try {
                    const res = await axios.get(`${API_DOMAIN}/invoices/${invoiceId}`)
                    const invoiceData = res.data
                    form.reset({
                        id: invoiceData.id.toString(),
                        invoiceNumber: invoiceData.invoiceNumber,
                        communicationVCS: invoiceData.communicationVCS,
                        issuedAt: invoiceData.issuedAt.split('T')[0],
                        dueDate: invoiceData.dueDate.split('T')[0],
                        userId: invoiceData.User.id,
                        items: invoiceData.invoiceDetails.map((detail: any) => ({
                            itemId: detail.item.id.toString(),
                            quantity: Number(detail.quantity),
                            discount: Number(detail.discount),
                        })),
                        totalAmount: Number(invoiceData.totalAmount),
                        totalVatAmount: Number(invoiceData.totalVatAmount),
                        totalTtcAmount: Number(invoiceData.totalTtcAmount),
                    })
                } catch (error) {
                    toast.error('Failed to fetch invoice')
                }
            } else {
                try {
                    const res = await axios.get(`${API_DOMAIN}/invoices/generate-number`)
                    if (res.data.invoiceNumber && res.data.communicationVCS) {
                        form.setValue('invoiceNumber', res.data.invoiceNumber);
                        form.setValue('communicationVCS', res.data.communicationVCS);
                    }
                } catch (error) {
                    toast.error('Failed to generate invoice number')
                }
            }
        }
        fetchInvoiceData()
    }, [invoiceId, form])

    const calculateTotals = async () => {
        const formItems = form.getValues("items");
        let totalHT = 0;
        let totalVAT = 0;

        // Object to store VAT breakdown
        let groupedVAT: Record<string, { vatBaseAmount: number; vatAmount: number }> = {};

        // Get the selected customer to extract country info.
        const selectedUser = users.find((u) => u.id === form.getValues("userId"));
        const countryId = selectedUser?.countryId;
        const isEnterprise = selectedUser?.isEnterprise;

        for (let i = 0; i < formItems.length; i++) {
            const item = formItems[i];
            const product = itemsList.find((p: any) => p.id.toString() === item.itemId);
            if (product) {
                const unitPrice = product.retailPrice;
                const lineHT = unitPrice * item.quantity * (1 - item.discount / 100);

                let vatPercent = item.vatPercent || product.vatPercent || 0;

                // If no VAT is set (0) and we have a valid country, fetch the VAT rate.
                if (vatPercent === 0 && countryId) {
                    try {
                        const vatRes = await fetch(
                            `${API_DOMAIN}/vat-rates?countryId=${countryId}&itemClassId=${product.itemClass.id}&isEnterprise=${isEnterprise}`
                        );
                        const vatData = await vatRes.json();
                        if (vatData && vatData.vatPercent !== undefined) {
                            vatPercent = vatData.vatPercent;
                            form.setValue(`items.${i}.vatPercent`, vatPercent);
                        }
                    } catch (error) {
                        console.error("Error fetching VAT rate:", error);
                        toast.error("Failed to fetch VAT rate");
                    }
                }

                const lineVAT = lineHT * (vatPercent / 100);
                totalHT += lineHT;
                totalVAT += lineVAT;

                // Group VAT amounts by percentage
                const vatKey = `${vatPercent}%`;
                if (!groupedVAT[vatKey]) {
                    groupedVAT[vatKey] = { vatBaseAmount: 0, vatAmount: 0 };
                }
                groupedVAT[vatKey].vatBaseAmount += lineHT;
                groupedVAT[vatKey].vatAmount += lineVAT;
            }
        }

        setTotals({
            totalHT: parseFloat(totalHT.toFixed(2)),
            totalVAT: parseFloat(totalVAT.toFixed(2)),
            totalTTC: parseFloat((totalHT + totalVAT).toFixed(2)),
        });

        // Store grouped VAT amounts for display
        setGroupedVAT(groupedVAT);
    };


    useEffect(() => {
        // When the customer changes, recalc the totals.
        calculateTotals();
    }, [selectedUserId]);
    useEffect(() => {
        // Recalculate totals whenever the items, selected customer, or items list change.
        calculateTotals()
    }, [form.watch('items'), form.watch('userId'), itemsList])


    // Recalculate totals whenever the items or selected user change.
    useEffect(() => {
        const recalc = async () => {
            await calculateTotals()
        }
        recalc()
    }, [form.watch('items'), form.watch('userId'), itemsList])

    // Handle form submission.
    const onSubmit = async (data: InvoiceFormData) => {
        const updatedData = {
            ...data,
            issuedAt: new Date(data.issuedAt).toISOString(),
            dueDate: new Date(data.dueDate).toISOString(),
            totalAmount: totals.totalHT,
            totalVatAmount: totals.totalVAT,
            totalTtcAmount: totals.totalTTC,
        }
        try {
            const url = invoiceId
                ? `${API_DOMAIN}/invoices/${invoiceId}`
                : `${API_DOMAIN}/invoices`
            const method = invoiceId ? 'put' : 'post'
            const res = await axios({
                url,
                method,
                headers: {'Content-Type': 'application/json'},
                data: updatedData,
            })
            if (res.status === 200 || res.status === 201) {
                toast.success(
                    `Invoice ${invoiceId ? 'updated' : 'created'} successfully`
                );
                router.push(`${DOMAIN}/dashboard/invoices`)

            }
        } catch (error: any) {
            // Check if the error has a response from Axios
            if (error.response && error.response.data) {
                const {error: errorMessage, itemLabel, availableStock, requiredStock} = error.response.data;

                if (errorMessage === "Not enough stock") {
                    toast.error(`Not enough stock for item ${itemLabel}. Available: ${availableStock} you need ${requiredStock}`);
                    return; // Exit early since we've handled the error
                }
            }
            // For any other error, show a generic message
            toast.error('Failed to save invoice');
        }
    }

    if (loading) return <div>Loading...</div>

    // Helper function for currency formatting.
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EUR',
        }).format(amount)

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Invoice Number (read-only) */}
                <FormField
                    control={form.control}
                    name="invoiceNumber"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Invoice Number</FormLabel>
                            <FormControl>
                                <Input {...field} disabled/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="communicationVCS"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Communication VCS</FormLabel>
                            <FormControl>
                                <Input {...field} disabled/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* Issue Date */}
                <FormField
                    control={form.control}
                    name="issuedAt"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Issue Date</FormLabel>
                            <FormControl>
                                <Input {...field} disabled/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* Due Date */}
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
                                    calculateTotals(); // Trigger recalculation right after customer changes
                                }}
                            />
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* Items Table */}
                <div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Item</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Discount (%)</TableHead>
                                <TableHead>Unit Price</TableHead>
                                <TableHead>Total HT</TableHead>
                                <TableHead>VAT %</TableHead>
                                <TableHead>Total VAT</TableHead>
                                <TableHead>Total TTC</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fields.map((field, index) => {
                                const selectedProduct = itemsList.find(
                                    (p: any) =>
                                        p.id.toString() === form.getValues(`items.${index}.itemId`)
                                )
                                const unitPrice = selectedProduct ? selectedProduct.retailPrice : 0
                                const discount = form.getValues(`items.${index}.discount`) || 0
                                const quantity = form.getValues(`items.${index}.quantity`) || 0
                                const lineHT = unitPrice * quantity * (1 - discount / 100)
                                const vatValue = Number(
                                    form.getValues(`items.${index}.vatPercent`) ||
                                    selectedProduct?.vatPercent ||
                                    0
                                );
                                const lineVAT = lineHT * (vatValue / 100)
                                return (
                                    <TableRow key={field.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.itemId`}
                                                render={({field}) => (
                                                    <ItemSelect
                                                        items={itemsList}
                                                        selectedItemId={field.value}
                                                        onSelect={(value) => {
                                                            field.onChange(value);
                                                            calculateTotals(); // Trigger recalculation immediately
                                                        }}
                                                        onItemSelected={() => calculateTotals()}
                                                    />
                                                )}
                                            />

                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.quantity`}
                                                render={({field}) => (
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(parseInt(e.target.value))
                                                        }
                                                    />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.discount`}
                                                render={({field}) => (
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(parseFloat(e.target.value))
                                                        }
                                                    />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>{unitPrice.toFixed(2)} €</TableCell>
                                        <TableCell>{lineHT.toFixed(2)} €</TableCell>
                                        <TableCell>
                                            {Number(
                                                form.watch(`items.${index}.vatPercent`) ||
                                                selectedProduct?.vatPercent ||
                                                0
                                            ).toFixed(2)}%
                                        </TableCell>

                                        <TableCell>{lineVAT.toFixed(2)} €</TableCell>
                                        <TableCell>{(lineHT + lineVAT).toFixed(2)} €</TableCell>
                                        <TableCell>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                onClick={() => remove(index)}
                                            >
                                                <Delete className="mr-2 h-4 w-4"/> Remove
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}

                        </TableBody>
                    </Table>
                    <Button
                        type="button"
                        onClick={() => append({itemId: '', quantity: 1, discount: 0})}
                    >
                        <Plus className="mr-2 h-4 w-4"/> Add Item
                    </Button>
                </div>

                {/* Totals Section */}
                <InvoiceTotals
                    totalHT={formatCurrency(totals.totalHT)}
                    totalVAT={formatCurrency(totals.totalVAT)}
                    totalTTC={formatCurrency(totals.totalTTC)}
                    groupedVAT={groupedVAT}
                />

                {/* Submit Button */}
                <Button type="submit">
                    <Save className="mr-2 h-4 w-4"/> Save Invoice
                </Button>
            </form>
        </Form>
    )
}
