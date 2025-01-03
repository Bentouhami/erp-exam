// path: src/services/dtos/InvoiceDtos.ts

import {InvoiceDetailsDTO} from "@/services/dtos/InvoiceDetailsDtos";
import {PaymentsDTO} from "@/services/dtos/PaymentsDtos";

export interface InvoiceDTO {
    id: number;
    userId: string;
    invoiceNumber: string;
    issuedAt: Date;
    dueDate: Date;
    flag_accounting: boolean;
    totalAmount: number;
    totalVatAmount: number;
    totalTtcAmount: number;
    invoiceDetails: InvoiceDetailsDTO[];
    payments: PaymentsDTO[];
}

export interface InvoiceCreateDTO extends Omit<InvoiceDTO, "id" | "userId"> {
    userId: string;
}

export interface InvoiceUpdateDTO extends Partial<Omit<InvoiceDTO, "id">> {
    id: number;
}

