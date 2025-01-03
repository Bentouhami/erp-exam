// path: src/components/NewUnitForm.tsx

// form component to add the new unit
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NewUnitFormProps {
    onSubmit: (data: { name: string }) => Promise<void>;
}

export default function NewUnitForm({ onSubmit }: NewUnitFormProps) {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await onSubmit({ name }); // Pass the form data to the parent component
            setName(''); // Reset the form after successful submission
        } catch (error) {
            console.error('Error creating unit:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Nouvelle Unité</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nom de l'unité *</Label>
                        <Input
                            id="name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Pièce, Kg, Litre"
                            required
                        />
                    </div>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Création en cours...' : 'Créer l\'unité'}
                    </Button>
                </CardContent>
            </Card>
        </form>
    );
}
