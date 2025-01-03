// path: src/services/dtos/UnitDtos.ts


import {ItemDTO} from "@/services/dtos/ItemDtos";

export interface UnitDTO {
    id: number;
    name: string;
    items?: ItemDTO[];
}

export interface UnitCreateDTO {
    name: string;
}

export interface UnitUpdateDTO {
    name?: string;
}



