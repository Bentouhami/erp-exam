// Path: src/app/api/v1/invoices/[id]/toggle-accounting/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
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
        })

        return NextResponse.json(updatedInvoice)
    } catch (error) {
        console.error('Error toggling invoice accounting status:', error)
        return NextResponse.json({ error: 'Failed to update invoice accounting status' }, { status: 500 })
    }
}