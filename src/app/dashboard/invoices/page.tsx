// path: src/app/invoices/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import SearchBar from "@/components/SearchBar";

interface Invoice {
    id: number
    invoiceNumber: string
    issuedAt: string
    totalAmount: number
    User: {
        name: string
    }
    flag_accounting: boolean
}

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])

    useEffect(() => {
        fetchInvoices()
    }, [])

    const fetchInvoices = async () => {
        const response = await fetch('/api/invoices')
        const data = await response.json()
        setInvoices(data)
        setFilteredInvoices(data)
    }

    const handleSearch = (query: string) => {
        const filtered = invoices.filter(invoice =>
            invoice.invoiceNumber.toLowerCase().includes(query.toLowerCase()) ||
            invoice.User.name.toLowerCase().includes(query.toLowerCase())
        )
        setFilteredInvoices(filtered)
    }

    return (
        <div className="space-y-4 m-5">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Invoices</h1>
                <Link href="/dashboard/invoices/new">
                    <Button>Add Invoice</Button>
                </Link>
            </div>
            <SearchBar onSearch={handleSearch} />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Invoice No.</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                            <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                            <TableCell>{new Date(invoice.issuedAt).toLocaleDateString()}</TableCell>
                            <TableCell>{invoice.User.name}</TableCell>
                            <TableCell>${invoice.totalAmount.toFixed(2)}</TableCell>
                            <TableCell>{invoice.flag_accounting ? 'Accounted' : 'Not Accounted'}</TableCell>
                            <TableCell className="text-right">
                                <Link href={`/src/app/dashboard/invoices/${invoice.id}`}>
                                    <Button variant="outline" size="sm">View</Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

