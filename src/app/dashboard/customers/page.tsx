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

interface Customer {
    id: string
    name: string
    email: string
    vatNumber: string
    paymentTermDays: number
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])

    useEffect(() => {
        fetchCustomers()
    }, [])

    const fetchCustomers = async () => {
        const response = await fetch('/api/customers')
        const data = await response.json()
        setCustomers(data)
        setFilteredCustomers(data)
    }

    const handleSearch = (query: string) => {
        const filtered = customers.filter(customer =>
            customer.name.toLowerCase().includes(query.toLowerCase()) ||
            customer.email.toLowerCase().includes(query.toLowerCase()) ||
            customer.vatNumber.toLowerCase().includes(query.toLowerCase())
        )
        setFilteredCustomers(filtered)
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Customers</h1>
                <Link href="/customers/new">
                    <Button>Add Customer</Button>
                </Link>
            </div>
            <SearchBar onSearch={handleSearch} />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>VAT Number</TableHead>
                        <TableHead>Payment Terms</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                            <TableCell className="font-medium">{customer.name}</TableCell>
                            <TableCell>{customer.email}</TableCell>
                            <TableCell>{customer.vatNumber}</TableCell>
                            <TableCell>{customer.paymentTermDays} days</TableCell>
                            <TableCell className="text-right">
                                <Link href={`/customers/${customer.id}`}>
                                    <Button variant="outline" size="sm">Edit</Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

