// path: src/app/items/new/page.tsx
'use client'

import { useRouter } from 'next/navigation';

import NewItemForm from '@/components/NewItemForm';
import {useEffect, useState} from "react";
import {ItemCreateDTO} from "@/services/dtos/ItemDtos";

export default function NewItemPage() {
    const router = useRouter();
    const [data, setData] = useState({
        vatTypes: [],
        itemClasses: [],
        units: [],
    });
    const [loading, setLoading] = useState(true);

    // fetch data from the server
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [vatRes, classesRes, unitsRes] = await Promise.all([
                    fetch('/api/v1/vats'),
                    fetch('/api/v1/item-classes'),
                    fetch('/api/v1/units'),
                ]);

                if (!vatRes.ok || !classesRes.ok || !unitsRes.ok) {
                    throw new Error('Failed to fetch data');
                }

                const vatTypes = await vatRes.json();
                const itemClasses = await classesRes.json();
                const units  = await unitsRes.json();

                console.log("log ====> vatTypes in new item page: ", vatTypes);
                console.log("log ====> itemClasses in new item page: ", itemClasses);
                console.log("log ====> units in new item page: ", units);

                if (!vatTypes.vatTypes || !itemClasses || !units) {
                    throw new Error('Failed to fetch data');
                }
                // Validate and set the data
                setData({
                    vatTypes: Array.isArray(vatTypes.vatTypes) ? vatTypes.vatTypes : [],
                    itemClasses: Array.isArray(itemClasses) ? itemClasses : itemClasses.itemClasses || [],
                    units: Array.isArray(units) ? units : units.units || [],

                });

                console.log("log ====> data in new item page: ", data);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // handle form submission
    const handleSubmit = async (data: any) => {
        console.log("log ====> data in handleSubmit in path src/app/items/new/page.tsx is : ", data);

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
