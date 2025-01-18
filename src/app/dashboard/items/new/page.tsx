// path: src/app/dashboard/items/new/page.tsx
'use client'
import React, { useState, useEffect } from 'react';
import ItemForm from '@/components/dashboard/forms/ItemForm';
import ItemFormSkeleton from '@/components/dashboard/forms/ItemFormSkeleton';

export default function NewItemPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate data fetching delay for demonstration purposes
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">Create New Item</h1>
            {loading ? <ItemFormSkeleton /> : <ItemForm />}
        </div>
    );
}
