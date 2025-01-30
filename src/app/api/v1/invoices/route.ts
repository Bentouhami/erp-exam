// path: src/app/api/v1/invoices/route.ts

import {NextRequest, NextResponse} from 'next/server';
import prisma from '@/lib/db';
import {generateInvoiceNumber} from "@/lib/utils/invoice";

export async function GET(request: NextRequest) {

    if (request.method !== 'GET') {
        return new Response('Method not allowed', {status: 405});
    }
    // get search params from url
    const {searchParams} = new URL(request.url);
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'issuedAt';
    const order = searchParams.get('order') || 'desc';

    try {
        const invoices = await prisma.invoice.findMany({
            where: search
                ? {
                    OR: [
                        {invoiceNumber: {contains: search, mode: 'insensitive'}},
                        {
                            User: {
                                OR: [
                                    {name: {contains: search, mode: 'insensitive'}},
                                    {userNumber: {contains: search, mode: 'insensitive'}},
                                ],
                            },
                        },
                    ],
                }
                : undefined,
            orderBy: {
                [sort]: order,
            },
            include: {
                User: {
                    select: {
                        name: true,
                        userNumber: true,
                    },
                },
            },
        });

        return NextResponse.json(invoices, {status: 200});
    } catch (error) {
        console.error('Error fetching invoices:', error);
        return NextResponse.json({error: 'Failed to fetch invoices'}, {status: 500});
    }
}

export async function POST(request: NextRequest) {
    if (request.method !== 'POST') {
        return new Response('Method not allowed', {status: 405});
    }

    try {
        const body = await request.json();
        console.log('Invoice data received in POST request in path src/app/api/v1/invoices/route.ts:', body);
        const {userId, items, issuedAt,invoiceNumber, ...invoiceData} = body;
        if (!invoiceData.invoiceNumber) {
            invoiceData.invoiceNumber = await generateInvoiceNumber();
        }

        // Fetch user for payment terms
        const user = await prisma.user.findUnique({
            where: {id: userId},
            select: {paymentTermDays: true},
        });

        if (!user) {
            return NextResponse.json({error: 'User not found'}, {status: 404});
        }

        // Calculate due date
        const issuedAtDate = new Date(issuedAt);
        const dueDate = new Date(issuedAtDate);
        dueDate.setDate(dueDate.getDate() + (user.paymentTermDays || 0));

        // Fetch and validate items, including VAT details
        const itemDetails = await prisma.item.findMany({
            where: {
                id: {in: items.map((item: any) => parseInt(item.itemId))},
                itemStatus: 'ACTIVE',
            },
            include: {
                vat: true, // Include VAT details for calculation
            },
        });

        if (itemDetails.length !== items.length) {
            return NextResponse.json({error: 'Some items are inactive or not found'}, {status: 400});
        }

        let totalHT = 0;
        let totalVAT = 0;

        const invoiceDetailsData = items.map((item: any, index: number) => {
            const itemDetail = itemDetails.find((i) => i.id === parseInt(item.itemId));
            if (!itemDetail || !itemDetail.vat) throw new Error('Item not found');

            const unitPrice = parseFloat(itemDetail.retailPrice.toString());
            const vatRate = itemDetail.vat.vatPercent.toNumber() / 100;
            const vatBaseAmount = unitPrice * item.quantity * (1 - item.discount / 100);
            const vatAmount = vatBaseAmount * vatRate;

            totalHT += vatBaseAmount;
            totalVAT += vatAmount;

            return {
                User: {connect: {id: userId}},
                item: {connect: {id: parseInt(item.itemId)}},
                quantity: item.quantity,
                discount: item.discount,
                lineNumber: index + 1,
                unitPrice,
                vatBaseAmount,
                vatAmount,
                totalPrice: vatBaseAmount + vatAmount,
            };
        });

        const totalTTC = totalHT + totalVAT;

        delete invoiceData.id;

        const invoice = await prisma.invoice.create({
            data: {
                ...invoiceData,
                issuedAt: issuedAtDate,
                dueDate,
                totalAmount: totalHT,
                totalVatAmount: totalVAT,
                totalTtcAmount: totalTTC,
                User: {connect: {id: userId}},
                invoiceDetails: {
                    create: invoiceDetailsData,
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
        });

        if(!invoice) {
            return NextResponse.json({error: 'Failed to create invoice'}, {status: 500});
        }

        return NextResponse.json(invoice, {status: 201});
    } catch (error) {
        console.error('Error creating invoice:', error);
        return NextResponse.json({error: 'Failed to create invoice'}, {status: 500});
    }
}
