// path: src/services/dtos/VatDtos.ts

import {CountryDTO} from "@/services/dtos/AddressDtos";

export interface VatDTO {
    id: number;
    countryId: number;
    vatPercent: number;
    country: CountryDTO;
}

export interface VatCreateDTO {
    countryId: number;
    vatPercent: number;
}

export interface VatUpdateDTO {
    countryId?: number;
    vatPercent?: number;
}