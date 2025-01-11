// Path: src/app/dashboard/invoices/[id]/edit/page.tsx

import InvoiceForm from '@/components/dashboard/forms/InvoiceForm'

export default function EditInvoicePage({ params }: { params: { id: string } }) {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">Edit Invoice</h1>
            <InvoiceForm invoiceId={parseInt(params.id)} />
        </div>
    )
}

