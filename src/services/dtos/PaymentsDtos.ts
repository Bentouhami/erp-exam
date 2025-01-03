// path: src/services/dtos/PaymentsDtos.ts



export interface PaymentsDTO {
    id: number;
    invoiceId: number;
    paymentDate: Date;
    amount: number;
    paymentModeId: number;
    userId: string;
}