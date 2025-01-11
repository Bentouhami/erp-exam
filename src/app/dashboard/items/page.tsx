// path: src/app/dashboard/items/page.tsx

import ItemList from '@/components/ItemList'

export default function ItemsPage() {
  return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-5">Items</h1>
        <ItemList />
      </div>
  )
}

