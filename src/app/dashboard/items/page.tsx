'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import SearchBar from '@/components/SearchBar'

interface Item {
  id: number
  itemNumber: string
  label: string
  retailPrice: number
  vatType: string
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/items')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const text = await response.text() // Get the response as text first
      console.log('API Response:', text) // Log the raw response
      const data = JSON.parse(text) // Then parse it as JSON
      setItems(data)
      setFilteredItems(data)
      setError(null)
    } catch (e) {
      console.error('Error fetching items:', e)
      setError('Failed to fetch items. Please try again later.')
    }
  }

  const handleSearch = (query: string) => {
    const filtered = items.filter(item => 
      item.itemNumber.toLowerCase().includes(query.toLowerCase()) ||
      item.label.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredItems(filtered)
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Items</h1>
        <Link href="/dashboard/items/new">
          <Button>Add Item</Button>
        </Link>
      </div>
      <SearchBar onSearch={handleSearch} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Number</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Retail Price</TableHead>
            <TableHead>VAT Type</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.itemNumber}</TableCell>
              <TableCell>{item.label}</TableCell>
              <TableCell>${item.retailPrice.toFixed(2)}</TableCell>
              <TableCell>{item.vatType}</TableCell>
              <TableCell className="text-right">
                <Link href={`/src/app/dashboard/items/${item.id}`}>
                  <Button variant="outline" size="sm">Edit</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

