import ItemForm from '@/components/dashboard/forms/ItemForm'

export default function EditItemPage({ params }: { params: { id: string } }) {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">Edit Item</h1>
            <ItemForm itemId={parseInt(params.id)} />
        </div>
    )
}

