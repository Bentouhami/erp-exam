import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Item = {
    id: number;
    itemNumber: string;
    supplierReference?: string;
    label: string;
    description: string;
    retailPrice: number;
    stockQuantity: number;
    minQuantity: number;
    purchasePrice: number;
    unit: {
        name: string;
    };
    itemClass: {
        label: string;
    };
};

interface ItemSelectProps {
    items: Item[];
    selectedItemId?: string;
    onSelect: (itemId: string) => void;
    onItemSelected?: () => void;
}

export default function ItemSelect({ items, selectedItemId, onSelect, onItemSelected }: ItemSelectProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // ✅ Define how many items per page

    // Filter items based on search term
    const filteredItems = items.filter(
        (item) =>
            item.itemNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.supplierReference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get items for the current page
    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Get the total number of pages
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const selectedItem = items.find((item) => item.id.toString() === selectedItemId);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                    {selectedItem
                        ? `${selectedItem.label} (${selectedItem.itemNumber})`
                        : 'Select an item'}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto resizable">
                <DialogHeader>
                    <DialogTitle>Select Item</DialogTitle>
                </DialogHeader>
                {/* Search Bar */}
                <Input
                    type="text"
                    placeholder="Search by item number, label, or description..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Reset to first page on new search
                    }}
                    className="mb-4"
                />

                {/* Item Table */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item Number</TableHead>
                            <TableHead>Supplier Reference</TableHead>
                            <TableHead>Label</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Purchase Price (€)</TableHead>
                            <TableHead>Retail Price (€)</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead>Item Class</TableHead>
                            <TableHead>Stock Quantity</TableHead>
                            <TableHead>Min Quantity</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedItems.map((item) => (
                            <TableRow
                                key={item.id}
                                onClick={() => {
                                    if (onItemSelected) onItemSelected();
                                    onSelect(item.id.toString());
                                    setIsOpen(false);
                                }}
                                className="cursor-pointer hover:bg-gray-100"
                            >
                                <TableCell>{item.itemNumber}</TableCell>
                                <TableCell>{item.supplierReference || '-'}</TableCell>
                                <TableCell>{item.label}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>{item.purchasePrice.toFixed(2)}</TableCell>
                                <TableCell>{item.retailPrice.toFixed(2)}</TableCell>
                                <TableCell>{item.unit.name}</TableCell>
                                <TableCell>{item.itemClass.label}</TableCell>
                                <TableCell>{item.stockQuantity}</TableCell>
                                <TableCell>{item.minQuantity}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-4">
                    <Button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage >= totalPages}
                    >
                        Next
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
