// path: src/services/dtos/UtaxDtos.ts

import {ItemTaxDTO} from "@/services/dtos/ItemTaxDtos";

export interface UtaxDTO {
    id: number;
    label: string;
    itemTaxes: ItemTaxDTO[];
}

export interface UtaxCreateDTO {
    label: string;
}

export interface UtaxUpdateDTO {
    label?: string;
}