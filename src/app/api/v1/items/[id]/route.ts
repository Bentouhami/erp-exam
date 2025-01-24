// path: src/app/api/v1/items/[id]/route.ts

import {NextRequest, NextResponse} from 'next/server';
import prisma from '@/lib/db';

/**
 * GET a single item by ID
 */

export async function GET(request: NextRequest, {params}: { params: { id: string } }) {

    if (request.method !== 'GET') {
        return new Response('Method not allowed', {status: 405});
    }

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
 * @Route /api/v1/items/:id
 * @Description Update an item
 * @Param id - The ID of the item to update
 * @Body - The updated item data
 * @Success 200 - Successfully updated the item
 * @Failure 404 - Item not found
 * @param request type NextRequest
 * @param params type { params: { id: string } }
 * @returns NextResponse
 */
export async function PUT(request: NextRequest, {params}: { params: { id: string } }) {
    if (request.method !== 'PUT') {
        return new Response('Method not allowed', {status: 405});
    }

    try {
        const body = await request.json();

        console.log('received data from PUT request in path src/app/api/v1/items/[id]/route.ts:', body);

        const updatedItem = await prisma.item.update({
            where: {id: parseInt(params.id)},
            data: {
                itemNumber: body.itemNumber,
                label: body.label,
                description: body.description,
                retailPrice: body.retailPrice,
                purchasePrice: body.purchasePrice,
                vat: {connect: {id: parseInt(body.vatId)}}, // Convert to integer
                unit: {connect: {id: parseInt(body.unitId)}}, // Convert to integer
                itemClass: {connect: {id: parseInt(body.classId)}}, // Convert to integer
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
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {

    if (request.method !== 'DELETE') {
        return new Response('Method not allowed', {status: 405});
    }
    try {
        const itemId = parseInt(params.id);

        // Check if the item is referenced in any InvoiceDetail
        const invoiceDetails = await prisma.invoiceDetail.findMany({
            where: { itemId },
        });

        if (invoiceDetails.length > 0) {
            return NextResponse.json(
                { error: 'Cannot delete item: it is referenced in one or more invoices.' },
                { status: 400 }
            );
        }

        // If no references, proceed with deletion
        await prisma.item.delete({
            where: { id: itemId },
        });

        return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting item:', error);
        return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
    }
}