'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Item {
  id?: number
  itemNumber: string
  label: string
  description: string
  retailPrice: number
  vatType: string
}

export default function ItemForm({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [item, setItem] = useState<Item>({
    itemNumber: '',
    label: '',
    description: '',
    retailPrice: 0,
    vatType: '',
  })

  useEffect(() => {
    if (params.id !== 'new') {
      fetchItem()
    }
  }, [params.id])

  const fetchItem = async () => {
    const response = await fetch(`/api/items/${params.id}`)
    const data = await response.json()
    setItem(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = params.id === 'new' ? '/api/items' : `/api/items/${params.id}`
    const method = params.id === 'new' ? 'POST' : 'PUT'

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    })

    if (response.ok) {
      router.push('/items')
    } else {
      // Handle error
      console.error('Failed to save item')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setItem(prev => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-2xl font-bold">{params.id === 'new' ? 'Add Item' : 'Edit Item'}</h1>
      <div>
        <Label htmlFor="itemNumber">Item Number</Label>
        <Input id="itemNumber" name="itemNumber" value={item.itemNumber} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="label">Label</Label>
        <Input id="label" name="label" value={item.label} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input id="description" name="description" value={item.description} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="retailPrice">Retail Price</Label>
        <Input id="retailPrice" name="retailPrice" type="number" step="0.01" value={item.retailPrice} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="vatType">VAT Type</Label>
        <Select name="vatType" value={item.vatType} onValueChange={(value) => setItem(prev => ({ ...prev, vatType: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select VAT Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="REDUCED">Reduced (6%)</SelectItem>
            <SelectItem value="STANDARD">Standard (21%)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Save Item</Button>
    </form>
  )
}

