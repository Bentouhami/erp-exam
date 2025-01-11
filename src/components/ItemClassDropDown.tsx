// path: src/components/ItemClassDropDown.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { toast } from 'react-toastify';
import axios from 'axios';

interface ItemClass {
    id: number;
    label: string;
}

interface ItemClassDropDownProps {
    selectedClassId: string | number;
    onSelect: (classId: string | number) => void;
}

export default function ItemClassDropDown({ selectedClassId, onSelect }: ItemClassDropDownProps) {
    const [itemClasses, setItemClasses] = useState<ItemClass[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItemClasses();
    }, []);

    const fetchItemClasses = async () => {
        try {
            const response = await axios.get('/api/v1/item-classes');
            setItemClasses(response.data);
        } catch (error) {
            console.error('Error fetching item classes:', error);
            toast.error('Failed to fetch item classes');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading item classes...</div>;

    return (
        <Select
            onValueChange={onSelect}
            defaultValue={selectedClassId ? selectedClassId.toString() : undefined} // Handle undefined case
        >
            <SelectTrigger>
                <SelectValue placeholder="Select item class" />
            </SelectTrigger>
            <SelectContent>
                {itemClasses.map((itemClass) => (
                    <SelectItem key={itemClass.id} value={itemClass.id.toString()}>
                        {itemClass.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>

    );
}

