// Path: src/components/dashboard/dropdowns/CountriesDropDown.tsx

import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

interface CountriesDropDownProps {
    countries: { id: number; name: string; countryCode: string }[];
    selectedCountryId: string | number;
    onSelect: (countryId: string | number) => void;
}

const CountriesDropDown: React.FC<CountriesDropDownProps> = ({ countries, selectedCountryId, onSelect }) => {
    return (
        <Select value={selectedCountryId?.toString()} onValueChange={(value) => onSelect(value)}>
            <SelectTrigger>
                <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
                {countries.map((country) => (
                    <SelectItem key={country.id} value={country.id.toString()}>
                        {country.name} ({country.countryCode})
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default CountriesDropDown;
