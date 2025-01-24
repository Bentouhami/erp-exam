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
export async function PUT(request: NextRequest, {params}: { params: { id: string } }) {

    if (request.method !== 'PUT') {
        return NextResponse.json({error: 'Method not allowed'}, {status: 405});
    }
    try {
        const body = await request.json();
        const {userId, items, ...invoiceData} = body;

        if (userId === undefined || items === undefined || invoiceData === undefined) {
            return NextResponse.json({error: 'Missing required parameters'}, {status: 400});
        }

        // Validate and fetch items
        const itemDetails = await prisma.item.findMany({
            where: {
                id: {in: items.map((item: any) => parseInt(item.itemId))},
                itemStatus: 'ACTIVE',
            },
            include: {
                vat: true, // Include VAT details
            },
        });

        if (itemDetails.length !== items.length) {
            return NextResponse.json({error: 'Some items are inactive or not found'}, {status: 400});
        }


        // Update invoice and recreate invoice details
        const invoice = await prisma.invoice.update({
            where: {id: parseInt(params.id)},
            data: {
                ...invoiceData,
                User: {connect: {id: userId}},
                invoiceDetails: {
                    deleteMany: {}, // Remove existing invoice details
                    create: items.map((item: any, index: number) => {
                        const itemDetail = itemDetails.find((i) => i.id === parseInt(item.itemId));
                        if (!itemDetail) throw new Error('Item not found');
                        return {
                            item: {connect: {id: itemDetail.id}},
                            quantity: item.quantity,
                            discount: item.discount,
                            lineNumber: index + 1,
                        };
                    }),
                },
            },
            include: {
                User: true,
                invoiceDetails: {
                    include: {
                        item: {
                            include: {
                                vat: true, // Include VAT details for calculations
                            },
                        },
                    },
                },
            },
        });

        // Calculate totals
        let totalAmount = 0;
        let totalVatAmount = 0;

        if (invoice.invoiceDetails.length === 0) {
            return NextResponse.json({error: 'No invoice details found'}, {status: 400});
        }

        invoice.invoiceDetails.forEach((detail) => {
            const unitPrice = detail.item.retailPrice.toNumber();
            const vatRate = detail.item.vat.vatPercent.toNumber() / 100;
            const itemTotal = unitPrice * detail.quantity * (1 - detail.discount.toNumber() / 100);
            totalAmount += itemTotal;
            totalVatAmount += itemTotal * vatRate;
        });

        const totalTtcAmount = totalAmount + totalVatAmount;

        // Update totals in the invoice
        const updatedInvoice = await prisma.invoice.update({
            where: {id: invoice.id},
            data: {
                totalAmount,
                totalVatAmount,
                totalTtcAmount,
            },
        });

        if (updatedInvoice === null) {
            return NextResponse.json({error: 'Failed to update invoice'}, {status: 500});
        }
        return NextResponse.json(updatedInvoice, {status: 200});
    } catch (error) {
        console.error('Error updating invoice:', error);
        return NextResponse.json({error: 'Failed to update invoice'}, {status: 500});
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
