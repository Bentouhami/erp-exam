// path: src/app/api/v1/items/[id]/route.ts

import {NextRequest, NextResponse} from 'next/server';
import prisma from '@/lib/db';

/**
 * GET a single item by ID
 */
export async function GET(request: NextRequest, {params}: { params: { id: string } }) {
    try {
        const item = await prisma.item.findUnique({
            where: {id: parseInt(params.id)},
            include: {
                vat: true,
                unit: true,
                itemClass: true,
                itemTaxes: {include: {utax: true}},
            },
        });

        if (!item) {
            return NextResponse.json({error: 'Item not found'}, {status: 404});
        }

        return NextResponse.json(item, {status: 200});
    } catch (error) {
        console.error('Error fetching item:', error);
        return NextResponse.json({error: 'Failed to fetch item'}, {status: 500});
    }
}

/**
 * PUT to update an existing item by ID
 */
export async function PUT(request: NextRequest, {params}: { params: { id: string } }) {
    try {
        const body = await request.json();

        const updatedItem = await prisma.item.update({
            where: {id: parseInt(params.id)},
            data: {
                itemNumber: body.itemNumber,
                label: body.label,
                description: body.description,
                retailPrice: body.retailPrice,
                purchasePrice: body.purchasePrice,
                vat: {connect: {id: body.vatId}}, // Connect to the appropriate VAT
                unit: {connect: {id: body.unitId}},
                itemClass: {connect: {id: body.classId}},
                itemTaxes: {
                    deleteMany: {}, // Clear existing item taxes
                    create: body.itemTaxes.map((taxId: number) => ({
                        utax: {connect: {id: taxId}},
                        price: 0,
                    })),
                },
            },
        });

        return NextResponse.json(updatedItem, {status: 200});
    } catch (error) {
        console.error('Error updating item:', error);
        return NextResponse.json({error: 'Failed to update item'}, {status: 500});
    }
}

/**
 * DELETE an item by ID
 */
export async function DELETE(request: NextRequest, {params}: { params: { id: string } }) {
    try {
        await prisma.item.delete({
            where: {id: parseInt(params.id)},
        });

        return NextResponse.json({message: 'Item deleted successfully'}, {status: 200});
    } catch (error) {
        console.error('Error deleting item:', error);
        return NextResponse.json({error: 'Failed to delete item'}, {status: 500});
    }
}
