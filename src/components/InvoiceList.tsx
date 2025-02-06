'use client'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {ArrowUpDown, ChevronDown, MoreHorizontal, Plus} from 'lucide-react'
import {toast} from 'react-toastify'
import axios from "axios"
import {API_DOMAIN, DOMAIN} from "@/lib/utils/constants"
import {ListSkeleton} from "@/components/skeletons/ListSkeleton"
import {Badge} from './ui/badge'
import RequireAuth from "@/components/auth/RequireAuth"

type Invoice = {
    id: number
    invoiceNumber: string
    communicationVCS: string
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

export default function InvoiceList() {
    const [invoices, setInvoices] = useState<Invoice[]>([]) // Always an array
    const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]) // Always an array
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState<'all' | 'accounted' | 'not_accounted'>('all')
    const [sortConfig, setSortConfig] = useState<SortConfig>({key: 'invoiceNumber', direction: 'asc'})
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>()
    const router = useRouter()

    useEffect(() => {
        fetchInvoices()

        console.log("invoices", invoices)
    }, [])

    useEffect(() => {
        if (!Array.isArray(invoices)) return

        // In the useEffect filtering logic, replace the existing filter with:
        let filtered = invoices.filter(invoice => {
            const lowerSearchTerm = searchTerm.toLowerCase();
            const invoiceNumberMatch = invoice.invoiceNumber.toLowerCase().includes(lowerSearchTerm);
            const clientNameMatch = invoice.User.name.toLowerCase().includes(lowerSearchTerm);
            const clientNumberMatch = invoice.User.userNumber.toLowerCase().includes(lowerSearchTerm);

            // Format dates to 'YYYY-MM-DD' for consistent searching
            const formattedIssuedDate = format(new Date(invoice.issuedAt), 'yyyy-MM-dd')
            const dateMatch = formattedIssuedDate.includes(lowerSearchTerm)

            return invoiceNumberMatch || clientNameMatch || clientNumberMatch || dateMatch
        });

        if (filterStatus === 'accounted') {
            filtered = filtered.filter(invoice => invoice.flag_accounting)
        } else if (filterStatus === 'not_accounted') {
            filtered = filtered.filter(invoice => !invoice.flag_accounting)
        }

        setFilteredInvoices(filtered)
    }, [searchTerm, invoices, filterStatus])

    const indexOfLastInvoice = currentPage * itemsPerPage
    const indexOfFirstInvoice = indexOfLastInvoice - itemsPerPage
    const currentInvoices = Array.isArray(filteredInvoices) ? filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice) : []

    const fetchInvoices = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${API_DOMAIN}/invoices`)
            if (response.status !== 200 || !response.data) {
                throw new Error('Failed to fetch invoices')
            }
            const data = response.data.invoices // ✅ Extract `invoices` from response
            console.log("data", data)
            setInvoices(data)
            setFilteredInvoices(data)
        } catch (error) {
            console.error('Error fetching invoices:', error)
            toast.error('Failed to fetch invoices')
            setInvoices([]) // ✅ Ensure it is always an array
            setFilteredInvoices([]) // ✅ Ensure it is always an array
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
                const response = await axios.delete(`${API_DOMAIN}/invoices/${invoiceId}`)
                if (response.status !== 200) {
                    throw new Error('Failed to delete invoice')
                }
                toast.success('Invoice deleted successfully')
                await fetchInvoices()
            } catch (error) {
                console.error('Error deleting invoice:', error)
                toast.error('Failed to delete invoice')
            }
        }
    }

    const handleToggleAccounting = async (invoiceId: number) => {
        const updatedInvoices = invoices.map((inv) =>
            inv.id === invoiceId ? {...inv, flag_accounting: !inv.flag_accounting} : inv
        )
        setInvoices(updatedInvoices)

        try {
            const response = await axios.patch(`${API_DOMAIN}/invoices/${invoiceId}/toggle-accounting`)
            if (response.status !== 200) {
                throw new Error('Failed to update accounting status')
            }
            toast.success('Invoice accounting status updated successfully')
            await fetchInvoices()
        } catch (error) {
            console.error('Error updating accounting status:', error)
            toast.error('Failed to update accounting status')
        }
    }

    if (loading) {
        return <ListSkeleton/>
    }

    return (
        <RequireAuth>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Search invoices, clients, or dates (YYYY-MM-DD)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="h-10">
                                    <CalendarIcon className="h-4 w-4"/>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={(date) => {
                                        setSelectedDate(date ?? undefined)
                                        if (date) {
                                            setSearchTerm(format(date, 'yyyy-MM-dd'))
                                        }
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Button onClick={handleAddInvoice}>
                        <Plus className="mr-2 h-4 w-4"/> Add Invoice
                    </Button>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            Filter by Status <ChevronDown className="ml-2 h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setFilterStatus('all')}>All</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilterStatus('accounted')}>Accounted</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilterStatus('not_accounted')}>Not
                            Accounted</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="overflow-x-auto">
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
                                    <Button variant="ghost" onClick={() => handleSort("communicationVCS")}>
                                        Communication VCS
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
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
                                        Customer
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
                            {currentInvoices.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                                    <TableCell>{invoice.communicationVCS}</TableCell>
                                    <TableCell>{new Date(invoice.issuedAt).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        {invoice.User.name} (No. {invoice.User.userNumber})
                                    </TableCell>
                                    <TableCell>{invoice.totalTtcAmount} €</TableCell>
                                    <TableCell>
                                        {invoice.flag_accounting ? (
                                            <Badge
                                                variant="default"
                                                className="bg-green-500 hover:bg-green-600"
                                                title="This invoice is accounted and cannot be modified or deleted."
                                            >
                                                <div className="flex items-center gap-1">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"/>
                                                    Accounted
                                                </div>
                                            </Badge>
                                        ) : new Date(invoice.dueDate) < new Date() ? (
                                            <Badge
                                                variant="destructive"
                                                className="bg-red-500 hover:bg-red-600"
                                                title="This invoice is overdue and not accounted."
                                            >
                                                <div className="flex items-center gap-1">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"/>
                                                    Overdue
                                                </div>
                                            </Badge>
                                        ) : (
                                            <Badge
                                                variant="secondary"
                                                className="bg-gray-200 hover:bg-gray-400"
                                                title="This invoice is not accounted and can be modified or deleted."
                                            >
                                                <div className="flex items-center gap-1">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-gray-300"/>
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
                    <div className="flex justify-between items-center mt-4">
                        <div>
                            Showing {indexOfFirstInvoice + 1} to {Math.min(indexOfLastInvoice, filteredInvoices.length)} of {filteredInvoices.length} invoices
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <Button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredInvoices.length / itemsPerPage)))}
                                disabled={indexOfLastInvoice >= filteredInvoices.length}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </RequireAuth>
    )
}