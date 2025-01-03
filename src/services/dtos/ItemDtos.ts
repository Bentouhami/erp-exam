// path: src/services/dtos/ItemDtos.ts

import {InvoiceDetailsDTO} from "@/services/dtos/InvoiceDetailsDtos";
import {UnitDTO} from "@/services/dtos/UnitDtos";
import {VatType} from "@/services/dtos/EnumsDtos";
import {StockMovementDTO} from "@/services/dtos/StockMovementDtos";
import {ItemClassDTO} from "@/services/dtos/ItemClassDtos";
import {ItemTaxDTO} from "@/services/dtos/ItemTaxDtos";

export interface ItemDTO {
    id: number;
    itemNumber: string;
    supplierReference?: string;
    barcode?: string;
    label: string;
    description?: string;
    purchasePrice: number;
    retailPrice: number;
    stockQuantity: number;
    minQuantity: number;
    unitId: number;
    classId: number;
    vatType: VatType;
    unit: UnitDTO;
    itemClass: ItemClassDTO;
    stockMovements: StockMovementDTO[];
    invoiceDetails: InvoiceDetailsDTO[];
    itemTaxes: ItemTaxDTO[];
}
//
// export interface ItemCreateDTO extends Required<Omit<ItemDTO, "id">> {
//
// }

export interface  ItemCreateDTO  {
    itemNumber: string;
    supplierReference?: string;
    barcode?: string;
    label: string;
    description?: string;
    purchasePrice: number;
    retailPrice: number;
    stockQuantity: number;
    minQuantity: number;
    unitId: number;
    classId: number;
    vatType: VatType;
}

export interface ItemUpdateDTO extends Partial<Omit<ItemDTO, "id">> {
    id: number;
}
