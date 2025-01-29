import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { generateItemNumber } from '@/lib/utils/item';

// Utility function for validation
const validateItemData = (data: any) => {
    const errors = [];
    if (!data.label) errors.push('Label is required.');
    if (!data.retailPrice || isNaN(data.retailPrice)) errors.push('Retail price must be a valid number.');
    if (!data.purchasePrice || isNaN(data.purchasePrice)) errors.push('Purchase price must be a valid number.');
    if (!data.vatId) errors.push('VAT ID is required.');
    if (!data.unitId) errors.push('Unit ID is required.');
    if (!data.classId) errors.push('Class ID is required.');
    return errors;
};

export async function GET(request: NextRequest) {

    if (request.method !== 'GET') {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
    }
    const search = request.nextUrl.searchParams.get('search');
    const sort = request.nextUrl.searchParams.get('sort') || 'itemNumber';
    const order = request.nextUrl.searchParams.get('order') || 'asc';

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
            include: {
                vat: true,
                unit: true,
                itemClass: true,
            },
        });

        // console.log('Fetched items:', items);

        const formattedItems = items.map((item) => ({
            ...item,
            retailPrice: Number(item.retailPrice),
            purchasePrice: Number(item.purchasePrice),
        }));

        return NextResponse.json(formattedItems);
    } catch (error) {
        // Narrow the type of `error` to log meaningful details
        if (error instanceof Error) {
            console.error('Error fetching items:', error.message);
        } else {
            console.error('Unknown error occurred while fetching items:', error);
        }
        return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
    }
}
export async function POST(request: NextRequest) {
    if (request.method !== 'POST') {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
    }

    try {
        const body = await request.json();

        console.log("log ===> received data from POST request in path src/app/api/v1/items/route.ts:", body);

        // Validate incoming data
        const validationErrors = validateItemData(body);
        if (validationErrors.length > 0) {
            return NextResponse.json({ errors: validationErrors }, { status: 400 });
        }

        // Generate item number if not provided
        if (!body.itemNumber) {
            body.itemNumber = await generateItemNumber();
        }

        // Parse IDs to integers
        const vatId = parseInt(body.vatId, 10);
        const unitId = parseInt(body.unitId, 10);
        const classId = parseInt(body.classId, 10);

        // Fetch related records to ensure validity
        const vat = await prisma.vat.findUnique({
            where: { id: vatId },
        });
        const unit = await prisma.unit.findUnique({
            where: { id: unitId },
        });
        const itemClass = await prisma.itemClass.findUnique({
            where: { id: classId },
        });

        if (!vat || !unit || !itemClass) {
            return NextResponse.json({ error: 'Invalid vatId, unitId, or classId' }, { status: 400 });
        }

        console.log("log ===> after deleting countryId, vatId, unitId, classId from the body:", body);

        // Create the new item
        const newItem = await prisma.item.create({
            data: {
                itemNumber: body.itemNumber,
                label: body.label,
                description: body.description,
                retailPrice: body.retailPrice,
                purchasePrice: body.purchasePrice,
                stockQuantity: body.stockQuantity || 0,
                minQuantity: body.minQuantity || 0,
                vat: {
                    connect: { id: vat.id },
                },
                unit: {
                    connect: { id: unit.id },
                },
                itemClass: {
                    connect: { id: itemClass.id },
                },
            },
        });

        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating item:', error.message);
        } else {
            console.error('Unknown error occurred while creating item:', error);
        }
        return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
    }
}
