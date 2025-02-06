// path: src/services/InvoiceDetailsService.ts


export async function getInvoiceDetailsById(id: number) {
    const response = await fetch(`/api/v1/invoice-details/${id}`);
    return await response.json();
}