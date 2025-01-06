'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Customer {
    id: string
    name: string
    paymentTermDays: number
}

interface Item {
    id: number
    itemNumber: string
    label: string
    retailPrice: number
    vatType: string
}

interface InvoiceDetail {
    id?: number
    itemId: number
    quantity: number
    unitPrice: number
    discount: number
    vatAmount: number
    totalPrice: number
}

interface Invoice {
    id?: number
    invoiceNumber: string
    issuedAt: string
    dueDate: string
    userId: string
    flag_accounting: boolean
    totalAmount: number
    totalVatAmount: number
    totalTtcAmount: number
    invoiceDetails: InvoiceDetail[]
}

export default function InvoiceForm({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [invoice, setInvoice] = useState<Invoice>({
        invoiceNumber: '',
        issuedAt: new Date().toISOString().split('T')[0],
        dueDate: new Date().toISOString().split('T')[0],
        userId: '',
        flag_accounting: false,
        totalAmount: 0,
        totalVatAmount: 0,
        totalTtcAmount: 0,
        invoiceDetails: [],
    })
    const [customers, setCustomers] = useState<Customer[]>([])
    const [items, setItems] = useState<Item[]>([])

    useEffect(() => {
        fetchCustomers()
        fetchItems()
        if (params.id !== 'new') {
            fetchInvoice()
        }
    }, [params.id])

    const fetchCustomers = async () => {
        const response = await fetch('/api/customers')
        const data = await response.json()
        setCustomers(data)
    }

    const fetchItems = async () => {
        const response = await fetch('/api/items')
        const data = await response.json()
        setItems(data)
    }

    const fetchInvoice = async () => {
        const response = await fetch(`/api/invoices/${params.id}`)
        const data = await response.json()
        setInvoice(data)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const url = params.id === 'new' ? '/api/invoices' : `/api/invoices/${params.id}`
        const method = params.id === 'new' ? 'POST' : 'PUT'

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(invoice),
        })

        if (response.ok) {
            router.push('/invoices')
        } else {
            // Handle error
            console.error('Failed to save invoice')
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setInvoice(prev => ({ ...prev, [name]: value }))
    }

    const handleCustomerChange = (customerId: string) => {
        const customer = customers.find(c => c.id === customerId)
        if (customer) {
            const dueDate = new Date(invoice.issuedAt)
            dueDate.setDate(dueDate.getDate() + customer.paymentTermDays)
            setInvoice(prev => ({
                ...prev,
                userId: customerId,
                dueDate: dueDate.toISOString().split('T')[0],
            }))
        }
    }

    const addInvoiceDetail = () => {
        setInvoice(prev => ({
            ...prev,
            invoiceDetails: [...prev.invoiceDetails, {
                itemId: 0,
                quantity: 1,
                unitPrice: 0,
                discount: 0,
                vatAmount: 0,
                totalPrice: 0,
            }],
        }))
    }

    const updateInvoiceDetail = (index: number, field: keyof InvoiceDetail, value: number) => {
        setInvoice(prev => {
            const newDetails = [...prev.invoiceDetails]
            newDetails[index] = { ...newDetails[index], [field]: value }

            // Recalculate totals
            const item = items.find(i => i.id === newDetails[index].itemId)
            if (item) {
                const quantity = newDetails[index].quantity
                const unitPrice = newDetails[index].unitPrice
                const discount = newDetails[index].discount
                const subtotal = quantity * unitPrice * (1 - discount / 100)
                const vatRate = item.vatType === 'REDUCED' ? 0.06 : 0.21
                const vatAmount = subtotal * vatRate
                const totalPrice = subtotal + vatAmount

                newDetails[index].vatAmount = vatAmount
                newDetails[index].totalPrice = totalPrice
            }

            // Recalculate invoice totals
            const totalAmount = newDetails.reduce((sum, detail) => sum + detail.totalPrice - detail.vatAmount, 0)
            const totalVatAmount = newDetails.reduce((sum, detail) => sum + detail.vatAmount, 0)
            const totalTtcAmount = totalAmount + totalVatAmount

            return {
                ...prev,
                invoiceDetails: newDetails,
                totalAmount,
                totalVatAmount,
                totalTtcAmount,
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h1 className="text-2xl font-bold">{params.id === 'new' ? 'Create Invoice' : 'Edit Invoice'}</h1>
            <div>
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input id="invoiceNumber" name="invoiceNumber" value={invoice.invoiceNumber} onChange={handleChange} required />
            </div>
            <div>
                <Label htmlFor="issuedAt">Issue Date</Label>
                <Input id="issuedAt" name="issuedAt" type="date" value={invoice.issuedAt} onChange={handleChange} required />
            </div>
            <div>
                <Label htmlFor="userId">Customer</Label>
                <Select name="userId" value={invoice.userId} onValueChange={handleCustomerChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Customer" />
                    </SelectTrigger>
                    <SelectContent>
                        {customers.map(customer => (
                            <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" name="dueDate" type="date" value={invoice.dueDate} onChange={handleChange} required />
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-2">Invoice Details</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Unit Price</TableHead>
                            <TableHead>Discount (%)</TableHead>
                            <TableHead>VAT Amount</TableHead>
                            <TableHead>Total Price</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoice.invoiceDetails.map((detail, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Select
                                        value={detail.itemId.toString()}
                                        onValueChange={(value) => updateInvoiceDetail(index, 'itemId', parseInt(value))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Item" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {items.map(item => (
                                                <SelectItem key={item.id} value={item.id.toString()}>{item.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        value={detail.quantity}
                                        onChange={(e) => updateInvoiceDetail(index, 'quantity', parseInt(e.target.value))}
                                        min="1"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        value={detail.unitPrice}
                                        onChange={(e) => updateInvoiceDetail(index, 'unitPrice', parseFloat(e.target.value))}
                                        step="0.01"
                                        min="0"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        value={detail.discount}
                                        onChange={(e) => updateInvoiceDetail(index, 'discount', parseFloat(e.target.value))}
                                        step="0.1"
                                        min="0"
                                        max="100"
                                    />
                                </TableCell>
                                <TableCell>{detail.vatAmount.toFixed(2)}</TableCell>
                                <TableCell>{detail.totalPrice.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Button type="button" onClick={addInvoiceDetail} className="mt-2">Add Item</Button>
            </div>
            <div className="flex justify-between">
                <div>
                    <p>Total HTVA: ${invoice.totalAmount.toFixed(2)}</p>
                    <p>Total VAT: ${invoice.totalVatAmount.toFixed(2)}</p>
                    <p className="font-bold">Total TTC: ${invoice.totalTtcAmount.toFixed(2)}</p>
                </div>
                <Button type="submit">Save Invoice</Button>
            </div>
        </form>
    )
}

