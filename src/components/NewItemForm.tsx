// path: src/components/NewItemForm.tsx

'use client';

import React, {useEffect, useState} from 'react';
import {Loader2, Plus, Save} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from '@/components/ui/card';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import {Label} from '@/components/ui/label';
import {useToast} from '@/hooks/use-toast';

interface NewItemFormProps {
    units: Array<{ id: number; name: string }>;
    itemClasses: Array<{ id: number; name: string }>;
    vatTypes: Array<{
        id: number;
        vatPercent: string;
        vatType: number;
        countryId: number;
        country: { id: number; countryCode: string; name: string }
    }>;
    onSubmit: (data: any) => Promise<void>;
}

export default function NewItemForm({units, itemClasses, vatTypes, onSubmit}: NewItemFormProps) {
    const {toast} = useToast();
    const [loading, setLoading] = useState(false);
    const [generatedItemNumber, setGeneratedItemNumber] = useState<string>('');
    const [formData, setFormData] = useState({

        supplierReference: '',
        barcode: '',
        label: '',
        description: '',
        purchasePrice: '',
        retailPrice: '',
        stockQuantity: '0',
        minQuantity: '0',
        unitId: '',
        classId: '',
        vatTypeId: ''
    });
    const [selectedCountry, setSelectedCountry] = useState('');
    const [filteredVatTypes, setFilteredVatTypes] = useState(vatTypes);

    useEffect(() => {
        const fetchItemNumber = async () => {
            const response = await fetch('/api/v1/items/generate-number');
            const data = await response.json();
            console.log(data);
            setGeneratedItemNumber(data.itemNumber);

            console.log(generatedItemNumber);
        };

        fetchItemNumber();
    }, []);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await onSubmit({
                ...formData,
                purchasePrice: parseFloat(formData.purchasePrice),
                retailPrice: parseFloat(formData.retailPrice),
                stockQuantity: parseInt(formData.stockQuantity),
                minQuantity: parseInt(formData.minQuantity),
                unitId: parseInt(formData.unitId),
                classId: parseInt(formData.classId),
            });

            toast({
                title: "Article créé avec succès!",
                description: `L'article ${formData.label} a été ajouté à votre inventaire.`,
            });

            // Reset form
            setFormData({
                supplierReference: '',
                barcode: '',
                label: '',
                description: '',
                purchasePrice: '',
                retailPrice: '',
                stockQuantity: '0',
                minQuantity: '0',
                unitId: '',
                classId: '',
                vatTypeId: ''
            });
        } catch (error) {
            toast({
                title: "Erreur lors de la création",
                description: "Une erreur est survenue lors de la création de l'article.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };
    // Fetch the item number when the form loads
    useEffect(() => {
        const fetchItemNumber = async () => {
            const response = await fetch('/api/v1/items/generate-number');
            const data = await response.json();
            setGeneratedItemNumber(data.itemNumber);
        };

        fetchItemNumber();
    }, []);

    // ** Initialize the Country Dropdown and Filter VAT Types **
    useEffect(() => {
        if (vatTypes.length > 0) {
            const defaultCountryCode = vatTypes[0].country.countryCode; // Select the first country by default
            setSelectedCountry(defaultCountryCode);
            setFilteredVatTypes(vatTypes.filter((vat) => vat.country.countryCode === defaultCountryCode));
        }
    }, [vatTypes]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({...prev, [name]: value}));
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Plus className="h-6 w-6"/>
                        Nouvel Article
                    </CardTitle>
                    <CardDescription>
                        Ajoutez un nouvel article à votre inventaire
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="itemNumber">Numéro d'article</Label>
                            <Input
                                id="itemNumber"
                                value={generatedItemNumber || 'Générer automatiquement...'}
                                readOnly
                                className="bg-muted"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="label">Libellé *</Label>
                            <Input
                                id="label"
                                name="label"
                                value={formData.label}
                                onChange={handleChange}
                                placeholder="Chaussures de sport"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="supplierReference">Référence fournisseur</Label>
                            <Input
                                id="supplierReference"
                                name="supplierReference"
                                value={formData.supplierReference}
                                onChange={handleChange}
                                placeholder="REF-123456789"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="barcode">Code-barres</Label>
                            <Input
                                id="barcode"
                                name="barcode"
                                value={formData.barcode}
                                onChange={handleChange}
                                placeholder="123456789"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Description détaillée de l'article..."
                            className="min-h-[100px]"
                        />
                    </div>

                    {/* Pricing and Stock */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="purchasePrice">Prix d'achat HT *</Label>
                            <Input
                                id="purchasePrice"
                                name="purchasePrice"
                                type="number"
                                step="0.01"
                                value={formData.purchasePrice}
                                onChange={handleChange}
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="retailPrice">Prix de vente HT *</Label>
                            <Input
                                id="retailPrice"
                                name="retailPrice"
                                type="number"
                                step="0.01"
                                value={formData.retailPrice}
                                onChange={handleChange}
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <CardContent className="space-y-6">
                            {/* Country Dropdown - New Field */}
                            <div className="space-y-2">
                                <Label htmlFor="country">Pays *</Label>
                                <Select
                                    value={selectedCountry}
                                    onValueChange={(value) => {
                                        setSelectedCountry(value);
                                        const filteredVATs = vatTypes.filter((vat) => vat.country.countryCode === value);
                                        setFilteredVatTypes(filteredVATs);
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un pays" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from(new Set(vatTypes.map((vat) => vat.country.countryCode))).map(
                                            (countryCode) => (
                                                <SelectItem key={countryCode} value={countryCode}>
                                                    {vatTypes.find((vat) => vat.country.countryCode === countryCode)?.country.name}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* VAT Types Dropdown */}
                            <div className="space-y-2">
                                <Label htmlFor="vatTypeId">TVA *</Label>
                                <Select
                                    value={formData.vatTypeId}
                                    onValueChange={(value) => handleSelectChange('vatTypeId', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner TVA" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredVatTypes.map((vat) => (
                                            <SelectItem key={vat.id} value={vat.id.toString()}>
                                                {vat.vatType} ({vat.vatPercent}%)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            </CardContent>
                    </div>

                    {/* Stock Management */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="stockQuantity">Quantité en stock</Label>
                            <Input
                                id="stockQuantity"
                                name="stockQuantity"
                                type="number"
                                value={formData.stockQuantity}
                                onChange={handleChange}
                                placeholder="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="minQuantity">Quantité minimale</Label>
                            <Input
                                id="minQuantity"
                                name="minQuantity"
                                type="number"
                                value={formData.minQuantity}
                                onChange={handleChange}
                                placeholder="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="unitId">Unité *</Label>
                            <Select
                                value={formData.unitId}
                                onValueChange={(value) => handleSelectChange('unitId', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner unité"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {units.map((unit) => (
                                        <SelectItem key={unit.id} value={unit.id.toString()}>
                                            {unit.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="classId">Catégorie *</Label>
                            <Select
                                value={formData.classId}
                                onValueChange={(value) => handleSelectChange('classId', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner catégorie"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {itemClasses.map((itemClass) => (
                                        <SelectItem key={itemClass.id} value={itemClass.id.toString()}>
                                            {itemClass.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    Création en cours...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4"/>
                                    Créer l'article
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}