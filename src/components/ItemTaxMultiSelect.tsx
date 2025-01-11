// path: src/components/ItemTaxMultiSelect.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import axios from 'axios';
import {toast} from "react-toastify";

interface ItemTax {
    id: number;
    label: string;
}

interface ItemTaxMultiSelectProps {
    selectedTaxIds: number[];
    onChange: (selectedIds: number[]) => void;
}

export default function ItemTaxMultiSelect({ selectedTaxIds = [], onChange }: ItemTaxMultiSelectProps) {
    const [itemTaxes, setItemTaxes] = useState<ItemTax[]>([]);


    useEffect(() => {
        fetchItemTaxes();
    }, []);

    const fetchItemTaxes = async () => {
        try {
            const response = await axios.get('/api/v1/item-taxes');
            setItemTaxes(response.data.taxes);
        } catch (error) {
            console.error('Error fetching item taxes:', error);
            toast.error('Failed to fetch item taxes');
        }
    };

    const handleCheckboxChange = (taxId: number) => {
        const updatedIds = selectedTaxIds.includes(taxId)
            ? selectedTaxIds.filter((id) => id !== taxId)
            : [...selectedTaxIds, taxId];
        onChange(updatedIds);
    };

    return (
        <div className="space-y-2">
            {itemTaxes.map((tax) => (
                <div key={tax.id} className="flex items-center space-x-2">
                    <Checkbox
                        checked={selectedTaxIds.includes(tax.id)}
                        onCheckedChange={() => handleCheckboxChange(tax.id)}
                    />
                    <label>{tax.label}</label>
                </div>
            ))}
        </div>
    );
}
