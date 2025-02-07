// path: src/app/api/v1/items/route.ts

import {NextRequest, NextResponse} from 'next/server';
import prisma from "@/lib/db";
import {generateItemNumber} from '@/lib/utils/item';
import {accessControlHelper} from "@/lib/utils/accessControlHelper";
import {checkAuthStatus, getCurrentUserId} from "@/lib/utils/auth-helper";
import {createStockMovement} from "@/services/backend_Services/MovementStockService";
import {ItemStatusDTO, MovementTypeDTO} from "@/services/dtos/EnumsDtos";

// Utility function for validation
const validateItemData = (data: any) => {
    const errors = [];
    if (!data.label) errors.push('Label is required.');
    if (!data.retailPrice || isNaN(data.retailPrice)) errors.push('Retail price must be a valid number.');
    if (!data.purchasePrice || isNaN(data.purchasePrice)) errors.push('Purchase price must be a valid number.');
    if (!data.unitId) errors.push('Unit ID is required.');
    if (!data.classId) errors.push('Class ID is required.');
    if (!data.stockQuantity || isNaN(data.stockQuantity)) errors.push('Stock quantity must be a valid number.');
    if (!data.minQuantity || isNaN(data.minQuantity)) errors.push('Minimum quantity must be a valid number.');
    if(!data.supplierReference) errors.push('Supplier reference is required.');

    return errors;
};

export async function GET(request: NextRequest) {

    if (request.method !== 'GET') {
        return NextResponse.json({error: 'Method not allowed'}, {status: 405})
    }

    const {isAuthenticated, role} = await checkAuthStatus();
    if (!isAuthenticated) return NextResponse.json({error: 'You must be connected.'}, {status: 401});
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') return NextResponse.json({error: 'You must be an admin.'}, {status: 401});

    const search = request.nextUrl.searchParams.get('search');
    const sort = request.nextUrl.searchParams.get('sort') || 'itemNumber';
    const order = request.nextUrl.searchParams.get('order') || 'asc';

    try {
        const items = await prisma.item.findMany({
            where: {
                itemStatus: 'ACTIVE', // Only return active items
                ...(search
                    ? {
                        OR: [
                            { itemNumber: { contains: search, mode: 'insensitive' } },
                            { supplierReference: { contains: search, mode: 'insensitive' } },
                            { label: { contains: search, mode: 'insensitive' } },
                            { description: { contains: search, mode: 'insensitive' } },
                        ],
                    }
                    : {}),
            },
            orderBy: {
                [sort]: order,
            },
            include: {
                unit: true,
                itemClass: true,
            },
        });


        const formattedItems = items.map((item) => ({
            ...item,
            retailPrice: Number(item.retailPrice),
            purchasePrice: Number(item.purchasePrice),
        }));
        console.log("log ====> formattedItems:", formattedItems);

        return NextResponse.json(formattedItems);
    } catch (error) {
        // Narrow the type of `error` to log meaningful details
        if (error instanceof Error) {
            console.error('Error fetching items:', error.message);
        } else {
            console.error('Unknown error occurred while fetching items:', error);
        }
        return NextResponse.json({error: 'Failed to fetch items'}, {status: 500});
    }
}

export async function POST(request: NextRequest) {
    if (request.method !== 'POST') {
        return NextResponse.json({error: 'Method not allowed'}, {status: 405})
    }
    const { isAuthenticated , userId, email, role } = await checkAuthStatus();
    if (!isAuthenticated) return NextResponse.json({error: 'You must be connected.'}, {status: 401});
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') return NextResponse.json({error: 'You must be an admin.'}, {status: 401});

    // check the admin exists
    const admin = await prisma.user.findUnique({
        where: {
            id: userId,
            email: email,
        },
    });

    if(!admin) return NextResponse.json({error: 'Admin not found'}, {status: 401});

    if (!accessControlHelper) {
        return NextResponse.json({error: 'Access denied'}, {status: 403})
    }

    try {
        const body = await request.json();

        console.log("log ===> received data from POST request in path src/app/api/v1/items/route.ts:", body);

        // Validate incoming data
        const validationErrors = validateItemData(body);
        if (validationErrors.length > 0) {
            return NextResponse.json({errors: validationErrors}, {status: 400});
        }

        // Generate item number if not provided
        if (!body.itemNumber) {
            body.itemNumber = await generateItemNumber();
        }

        // Parse IDs to integers
        const unitId = parseInt(body.unitId, 10);
        const classId = parseInt(body.classId, 10);

        // Fetch related records to ensure validity
        const unit = await prisma.unit.findUnique({
            where: {id: unitId},
        });
        const itemClass = await prisma.itemClass.findUnique({
            where: {id: classId},
        });

        if (!unit || !itemClass) {
            console.log("log ===> invalid unitId or classId");
            return NextResponse.json({error: 'Invalid unitId or classId'}, {status: 400});
        }

        console.log("log ===> after deleting countryId, vatId, unitId, classId from the body:", body);


        // Create the new item
        const newItem = await prisma.item.create({
            data: {
                itemNumber: body.itemNumber,
                supplierReference: body.supplierReference,
                label: body.label,
                description: body.description,
                retailPrice: body.retailPrice,
                purchasePrice: body.purchasePrice,
                stockQuantity: body.stockQuantity || 0,
                minQuantity: body.minQuantity || 0,
                unit: {
                    connect: {id: unit.id},
                },
                itemClass: {
                    connect: {id: itemClass.id},
                },
            },
        });

        if (!newItem) {
            console.log("log ====> no item created is POST method");

            return NextResponse.json({error: 'Failed to create item'}, {status: 500});
        }


        const StockMovementCreateDTO = {
            itemId : newItem.id,
            userId : admin.id,
            quantity : newItem.stockQuantity,
            movementType: MovementTypeDTO.PURCHASE,
            date : new Date()
        };

        await  createStockMovement(StockMovementCreateDTO, newItem.label);

        return NextResponse.json(newItem, {status: 201});
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating item:', error.message);
        } else {
            console.error('Unknown error occurred while creating item:', error);
        }
        return NextResponse.json({error: 'Failed to create item'}, {status: 500});
    }
}
