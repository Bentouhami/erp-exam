// path: src/services/dtos/ItemTaxDtos.ts

import {ItemDTO} from "@/services/dtos/ItemDtos";
import {UtaxDTO} from "@/services/dtos/UtaxDtos";

export interface ItemTaxDTO {
    id: number;
    itemId: number;
    utaxId: number;
    price: number;
    item: ItemDTO;
    utax: UtaxDTO;
}

export interface ItemTaxCreateDTO {
    itemId: number;
    utaxId: number;
    price: number;
}

export interface ItemTaxUpdateDTO {
    price?: number;
}