// path: src/components/ItemList.tsx

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {ArrowUpDown, MoreHorizontal, Plus} from 'lucide-react';
import {toast, ToastContainer} from 'react-toastify';
import axios from 'axios';
import RequireAuth from '@/components/auth/RequireAuth';
import {ListSkeleton} from '@/components/skeletons/ListSkeleton';
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {API_DOMAIN} from "@/lib/utils/constants";

type Item = {
    id: number;
    itemNumber: string;
    supplierReference: string;
    label: string;
    description: string;
    retailPrice: number;
    purchasePrice: number;
    unit: {
        id: number;
        name: string;
    };
    itemClass: {
        id: number;
        label: string;
    };
    stockQuantity: number;
    minQuantity: number;
};

type SortConfig = {
    key: keyof Item;
    direction: 'asc' | 'desc';
};

export default function ItemList() {
    const [items, setItems] = useState<Item[]>([]);
    const [filteredItems, setFilteredItems] = useState<Item[]>([]);
    const [supplierReference, setSupplierReference] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    // const [selectedVat, setSelectedVat] = useState<string>('');
    const [selectedUnit, setSelectedUnit] = useState<string>('');
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [priceRange, setPriceRange] = useState({min: 0, max: 1000});
    const [sortConfig, setSortConfig] = useState<SortConfig>({key: 'itemNumber', direction: 'asc'});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchTerm, selectedUnit, selectedClass, priceRange, sortConfig, items]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_DOMAIN}/items`);
            if (response.status !== 200 || !response.data) {
                throw new Error('Failed to fetch items');
            }
            setItems(response.data);
            setFilteredItems(response.data);
        } catch (error) {
            if (typeof window !== 'undefined') {
                console.error('Error fetching items:', error);
                toast.error('Failed to fetch items');
            }
        } finally {
            setLoading(false);
        }
    };


    const applyFilters = () => {
        let filtered = [...items];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (item) =>
                    item.itemNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.supplierReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply Unit filter
        if (selectedUnit) {
            filtered = filtered.filter((item) => item.unit.id.toString() === selectedUnit);
        }

        // Apply Class filter
        if (selectedClass) {
            filtered = filtered.filter((item) => item.itemClass.id.toString() === selectedClass);
        }

        // Apply price range filter
        filtered = filtered.filter(
            (item) => item.retailPrice >= priceRange.min && item.retailPrice <= priceRange.max
        );

        // Apply sorting
        filtered = filtered.sort((a, b) => {
            const {key, direction} = sortConfig;
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setFilteredItems(filtered);
    };

    const handleSort = (key: keyof Item) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({key, direction});
    };

    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleAddItem = () => {
        router.push(`/dashboard/items/new`);
    };

    const handleEditItem = (itemId: number) => {
        router.push(`/dashboard/items/${itemId}/edit`);
    };

    const handleDeleteItem = async (itemId: number) => {
        {
            console.log("log ====> itemId in handleDeleteItem function in path src/components/ItemList.tsx:", itemId);

            try {
                setLoading(true);
                const response = await axios.delete(`${API_DOMAIN}/items/${itemId}`);

                if (response.status !== 200 || !response.data) {

                    throw new Error('Failed to delete item');
                }
                const data = await response.data;
                console.log("log ====> data in handleDeleteItem function in path src/components/ItemList.tsx:", data);

                setTimeout(() => {
                    toast.success(`${data.message}`);
                }, 2000);

                await fetchItems();
                setLoading(false);
            } catch (error) {
                console.error('Error deleting item:', error);
                toast.error('Failed to delete item');
                setLoading(false);
            }
        }
    };

    // Extract unique VATs, Units, and Classes
    // const uniqueVats = Array.from(new Map(items.map((item) => [item.vatRate?.vatPercent!.toString(), item.vatRate])).values());
    const uniqueUnits = Array.from(new Map(items.map((item) => [item.unit.id, item.unit])).values());
    const uniqueClasses = Array.from(new Map(items.map((item) => [item.itemClass.id, item.itemClass])).values());

    if (loading) {
        return <ListSkeleton/>;
    }

    return (
        <RequireAuth>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    {/* Search Input */}
                    <Input
                        type="text"
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />

                    {/* Supplier Reference Filter */}
                    <Input
                        type="text"
                        placeholder="Supplier Reference"
                        value={supplierReference}
                        onChange={(e) => setSupplierReference(e.target.value)}
                        className="max-w-sm"
                    />
                    {/* Unit Filter */}
                    <select
                        value={selectedUnit}
                        onChange={(e) => setSelectedUnit(e.target.value)}
                        className="max-w-sm"
                    >
                        <option value="">All Units</option>
                        {uniqueUnits.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                                {unit.name}
                            </option>
                        ))}
                    </select>

                    {/* Class Filter */}
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="max-w-sm"
                    >
                        <option value="">All Classes</option>
                        {uniqueClasses.map((itemClass) => (
                            <option key={itemClass.id} value={itemClass.id}>
                                {itemClass.label}
                            </option>
                        ))}
                    </select>

                    {/* Add Item Button */}
                    <Button onClick={handleAddItem}>
                        <Plus className="mr-2 h-4 w-4"/> Add Item
                    </Button>
                </div>

                {/* Price Range Filter */}
                <div className="flex space-x-2">
                    <Input
                        type="number"
                        placeholder="Min Price"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})}
                    />
                    <Input
                        type="number"
                        placeholder="Max Price"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                    />
                </div>



                {/* Table */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('itemNumber')}>
                                    Item Number
                                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('supplierReference')}>
                                    Supplier Reference
                                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                                </Button>
                            </TableHead>
                            <TableHead>Label</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Retail Price (€)</TableHead>
                            <TableHead>Purchase Price (€)</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedItems.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.itemNumber}</TableCell>
                                <TableCell>{item.supplierReference}</TableCell>
                                <TableCell>{item.label}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>{item.retailPrice.toFixed(2)}</TableCell>
                                <TableCell>{item.purchasePrice.toFixed(2)}</TableCell>
                                <TableCell>{item.unit.name}</TableCell>
                                <TableCell>{item.itemClass.label}</TableCell>
                                <TableCell>
                                    {item.stockQuantity} (Min: {item.minQuantity})
                                </TableCell>
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

                {/* Pagination */}
                <div className="flex justify-between items-center">
                    <Button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span>
                        Page {currentPage} of {Math.ceil(filteredItems.length / itemsPerPage)}
                    </span>
                    <Button
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        disabled={currentPage * itemsPerPage >= filteredItems.length}
                    >
                        Next
                    </Button>
                </div>
            </div>
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar theme="colored"/>
        </RequireAuth>
    );
}
