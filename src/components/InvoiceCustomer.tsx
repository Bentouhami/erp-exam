export function InvoiceCustomer({ invoiceId }: { invoiceId: string }) {
    return (
        <div>
            <h3 className="text-xl font-semibold mb-2">Customer Information</h3>
            <p>Customer for Invoice ID: {invoiceId}</p>
            {/* Add customer details here */}
        </div>
    )
}

