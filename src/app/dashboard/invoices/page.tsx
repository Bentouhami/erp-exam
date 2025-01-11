import InvoiceList from '@/components/InvoiceList'

export default function InvoicesPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">Invoices</h1>
            <InvoiceList />
        </div>
    )
}

