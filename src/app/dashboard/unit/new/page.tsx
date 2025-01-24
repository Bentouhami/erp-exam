// path: src/app/dashboard/unit/new/page.tsx

// page to add new unit to db
'use client';

import { useRouter } from 'next/navigation';
import NewUnitForm from '@/components/NewUnitForm';
import {API_DOMAIN, DOMAIN} from "@/lib/utils/constants";

export default function NewUnitPage() {
    const router = useRouter();

    const handleSubmit = async (data: { name: string }) => {
        try {
            const response = await fetch(`${API_DOMAIN}/units`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to create unit');
            }

            router.push(`${DOMAIN}/dashboard/unit`); // Redirect to the unit list page
        } catch (error) {
            console.error('Error submitting unit:', error);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Ajouter une Nouvelle Unité</h1>
            <NewUnitForm onSubmit={handleSubmit} />
        </div>
    );
}
