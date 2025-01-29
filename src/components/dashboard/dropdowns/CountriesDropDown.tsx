// path: src/components/dropdowns/CountriesDropDown.tsx
import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

interface Country {
    id: number;
    name: string;
    countryCode: string;
}

interface CountriesDropDownProps {
    countries: Country[]; // all countries passed from parent
    selectedCountryId: string | number;
    onSelect: (countryId: string | number) => void;
}

const CountriesDropDown: React.FC<CountriesDropDownProps> = ({
                                                                 countries,
                                                                 selectedCountryId,
                                                                 onSelect,
                                                             }) => {
    return (
        <Select
            value={selectedCountryId ? selectedCountryId.toString() : undefined}
            onValueChange={(value: string) => onSelect(value)}
        >
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
