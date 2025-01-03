export function InvoiceDetails({ invoiceId }: { invoiceId: string }) {
    return (
        <div>
            <h3 className="text-xl font-semibold mb-2">Invoice Details</h3>
            <p>Invoice ID: {invoiceId}</p>
            {/* Add more invoice details here */}
        </div>
    )
}

