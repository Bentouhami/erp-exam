"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { InvoiceDetails } from "@/components/InvoiceDetails"
import { InvoiceProducts } from "@/components/InvoiceProducts"
import { InvoiceCustomer } from "@/components/InvoiceCustomer"

type InvoiceFormProps = {
    id: string | null
}

export function InvoiceForm({ id }: InvoiceFormProps) {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Simulate loading invoice data
        const timer = setTimeout(() => {
            setLoading(false)
        }, 1000)

        return () => clearTimeout(timer)
    }, [id])

    if (loading) {
        return <div>Loading invoice data...</div>
    }

    return (
        <div className="space-y-8">
            <InvoiceDetails invoiceId={id || 'new'} />
            <InvoiceCustomer invoiceId={id || 'new'} />
            <InvoiceProducts invoiceId={id || 'new'} />

            <div className="flex justify-end">
                <Button type="submit">
                    {id ? "Update Invoice" : "Create Invoice"}
                </Button>
            </div>
        </div>
    )
}

