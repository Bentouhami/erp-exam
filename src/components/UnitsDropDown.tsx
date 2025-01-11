// path: src/components/UnitsDropDown.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Unit {
    id: number;
    name: string;
}

interface UnitDropDownProps {
    onSubmit: (unitId: string) => void;
    selectedUnitId?: string;
}

export default function UnitsDropDown({ onSubmit, selectedUnitId }: UnitDropDownProps) {
    const [units, setUnits] = useState<Unit[]>([]);
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch all units
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
            });
    }, []);

    return (
        <div className="space-y-2">

            <select
                id="unit"
                name="unit"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={selectedUnitId || ''}
                onChange={(e) => onSubmit(e.target.value)}
                disabled={loading}
            >
                <option value="">Select a unit</option>
                {units.map((unit) => (
                    <option key={unit.id} value={unit.id.toString()}>
                        {unit.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
