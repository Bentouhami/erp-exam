// path: src/components/UnitsDropDown.tsx

'use client';

import React, {useEffect, useState} from 'react';
import {useToast} from '@/hooks/use-toast';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

interface Unit {
    id: number;
    name: string;
}

interface ItemUnitDropDownProps {
    selectedUnitId: string | number;
    onSelect: (unitId: string | number) => void;
}

export default function UnitsDropDown({ selectedUnitId, onSelect }: ItemUnitDropDownProps) {
    const [units, setUnits] = useState<Unit[]>([]);
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch all units
        setLoading(true);
        fetch('/api/v1/units')
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch units');
                }
                const { units } = await response.json(); // Destructure units from response
                setUnits(units);
            })
            .catch((error) => {
                console.error('Error fetching units:', error);
                toast('Failed to fetch units', { type: 'error' });
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading units...</div>;

    return (
        <Select
            onValueChange={(value: string) => onSelect(value)}
            defaultValue={selectedUnitId ? selectedUnitId.toString() : undefined}
        >
            <SelectTrigger>
                <SelectValue placeholder="Select a unit" />
            </SelectTrigger>
            <SelectContent>
                {units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id.toString()}>
                        {unit.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
