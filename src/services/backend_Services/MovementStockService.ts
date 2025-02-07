// path: src/services/backend_Services/MovementStockService.ts
import {MovementTypeDTO} from "@/services/dtos/EnumsDtos";
import prisma from "@/lib/db";
import {StockMovementCreateDTO, UpdateStockMovementDTO} from "@/services/dtos/StockMovementDtos";

export async function createStockMovement(data: StockMovementCreateDTO, itemLabel: String)  {
    // switch (data.MovementTypeDTO) to set the right description
    switch (data.movementType) {
        case "PURCHASE":
            data.description = `"${itemLabel}" Item(s) added to stock`;
            break;
        case "SALE":
            data.description = `Item(s) ${itemLabel} sold`;
            break;
        case "RETURN":
            data.description = `Item(s) ${itemLabel} returned`;
            break;
        default:
            data.description = `Item(s) ${itemLabel} added to stock`;
            break;
    }

    return await prisma.stockMovement.create({
        data,
    });
}

export async function getStockMovements(userId: string, itemId: number, movementType: MovementTypeDTO) {
    return await prisma.stockMovement.findMany({
        where: {
            userId,
            itemId,
            movementType,
        },
    });
}

export async function getStockMovementById(id: number) {
    return await prisma.stockMovement.findUnique({
        where: {
            id,
        },
    });
}

export async function getStockMovement() {
    return await prisma.stockMovement.findMany(
        {
            select: {
                id: true,
                itemId: true,
                userId: true,
                date: true,
                quantity: true,
                movementType: true,
                description: true,
                item: {
                    select: {
                        id: true,
                        label: true,
                        retailPrice: true,
                        stockQuantity: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        userNumber: true,
                        email: true,
                        phone: true,
                        role: true,
                    },
                },
            },
            orderBy: {
                date: "desc",
            },
        }
    );
}


export async function deleteStockMovement(id: number) {
    return await prisma.stockMovement.delete({
        where: {
            id,
        },
    });
}