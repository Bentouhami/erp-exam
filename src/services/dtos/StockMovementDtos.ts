// path: src/services/dtos/StockMovementDtos.ts

import {ItemDTO} from "@/services/dtos/ItemDtos";
import {UserDTO} from "@/services/dtos/UserDtos";
import {MovementTypeDTO} from "@/services/dtos/EnumsDtos";

export interface StockMovementDTO {
    id: number;
    itemId: number;
    userId: string;
    date: Date;
    quantity: number;
    MovementTypeDTO: MovementTypeDTO;
    description?: string;
    item: ItemDTO;
    user: UserDTO;
}

export interface StockMovementCreateDTO {
    itemId: number;
    userId: string;
    date: Date;
    quantity: number;
    MovementTypeDTO: MovementTypeDTO;
    description?: string;
}