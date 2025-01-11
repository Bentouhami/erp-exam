// Path: src/components/ItemList.tsx

'use client'

import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Skeleton} from "@/components/ui/skeleton"
import {ArrowUpDown, MoreHorizontal, Plus} from 'lucide-react'
import {toast} from 'react-toastify'
import axios from "axios";
import {API_DOMAIN, DOMAIN} from "@/lib/utils/constants";

type Item = {
    id: number
    itemNumber: string
    label: string
    description: string
    retailPrice: number
    vatType: 'REDUCED' | 'STANDARD' | 'EXEMPT'
}

type SortConfig = {
    key: keyof Item
    direction: 'asc' | 'desc'
}

export default function ItemList() {
    const [items, setItems] = useState<Item[]>([])
    const [filteredItems, setFilteredItems] = useState<Item[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [sortConfig, setSortConfig] = useState<SortConfig>({key: 'itemNumber', direction: 'asc'})
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetchItems()
    }, [])

    useEffect(() => {
        const filtered = items.filter(item =>
            item.itemNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredItems(filtered)
    }, [searchTerm, items])

    const fetchItems = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${API_DOMAIN}/items`)
            if (response.status !== 200 || !response.data) {
                throw new Error('Failed to fetch items')
            }
            const data = await response.data
            setItems(data)
            setFilteredItems(data)
        } catch (error) {
            console.error('Error fetching items:', error)
            toast.error('Failed to fetch items')
        } finally {
            setLoading(false)
        }
    }

    const handleSort = (key: keyof Item) => {
        let direction: 'asc' | 'desc' = 'asc'
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({key, direction})

        const sortedItems = [...filteredItems].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
            return 0
        })
        setFilteredItems(sortedItems)
    }

    const handleAddItem = () => {
        router.push(`${DOMAIN}/dashboard/items/new`)
    }

    const handleEditItem = (itemId: number) => {
        router.push(`${DOMAIN}/dashboard/items/${itemId}/edit`)
    }

    const handleDeleteItem = async (itemId: number) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                const response = await axios.delete(`${API_DOMAIN}/items/${itemId}`)
                if (response.status !== 200 || !response.data) {
                    throw new Error('Failed to delete item')
                }
                toast.success('Item deleted successfully')
                fetchItems()
            } catch (error) {
                console.error('Error deleting item:', error)
                toast.error('Failed to delete item')
            }
        }
    }

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-[250px]"/>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]"><Skeleton className="h-4 w-[100px]"/></TableHead>
                            <TableHead><Skeleton className="h-4 w-[100px]"/></TableHead>
                            <TableHead><Skeleton className="h-4 w-[100px]"/></TableHead>
                            <TableHead><Skeleton className="h-4 w-[100px]"/></TableHead>
                            <TableHead className="text-right"><Skeleton className="h-4 w-[100px]"/></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(5)].map((_, index) => (
                            <TableRow key={index}>
                                <TableCell><Skeleton className="h-4 w-[100px]"/></TableCell>
                                <TableCell><Skeleton className="h-4 w-[100px]"/></TableCell>
                                <TableCell><Skeleton className="h-4 w-[100px]"/></TableCell>
                                <TableCell><Skeleton className="h-4 w-[100px]"/></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-4 w-[100px]"/></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
                <Button onClick={handleAddItem}>
                    <Plus className="mr-2 h-4 w-4"/> Add Item
                </Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">
                            <Button variant="ghost" onClick={() => handleSort('itemNumber')}>
                                Item Number
                                <ArrowUpDown className="ml-2 h-4 w-4"/>
                            </Button>
                        </TableHead>
                        <TableHead>
                            <Button variant="ghost" onClick={() => handleSort('label')}>
                                Label
                                <ArrowUpDown className="ml-2 h-4 w-4"/>
                            </Button>
                        </TableHead>
                        <TableHead>
                            <Button variant="ghost" onClick={() => handleSort('retailPrice')}>
                                Retail Price
                                <ArrowUpDown className="ml-2 h-4 w-4"/>
                            </Button>
                        </TableHead>
                        <TableHead>
                            <Button variant="ghost" onClick={() => handleSort('vatType')}>
                                VAT Type
                                <ArrowUpDown className="ml-2 h-4 w-4"/>
                            </Button>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredItems.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.itemNumber}</TableCell>
                            <TableCell>{item.label}</TableCell>
                            <TableCell>{item.retailPrice} €</TableCell>
                            <TableCell>{item.vatType}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4"/>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => handleEditItem(item.id)}>
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuItem onClick={() => handleDeleteItem(item.id)}>
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
