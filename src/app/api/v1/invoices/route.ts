// Path: src/app/api/v1/invoices/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import {decrypt} from "@/lib/security/security";


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'issuedAt'
    const order = searchParams.get('order') || 'desc'

    try {
        const invoices = await prisma.invoice.findMany({
            where: search
                ? {
                    OR: [
                        { invoiceNumber: { contains: search, mode: 'insensitive' } },
                        { User: { name: { contains: search, mode: 'insensitive' } } },
                        { User: { userNumber: { contains: search, mode: 'insensitive' } } },
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

        // decrypt data before sending it to the client
        invoices.forEach(invoice => {
            invoice.User.name = decrypt(invoice.User?.name!)
        })

        return NextResponse.json(invoices)
    } catch (error) {
        console.error('Error fetching invoices:', error)
        return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    if (request.method !== 'POST') {
        return NextResponse.json({ error: 'Invalid method' }, { status: 405 });
    }

    try {
        const body = await request.json();
        const { userId, items, issuedAt, dueDate, ...invoiceData } = body;

        // Convert issuedAt and dueDate to Date objects
        const issuedAtDate = new Date(issuedAt);
        const dueDateDate = new Date(dueDate);

        console.log('userId:', userId);

        // Fetch item details to calculate totals
        const itemDetails = await prisma.item.findMany({
            where: {
                id: { in: items.map((item: any) => parseInt(item.itemId)) },
            },
        });

        let totalAmount = 0;
        let totalVatAmount = 0;

        const invoiceDetailsData = items.map((item: any, index: number) => {
            const itemDetail = itemDetails.find((i) => i.id === parseInt(item.itemId));
            if (!itemDetail) throw new Error('Item not found');

            const unitPrice = itemDetail.retailPrice.toNumber();
            const vatRate = itemDetail.vatType === 'REDUCED' ? 0.06 : 0.21;
            const vatBaseAmount = unitPrice * item.quantity * (1 - item.discount / 100);
            const vatAmount = vatBaseAmount * vatRate;
            const totalPrice = vatBaseAmount + vatAmount;

            totalAmount += vatBaseAmount;
            totalVatAmount += vatAmount;

            return {
                item: { connect: { id: parseInt(item.itemId) } },
                quantity: item.quantity,
                discount: item.discount,
                lineNumber: index + 1, // Line number starts from 1
                unitPrice,
                vatBaseAmount,
                vatAmount,
                totalPrice,
            };
        });

        const totalTtcAmount = totalAmount + totalVatAmount;

        // Create the invoice with pre-calculated totals and invoice details
        const invoice = await prisma.invoice.create({
            data: {
                ...invoiceData,
                issuedAt: issuedAtDate,
                dueDate: dueDateDate,
                totalAmount,
                totalVatAmount,
                totalTtcAmount,
                User: { connect: { id: userId } },
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

        return NextResponse.json(invoice, { status: 201 });
    } catch (error) {
        console.error('Error creating invoice:', error);
        return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
    }
}


