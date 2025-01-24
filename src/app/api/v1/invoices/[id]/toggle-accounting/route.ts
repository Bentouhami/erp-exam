// Path: src/app/api/v1/invoices/[id]/toggle-accounting/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    if (request.method !== 'PATCH') {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
    }
    try {
        const invoice = await prisma.invoice.findUnique({
            where: { id: parseInt(params.id) }
        })

        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
        }

        const updatedInvoice = await prisma.invoice.update({
            where: { id: parseInt(params.id) },
            data: {
                flag_accounting: !invoice.flag_accounting
            }
        });
        if (!updatedInvoice) {
            return NextResponse.json({ error: 'Failed to update invoice accounting status' }, { status: 500 })
        }

        return NextResponse.json(updatedInvoice, { status: 200 })
    } catch (error) {
        console.error('Error toggling invoice accounting status:', error)
        return NextResponse.json({ error: 'Failed to update invoice accounting status' }, { status: 500 })
    }
}