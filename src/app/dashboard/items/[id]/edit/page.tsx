// path: src/app/dashboard/items/[id]/edit/page.tsx

'use client'
import React, { useState, useEffect } from 'react';
import ItemForm from '@/components/dashboard/forms/ItemForm';
import ItemFormSkeleton from '@/components/dashboard/forms/ItemFormSkeleton';

export default function EditItemPage({ params }: { params: { id: string } }) {
    const [loading, setLoading] = useState(true);
    const itemId = parseInt(params.id);

    useEffect(() => {
        // Simulate data fetching delay for demonstration purposes
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">Edit Item</h1>
            {loading ? <ItemFormSkeleton /> : <ItemForm itemId={itemId} />}
        </div>
    );
}

