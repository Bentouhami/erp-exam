// path: src/services/backend_Services/ItemService.ts
import prisma from "@/lib/db";
import {ItemStatusDTO} from "@/services/dtos/EnumsDtos";


export async function setItemStatus(id: number, status: ItemStatusDTO) {
    return await prisma.item.update({
        where: {
            id,
        },
        data: {
            itemStatus: status,
        },
    });
}
