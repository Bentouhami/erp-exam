export function InvoiceProducts({ invoiceId }: { invoiceId: string }) {
    return (
        <div>
            <h3 className="text-xl font-semibold mb-2">Products</h3>
            <p>Products for Invoice ID: {invoiceId}</p>
            {/* Add product list or table here */}
        </div>
    )
}

