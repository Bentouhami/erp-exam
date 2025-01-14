// Path: src/components/InvoiceList.tsx

'use client'

import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {ArrowUpDown, MoreHorizontal, Plus} from 'lucide-react'
import {toast} from 'react-toastify'
import axios from "axios";
import {API_DOMAIN, DOMAIN} from "@/lib/utils/constants";
import {ListSkeleton} from "@/components/skeletons/ListSkeleton";
import {Badge} from './ui/badge'
import RequireAuth from "@/components/auth/RequireAuth";

type Invoice = {
    id: number
    invoiceNumber: string
    issuedAt: string
    dueDate: string
    userId: string
    flag_accounting: boolean
    totalAmount: number
    totalVatAmount: number
    totalTtcAmount: number
    User: {
        name: string
        userNumber: string
    }
}

type SortConfig = {
    key: keyof Invoice | 'User.name'
    direction: 'asc' | 'desc'
}

/**
 * Invoice list component to display a list of invoices in a table
 * @constructor
 */
export default function InvoiceList() {
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [sortConfig, setSortConfig] = useState<SortConfig>({key: 'invoiceNumber', direction: 'asc'})
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetchInvoices()
    }, [])

    useEffect(() => {
        const filtered = invoices.filter(invoice =>
            invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.User.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.User.userNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            new Date(invoice.issuedAt).toLocaleDateString().includes(searchTerm)
        )
        setFilteredInvoices(filtered)
    }, [searchTerm, invoices])

    const fetchInvoices = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${API_DOMAIN}/invoices`)
            if (response.status !== 200 || !response.data) {
                throw new Error('Failed to fetch invoices')
            }
            const data = await response.data;
            setInvoices(data)
            setFilteredInvoices(data)
        } catch (error) {
            console.error('Error fetching invoices:', error)
            toast.error('Failed to fetch invoices')
        } finally {
            setLoading(false)
        }
    }

    const handleSort = (key: SortConfig['key']) => {
        let direction: 'asc' | 'desc' = 'asc'
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({key, direction})

        const sortedInvoices = [...filteredInvoices].sort((a, b) => {
            if (key === 'User.name') {
                return direction === 'asc'
                    ? a.User.name.localeCompare(b.User.name)
                    : b.User.name.localeCompare(a.User.name)
            }
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
            return 0
        })
        setFilteredInvoices(sortedInvoices)
    }

    const handleAddInvoice = () => {
        router.push(`${DOMAIN}/dashboard/invoices/new`)
    }

    const handleEditInvoice = (invoiceId: number) => {
        router.push(`${DOMAIN}/dashboard/invoices/${invoiceId}/edit`)
    }

    const handleDeleteInvoice = async (invoiceId: number) => {
        if (window.confirm('Are you sure you want to delete this invoice?')) {
            try {
                const response = await axios.get(`${API_DOMAIN}/invoices/${invoiceId}`, {
                    method: 'DELETE',
                })
                if (response.status !== 200 || !response.data) {
                    throw new Error('Failed to delete invoice')
                }

                toast.success('Invoice deleted successfully')
                fetchInvoices()
            } catch (error) {
                console.error('Error deleting invoice:', error)
                toast.error('Failed to delete invoice')
            }
        }
    }

    // In InvoiceList.tsx
    const handleToggleAccounting = async (invoiceId: number) => {
        try {
            const response = await axios.patch(`${API_DOMAIN}/invoices/${invoiceId}/toggle-accounting`)
            if (response.status !== 200 || !response.data) {
                throw new Error('Failed to update accounting status')
            }
            toast.success('Invoice accounting status updated successfully')
            fetchInvoices() // Refresh the list
        } catch (error) {
            console.error('Error updating accounting status:', error)
            toast.error('Failed to update accounting status')
        }
    }

    if (loading) {
        return (
            <ListSkeleton/>
        )
    }

    return (
        <RequireAuth>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Input
                        type="text"
                        placeholder="Search invoices..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                    <Button onClick={handleAddInvoice}>
                        <Plus className="mr-2 h-4 w-4"/> Add Invoice
                    </Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">
                                <Button variant="ghost" onClick={() => handleSort('invoiceNumber')}>
                                    Invoice Number
                                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('issuedAt')}>
                                    Issue Date
                                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('dueDate')}>
                                    Due Date
                                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('User.name')}>
                                    Customer Name
                                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('totalTtcAmount')}>
                                    Total Amount (TTC)
                                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                                </Button>
                            </TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredInvoices.map((invoice) => (
                            <TableRow key={invoice.id}>
                                <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                                <TableCell>{new Date(invoice.issuedAt).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                                <TableCell>{invoice.User.name}</TableCell>
                                <TableCell>{invoice.totalTtcAmount} €</TableCell>
                                {/* Add visual indicators to the badges */}
                                <TableCell>
                                    {invoice.flag_accounting ? (
                                        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                            <div className="flex items-center gap-1">
                                                <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"/>
                                                Accounted
                                            </div>
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="hover:bg-gray-200">
                                            <div className="flex items-center gap-1">
                                                <div className="h-1.5 w-1.5 rounded-full bg-gray-400"/>
                                                Not Accounted
                                            </div>
                                        </Badge>
                                    )}
                                </TableCell>

                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4"/>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => handleEditInvoice(invoice.id)}
                                                              disabled={invoice.flag_accounting}>
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator/>
                                            <DropdownMenuItem onClick={() => handleToggleAccounting(invoice.id)}>
                                                {invoice.flag_accounting ? 'Remove from Accounting' : 'Mark as Accounted'}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator/>
                                            <DropdownMenuItem onClick={() => handleDeleteInvoice(invoice.id)}
                                                              disabled={invoice.flag_accounting}>
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </RequireAuth>
    )
}

