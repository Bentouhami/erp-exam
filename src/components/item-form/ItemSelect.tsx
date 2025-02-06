// path: src/components/item-form/ItemSelect.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Item = {
    id: number;
    itemNumber: string;
    label: string;
    description: string;
    retailPrice: number;
    stockQuantity: number;
    minQuantity: number;
    purchasePrice: number;
    supplierReference?: string; // Optional
    unit: {
        name: string;
    };
    itemClass: {
        label: string;
    };
};

interface ItemSelectProps {
    items: Item[];
    selectedItemId?: string; // Optional prop for preselection
    onSelect: (itemId: string) => void;
    onItemSelected?: () => void; // ✅ New prop to trigger recalculations
}

export default function ItemSelect({ items, selectedItemId, onSelect, onItemSelected }: ItemSelectProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const filteredItems = items.filter(
        (item) =>
            item.itemNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                <Input
                    type="text"
                    placeholder="Search by item number, label, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-4"
                />
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item Number</TableHead>
                            <TableHead>Label</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Purchase Price (€)</TableHead>
                            <TableHead>Retail Price (€)</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead>Item Class</TableHead>
                            <TableHead>Stock Quantity</TableHead>
                            <TableHead>Min Quantity</TableHead>
                            <TableHead>Supplier Reference</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredItems.map((item) => (
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
                                <TableCell>{item.label}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>{item.purchasePrice.toFixed(2)}</TableCell>
                                <TableCell>{item.retailPrice.toFixed(2)}</TableCell>
                                <TableCell>{item.unit.name}</TableCell>
                                <TableCell>{item.itemClass.label}</TableCell>
                                <TableCell>{item.stockQuantity}</TableCell>
                                <TableCell>{item.minQuantity}</TableCell>
                                <TableCell>{item.supplierReference || '-'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DialogContent>
        </Dialog>
    );
}
