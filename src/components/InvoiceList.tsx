"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link"

// Type pour une facture
type Invoice = {
    id: string
    number: string
    date: string
    clientName: string
    clientNumber: string
    total: number
    flagAccounting: boolean
}

// Données factices pour l'exemple
const mockInvoices: Invoice[] = [
    { id: "1", number: "FAC-001", date: "2025-01-15", clientName: "Client A", clientNumber: "CLI-001", total: 1500, flagAccounting: false },
    { id: "2", number: "FAC-002", date: "2025-01-20", clientName: "Client B", clientNumber: "CLI-002", total: 2300, flagAccounting: true },
    // Ajoutez plus de factures factices ici
]

export function InvoiceList() {
    const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
    const [searchTerm, setSearchTerm] = useState("")

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        // Implémentez la logique de recherche ici
    }

    const handleSort = (key: keyof Invoice) => {
        // Implémentez la logique de tri ici
    }

    return (
        <div>
            <div className="mb-4">
                <Input
                    type="text"
                    placeholder="Rechercher une facture..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead onClick={() => handleSort('number')}>N° Facture</TableHead>
                        <TableHead onClick={() => handleSort('date')}>Date</TableHead>
                        <TableHead onClick={() => handleSort('clientName')}>Client</TableHead>
                        <TableHead onClick={() => handleSort('clientNumber')}>N° Client</TableHead>
                        <TableHead onClick={() => handleSort('total')}>Total</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                            <TableCell>{invoice.number}</TableCell>
                            <TableCell>{invoice.date}</TableCell>
                            <TableCell>{invoice.clientName}</TableCell>
                            <TableCell>{invoice.clientNumber}</TableCell>
                            <TableCell>{invoice.total.toFixed(2)} €</TableCell>
                            <TableCell>
                                <Button asChild variant="outline" size="sm" disabled={invoice.flagAccounting}>
                                    <Link href={`/dashboard/invoice/${invoice.id}`}>
                                        {invoice.flagAccounting ? "Voir" : "Modifier"}
                                    </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

