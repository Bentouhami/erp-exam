// path: src/components/dropdowns/VatsDropDown.tsx
import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-toastify';
import apiClient from '@/lib/axiosInstance';

interface VatsDropDownProps {
    selectedVatId: string;
    countryId: string;
    onSelect: (vatId: string | number) => void;
}

interface Vat {
    id: number;
    vatType: string;
    vatPercent: number;
}

const VatsDropDown: React.FC<VatsDropDownProps> = ({ selectedVatId, countryId, onSelect }) => {
    const [vatOptions, setVatOptions] = useState<Vat[]>([]);

    useEffect(() => {
        if (!countryId) {
            setVatOptions([]); // Clear VAT options if no country is selected
            return;
        }

        const fetchVatOptions = async () => {
            try {
                const response = await apiClient.get(`/vats`, { params: { countryId } });
                if (!response.data.vatTypes) {
                    throw new Error('Failed to fetch VAT options');
                }
                setVatOptions(response.data.vatTypes);
            } catch (error) {
                console.error('Error fetching VAT options:', error);
                toast.error('Failed to fetch VAT options');
                setVatOptions([]); // Clear VAT options on error
            }
        };

        fetchVatOptions();
    }, [countryId]); // Re-fetch VAT options whenever countryId changes

    return (
        <Select onValueChange={onSelect} defaultValue={selectedVatId}>
            <SelectTrigger>
                <SelectValue placeholder="Select VAT" />
            </SelectTrigger>
            <SelectContent>
                {vatOptions.map((vat) => (
                    <SelectItem key={vat.id} value={vat.id.toString()}>
                        {vat.vatType} ({vat.vatPercent}%)
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default VatsDropDown;
