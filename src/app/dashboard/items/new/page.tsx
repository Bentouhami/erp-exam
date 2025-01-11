import ItemForm from '@/components/dashboard/forms/ItemForm'

export default function NewItemPage() {
  return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-5">Create New Item</h1>
        <ItemForm />
      </div>
  )
}

