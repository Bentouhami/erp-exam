// path: src/app/api/v1/items/[id]/route.ts

import {NextRequest, NextResponse} from 'next/server';
import prisma from "@/lib/db";
import {checkAuthStatus} from "@/lib/utils/auth-helper";
import {ItemStatusDTO, MovementTypeDTO} from "@/services/dtos/EnumsDtos";
import {createStockMovement} from "@/services/backend_Services/MovementStockService";
import {setItemStatus} from "@/services/backend_Services/ItemService";

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
    const {isAuthenticated, userId, email, role} = await checkAuthStatus();
    if (!isAuthenticated) return NextResponse.json({error: 'You must be connected.'}, {status: 401});
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') return NextResponse.json({error: 'You must be an admin.'}, {status: 401});


    try {
        const body = await request.json();

        console.log("log ====> data received in PUT function for item: ", body)
        // get current item from db before updating
        const item = await prisma.item.findUnique({
            where: {id: parseInt(params.id)},
            select: {
                id: true,
                stockQuantity: true,
            }
        });

        if (!item) return NextResponse.json({error: 'Item not found'}, {status: 401});

        // update the item
        const updatedItem = await prisma.item.update({
            where: {id: parseInt(params.id)},
            data: {
                itemNumber: body.itemNumber,
                label: body.label,
                description: body.description,
                retailPrice: body.retailPrice,
                purchasePrice: body.purchasePrice,
                unit: {connect: {id: parseInt(body.unitId)}}, // Convert to integer
                itemClass: {connect: {id: parseInt(body.classId)}}, // Convert to integer
                itemTaxes: {
                    deleteMany: {}, // Clear existing item taxes
                    create: body.itemTaxes.map((taxId: number) => ({
                        utax: {connect: {id: taxId}},
                        price: 0,
                    })),
                },
                stockQuantity: body.stockQuantity,
                minQuantity: body.minQuantity
            },
        });

        if (!updatedItem) return NextResponse.json({error: 'Item not found'}, {status: 401});

        if (!userId) {
            return NextResponse.json({error: 'You are not authorized to update this item'}, {status: 401});
        }

        // get the movement type
        let currentStockMovementType: MovementTypeDTO = MovementTypeDTO.SALE;
        if (body.stockQuantity > item.stockQuantity) {
            currentStockMovementType = MovementTypeDTO.PURCHASE;
        } else if (body.stockQuantity < item.stockQuantity) {
            currentStockMovementType = MovementTypeDTO.SALE;
        }

        // create the stock movement
        const StockMovementCreateDTO = {
            itemId: updatedItem.id,
            userId,
            quantity: updatedItem.stockQuantity,
            movementType: currentStockMovementType,
            date: new Date()
        };

        const createdStockMovement = createStockMovement(StockMovementCreateDTO, updatedItem.label);


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

    if (request.method !== 'DELETE') {
        return new Response('Method not allowed', {status: 405});
    }
    const {isAuthenticated, userId, email, role} = await checkAuthStatus();
    if (!isAuthenticated) return NextResponse.json({error: 'You must be connected.'}, {status: 401});
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') return NextResponse.json({error: 'You must be an admin.'}, {status: 401});


    try {
        const itemId = parseInt(params.id);
        // check if the admin or super admin is deleting the item
        const admin = await prisma.user.findUnique({
            where: {
                id: userId,
                email: email,
            },
        });

        if (!admin) return NextResponse.json({error: 'Admin not found'}, {status: 401});

        if (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN') return NextResponse.json({error: 'You must be an admin.'}, {status: 401});

        // check if the item exists
        const item = await prisma.item.findUnique({
            where: {id: itemId}
        });

        if (!item) return NextResponse.json({error: 'Item not found'}, {status: 401});

        // If no references, proceed with deletion
        const setInactiveItem = await setItemStatus(itemId, ItemStatusDTO.INACTIVE);

        if (!setInactiveItem) return NextResponse.json({error: 'Failed to set item status to inactive'}, {status: 500});

        return NextResponse.json({message: 'Item is now inactive'}, {status: 200});

    } catch (error) {
        console.error('Error deleting item:', error);
        return NextResponse.json({error: 'Failed to delete item'}, {status: 500});
    }
}