import { InvoiceForm } from "@/components/InvoiceForm"

export default function InvoicePage({ params }: { params: { id: string } }) {
    const isNew = params.id === 'new'
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">
                {isNew ? 'Create New Invoice' : `Edit Invoice ${params.id}`}
            </h2>
            <InvoiceForm id={isNew ? null : params.id} />
        </div>
    )
}

