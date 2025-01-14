// Path: src/app/api/v1/invoices/[id]/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/db'


/**
 * Fetch invoice by id with user and invoice details included
 * @param request
 * @param params
 * @constructor
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const invoice = await prisma.invoice.findUnique({
            where: { id: parseInt(params.id) },
            include: {
                User: true,
                invoiceDetails: {
                    include: {
                        item: true,
                    },
                },
            },

        })

        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
        }


        return NextResponse.json(invoice)
    } catch (error) {
        console.error('Error fetching invoice:', error)
        return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 })
    }
}

/**
 * Update invoice by id
 * @param request
 * @param params
 * @constructor
 */
export async function PUT(request: Request, { params }: { params: { id: string } }) {

    if (request.method !== 'PUT') {
        return NextResponse.json({ error: 'Invalid method' }, { status: 405 })
    }
    try {
        const body = await request.json()
        const { userId, items, ...invoiceData } = body

        // logs to debug
        console.log('userId in PUT path:src/app/api/v1/invoices/[id]/route.ts', userId)
        console.log('items in PUT path: src/app/api/v1/invoices/[id]/route.ts', items)
        console.log('invoiceData in PUT path: src/app/api/v1/invoices/[id]/route.ts', invoiceData)


        const invoice = await prisma.invoice.update({
            where: { id: parseInt(params.id) },
            data: {
                ...invoiceData,
                User: { connect: { id: userId } },
                invoiceDetails: {
                    deleteMany: {},
                    create: items.map((item: any) => ({
                        item: { connect: { id: parseInt(item.itemId) } },
                        quantity: item.quantity,
                        discount: item.discount,
                    })),
                },
            },
            include: {
                User: true,
                invoiceDetails: {
                    include: {
                        item: true,
                    },
                },
            },
        })

        // Calculate totals
        let totalAmount = 0
        let totalVatAmount = 0

        invoice.invoiceDetails.forEach((detail) => {
            const itemTotal = (detail.item.retailPrice.toNumber() * detail.quantity * (1 - detail.discount.toNumber() / 100))
            totalAmount += itemTotal
            totalVatAmount += itemTotal * (detail.item.vatType === 'REDUCED' ? 0.06 : 0.21)
        })

        const totalTtcAmount = totalAmount + totalVatAmount

        const updatedInvoice = await prisma.invoice.update({
            where: { id: invoice.id },
            data: {
                totalAmount,
                totalVatAmount,
                totalTtcAmount,
            },
        })

        return NextResponse.json(updatedInvoice)
    } catch (error) {
        console.error('Error updating invoice:', error)
        return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.invoice.delete({
            where: { id: parseInt(params.id) },
        })

        return NextResponse.json({ message: 'Invoice deleted successfully' })
    } catch (error) {
        console.error('Error deleting invoice:', error)
        return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 })
    }
}

