'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Customer {
    id?: string
    name: string
    email: string
    vatNumber: string
    paymentTermDays: number
}

export default function CustomerForm({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [customer, setCustomer] = useState<Customer>({
        name: '',
        email: '',
        vatNumber: '',
        paymentTermDays: 0,
    })

    useEffect(() => {
        if (params.id !== 'new') {
            fetchCustomer()
        }
    }, [params.id])

    const fetchCustomer = async () => {
        const response = await fetch(`/api/customers/${params.id}`)
        const data = await response.json()
        setCustomer(data)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const url = params.id === 'new' ? '/api/customers' : `/api/customers/${params.id}`
        const method = params.id === 'new' ? 'POST' : 'PUT'

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(customer),
        })

        if (response.ok) {
            router.push('/customers')
        } else {
            // Handle error
            console.error('Failed to save customer')
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setCustomer(prev => ({ ...prev, [name]: value }))
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h1 className="text-2xl font-bold">{params.id === 'new' ? 'Add Customer' : 'Edit Customer'}</h1>
            <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={customer.name} onChange={handleChange} required />
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={customer.email} onChange={handleChange} required />
            </div>
            <div>
                <Label htmlFor="vatNumber">VAT Number</Label>
                <Input id="vatNumber" name="vatNumber" value={customer.vatNumber} onChange={handleChange} required />
            </div>
            <div>
                <Label htmlFor="paymentTermDays">Payment Terms (days)</Label>
                <Input id="paymentTermDays" name="paymentTermDays" type="number" value={customer.paymentTermDays} onChange={handleChange} required />
            </div>
            <Button type="submit">Save Customer</Button>
        </form>
    )
}

