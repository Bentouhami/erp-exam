// path: src/app/items/new/page.tsx
'use client'

import { useRouter } from 'next/navigation';

import NewItemForm from '@/components/NewItemForm';
import {useEffect, useState} from "react";

export default function NewItemPage() {
    const router = useRouter();
    const [data, setData] = useState({
        vatTypes: [],
        itemClasses: [],
        units: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [vatRes, classesRes, unitsRes] = await Promise.all([
                    fetch('/api/v1/vats'),
                    fetch('/api/v1/item-classes'),
                    fetch('/api/v1/units'),
                ]);

                const vatTypes = await vatRes.json();
                const itemClasses = await classesRes.json();
                const units = await unitsRes.json();

                // Validate and set the data
                setData({
                    vatTypes: Array.isArray(vatTypes.vatTypes) ? vatTypes.vatTypes : [],
                    itemClasses: Array.isArray(itemClasses) ? itemClasses : [],
                    units: Array.isArray(units) ? units : [],
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (data: any) => {
        const response = await fetch('/api/v1/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to create item');
        }

        router.push('/items');
        router.refresh();
    };

    if (loading) return <div>Chargement...</div>;

    return (
        <NewItemForm
            units={data.units}
            itemClasses={data.itemClasses}
            vatTypes={data.vatTypes}
            onSubmit={handleSubmit}
        />
    );
}
