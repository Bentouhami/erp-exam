// path: src/app/api/v1/items/route.ts

import {NextRequest, NextResponse} from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'itemNumber'
    const order = searchParams.get('order') || 'asc'

    try {
        const items = await prisma.item.findMany({
            where: search
                ? {
                    OR: [
                        { itemNumber: { contains: search, mode: 'insensitive' } },
                        { label: { contains: search, mode: 'insensitive' } },
                    ],
                }
                : undefined,
            orderBy: {
                [sort]: order,
            },
        });


        return NextResponse.json(items)
    } catch (error) {
        console.error('Error fetching items:', error)
        return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
    }
}


export async function POST(request: Request) {
    try {
        const body = await request.json();

        const newItem = await prisma.item.create({
            data: {
                itemNumber: body.itemNumber,
                label: body.label,
                description: body.description,
                retailPrice: body.retailPrice,
                purchasePrice: body.purchasePrice,
                vatType: body.vatType,
                unit: { connect: { id: body.unitId } },
                itemClass: { connect: { id: body.classId } }, // Correctly connect item class
                itemTaxes: {
                    create: body.itemTaxes.map((taxId: number) => ({
                        utax: { connect: { id: taxId } },
                        price: 0, // Set a default price or modify as needed
                    })),
                },
            },
        });

        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        console.error('Error creating item:', error);
        return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
    }
}




