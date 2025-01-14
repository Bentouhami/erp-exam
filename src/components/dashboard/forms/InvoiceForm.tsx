// path: src/components/InvoiceForm.tsx

'use client'

import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {useFieldArray, useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {toast} from 'react-toastify'
import axios from "axios";
import {API_DOMAIN, DOMAIN} from "@/lib/utils/constants";
import CustomerSelect from "@/components/customers/CustomerSelect";

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
})

type InvoiceFormData = z.infer<typeof invoiceSchema>

type User = {
    id: string
    firstName: string
    lastName: string
    userNumber: string
    vatNumber: string
    name: string
}

type Item = {
    id: number
    itemNumber: string
    label: string
    retailPrice: number
    vatType: 'REDUCED' | 'STANDARD' | 'EXEMPT'
}

interface InvoiceFormProps {
    invoiceId?: number
}

/**
 * Invoice form component to create or update an invoice with form fields
 * @param invoiceId
 * @constructor
 */

export default function InvoiceForm({invoiceId}: InvoiceFormProps) {
    const [users, setUsers] = useState<User[]>([])
    const [items, setItems] = useState<Item[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const form = useForm<InvoiceFormData>({
        resolver: zodResolver(invoiceSchema),
        defaultValues: {
            invoiceNumber: '',
            issuedAt: new Date().toISOString().split('T')[0],
            dueDate: new Date().toISOString().split('T')[0],
            userId: '',
            items: [{itemId: '', quantity: 1, discount: 0}],
        },
    })

    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: "items",
    })

    useEffect(() => {
        fetchUsersAndItems();
    }, []);

    useEffect(() => {
        if (invoiceId) {
            fetchInvoice(invoiceId);
        } else {
            // Generate invoice number
            fetch(`${API_DOMAIN}/invoices/generate-number`)
                .then(async (response) => {
                    if (!response.ok) {
                        throw new Error('Failed to generate invoice number');
                    }
                    const {invoiceNumber} = await response.json(); // Extract the invoiceNumber
                    form.setValue('invoiceNumber', invoiceNumber);
                })
                .catch((error) => {
                    console.error('Error generating invoice number:', error);
                    toast.error('Failed to generate invoice number');
                });
        }
    }, [invoiceId]);


    const fetchUsersAndItems = async () => {
        try {
            // get customer
            const [usersResponse, itemsResponse] = await Promise.all([
                fetch(`${API_DOMAIN}/users/customers`),
                fetch(`${API_DOMAIN}/items`),
            ])

            if (!usersResponse.ok || !itemsResponse.ok) {
                throw new Error('Failed to fetch data')
            }

            const usersData = await usersResponse.json()
            const itemsData = await itemsResponse.json()

            setUsers(usersData)
            setItems(itemsData)
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error('Failed to fetch users and items')
        } finally {
            setLoading(false)
        }
    }

    const fetchInvoice = async (id: number) => {
        if (!id) {
            toast.error('InvoiceId not found')
            return
        }
        try {
            console.log("log ====> id in fetchInvoice in path : src/components/InvoiceForm.tsx", id)
            const response = await axios.get(`${API_DOMAIN}/invoices/${id}`)
            if (response.status !== 200 || !response.data) {
                throw new Error('Failed to fetch invoice')
            }
            const invoiceData = await response.data;
            form.reset(invoiceData)
        } catch (error) {
            console.error('Error fetching invoice:', error)
            toast.error('Failed to fetch invoice')
        }
    }

    const onSubmit = async (data: InvoiceFormData) => {
        console.log("log ====> data in onSubmit in path : src/components/InvoiceForm.tsx", data)

        try {
            const response = await fetch(`${API_DOMAIN}/invoices`, {
                method: invoiceId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                throw new Error('Failed to save invoice')
            }

            toast.success(`Invoice ${invoiceId ? 'updated' : 'created'} successfully`)
            router.push(`${DOMAIN}/dashboard/invoices`)
        } catch (error) {
            console.error('Error saving invoice:', error)
            toast.error('Failed to save invoice')
        }
    }

    const calculateDueDate = (userId: string) => {
        const user = users.find(u => u.id === userId)
        if (user) {
            const issuedAt = new Date(form.getValues('issuedAt'))
            const dueDate = new Date(issuedAt.getTime())
            form.setValue('dueDate', dueDate.toISOString().split('T')[0])
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="invoiceNumber"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Invoice Number</FormLabel>
                            <FormControl>
                                <Input {...field} disabled={true}/>
                            </FormControl>
                            <FormMessage/>
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

                {/* Items section */}
                <div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Discount (%)</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fields.map((field, index) => (
                                <TableRow key={field.id}>
                                    <TableCell>
                                        <FormField
                                            control={form.control}
                                            name={`items.${index}.itemId`}
                                            render={({field}) => (
                                                <FormItem>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select an item"/>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {items.map((item) => (
                                                                <SelectItem key={item.id} value={item.id.toString()}>
                                                                    {item.label} ({item.itemNumber})
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
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
                                                        <Input type="number" {...field}
                                                               onChange={(e) => field.onChange(parseInt(e.target.value))}/>
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
                                                        <Input type="number" {...field}
                                                               onChange={(e) => field.onChange(parseFloat(e.target.value))}/>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button type="button" variant="destructive"
                                                onClick={() => remove(index)}>Remove</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Button type="button" onClick={() => append({itemId: '', quantity: 1, discount: 0})}>
                        Add Item
                    </Button>
                </div>
                <Button type="submit">Save Invoice</Button>
            </form>
        </Form>
    )
}

