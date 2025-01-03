// path: src/services/dtos/ItemClassDtos.ts

import {ItemDTO} from "@/services/dtos/ItemDtos";

export interface ItemClassDTO {
    id: number;
    label: string;
    items: ItemDTO[];
}

export interface ItemClassCreateDTO {
    label: string;
}

export interface ItemClassUpdateDTO {
    label?: string;
}