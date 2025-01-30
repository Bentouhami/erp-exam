// Path: src/app/api/v1/invoices/[id]/route.ts

import {NextRequest, NextResponse} from 'next/server';
import prisma from '@/lib/db';

/**
 * Fetch invoice by id with user and invoice details included
 * @param request
 * @param params
 * @constructor
 */
export async function GET(request: NextRequest, {params}: { params: { id: string } }) {

    if (request.method !== 'GET') {
        return NextResponse.json({error: 'Method not allowed'}, {status: 405});
    }

    try {
        const invoice = await prisma.invoice.findUnique({
            where: {id: parseInt(params.id)},
            include: {
                User: true,
                invoiceDetails: {
                    include: {
                        item: {
                            include: {
                                vat: true, // Include VAT details
                            },
                        },
                    },
                },
            },
        });

        if (!invoice) {
            return NextResponse.json({error: 'Invoice not found'},
                {status: 404});
        }

        return NextResponse.json(invoice);
    } catch (error) {
        console.error('Error fetching invoice:', error);
        return NextResponse.json({error: 'Failed to fetch invoice'}, {status: 500});
    }
}

/**
 * Update invoice by id
 * @param request
 * @param params
 * @constructor
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    if (request.method !== 'PUT') {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }

    try {
        const { id } = params;
        const body = await request.json();
        const { userId, items, issuedAt, dueDate, ...invoiceData } = body;

        if (!userId || !items || !issuedAt || !dueDate) {
            return NextResponse.json(
                { error: 'Missing required parameters' },
                { status: 400 }
            );
        }

        // Convert `issuedAt` and `dueDate` to Date objects
        const issuedAtDate = new Date(issuedAt);
        const dueDateDate = new Date(dueDate);

        // Validate and fetch items
        const itemDetails = await prisma.item.findMany({
            where: {
                id: { in: items.map((item: any) => parseInt(item.itemId)) },
                itemStatus: 'ACTIVE',
            },
            include: { vat: true },
        });

        if (itemDetails.length !== items.length) {
            return NextResponse.json(
                { error: 'Some items are inactive or not found' },
                { status: 400 }
            );
        }

        // Prepare `invoiceDetails` data
        const invoiceDetailsData = items.map((item: any, index: number) => {
            const itemDetail = itemDetails.find((i) => i.id === parseInt(item.itemId));
            if (!itemDetail || !itemDetail.vat) throw new Error('Item not found');

            const unitPrice = Number(itemDetail.retailPrice); // Retail price as `unitPrice`
            const vatRate = Number(itemDetail.vat.vatPercent) / 100;
            const vatBaseAmount = unitPrice * item.quantity * (1 - item.discount / 100);
            const vatAmount = vatBaseAmount * vatRate;

            return {
                item: { connect: { id: itemDetail.id } },
                quantity: item.quantity,
                discount: item.discount,
                lineNumber: index + 1,
                unitPrice, // Include `unitPrice`
                vatBaseAmount,
                vatAmount,
                totalPrice: vatBaseAmount + vatAmount,
            };
        });

        // Calculate totals
        let totalAmount = 0;
        let totalVatAmount = 0;

        type InvoiceDetailData = {
            item: { connect: { id: number } };
            quantity: number;
            discount: number;
            lineNumber: number;
            unitPrice: number;
            vatBaseAmount: number;
            vatAmount: number;
            totalPrice: number;
        };

        invoiceDetailsData.forEach((detail: InvoiceDetailData ) => {
            totalAmount += detail.vatBaseAmount;
            totalVatAmount += detail.vatAmount;
        });

        const totalTtcAmount = totalAmount + totalVatAmount;

        // remove id invoiceData
        delete invoiceData.id;

        // Update invoice
        const updatedInvoice = await prisma.invoice.update({
            where: { id: parseInt(id) },
            data: {
                ...invoiceData,
                issuedAt: issuedAtDate,
                dueDate: dueDateDate,
                totalAmount,
                totalVatAmount,
                totalTtcAmount,
                User: { connect: { id: userId } },
                invoiceDetails: {
                    deleteMany: {}, // Remove existing details
                    create: invoiceDetailsData,
                },
            },
            include: {
                User: true,
                invoiceDetails: { include: { item: true } },
            },
        });

        return NextResponse.json(updatedInvoice);
    } catch (error) {
        console.error('Error updating invoice:', error);
        return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
    }
}


/**
 * Delete invoice by id
 * @param request
 * @param params
 * @constructor
 */
export async function DELETE(request: NextRequest, {params}: { params: { id: string } }) {

    if (request.method !== 'DELETE') {
        return NextResponse.json({error: 'Method not allowed'}, {status: 405});
    }

    try {
        await prisma.invoice.delete({
            where: {id: parseInt(params.id)},
        });

        return NextResponse.json({message: 'Invoice deleted successfully'}, {status: 200});
    } catch (error) {
        console.error('Error deleting invoice:', error);
        return NextResponse.json({error: 'Failed to delete invoice'}, {status: 500});
    }
}
