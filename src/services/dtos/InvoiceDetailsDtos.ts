// path: src/services/dtos/InvoiceDetailsDtos.ts

import {InvoiceDTO} from "@/services/dtos/InvoiceDtos";
import {UserDTO} from "@/services/dtos/UserDtos";
import {ItemDTO} from "@/services/dtos/ItemDtos";

export interface InvoiceDetailsDTO {
    id: number;
    invoiceId: number;
    itemId: number;
    lineNumber: number;
    quantity: number;
    unitPrice: number;
    vatBaseAmount: number;
    vatAmount: number;
    totalAmount: number;
    userId: string;
    invoice: InvoiceDTO;
    item: ItemDTO;
    user: UserDTO;

}

