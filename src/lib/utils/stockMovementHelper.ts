// path: src/lib/utils/stockMovementHelper.ts
import {StockMovement} from "@prisma/client";
import {MovementTypeDTO} from "@/services/dtos/EnumsDtos";

export function getStockMovementTypeLabel(type: StockMovement["movementType"]): string {
    switch (type) {
        case "PURCHASE":
            return "Purchase";
        case "SALE":
            return "Sale";
        case "RETURN":
            return "Return";
        default:
            return "Unknown";
    }
}

export function getStockMovementTypeColor(type: StockMovement["movementType"]): string {
    switch (type) {
        case "PURCHASE":
            return "bg-green-500";
        case "SALE":
            return "bg-red-500";
        case "RETURN":
            return "bg-yellow-500";
        default:
            return "bg-gray-500";
    }
}


