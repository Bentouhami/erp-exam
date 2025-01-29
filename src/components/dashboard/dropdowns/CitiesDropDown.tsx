// path: src/components/dropdowns/CitiesDropDown.tsx
import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

interface City {
    id: number;
    cityCode: string;
    name: string;
    countryId: number;
}

interface CitiesDropDownProps {
    cities: City[]; // full list of all cities
    selectedCountryId: string | number; // used to filter by country
    selectedCityId: string | number;
    onSelect: (cityId: string | number) => void;
}

const CitiesDropDown: React.FC<CitiesDropDownProps> = ({
                                                           cities,
                                                           selectedCountryId,
                                                           selectedCityId,
                                                           onSelect
                                                       }) => {
    // Filter the big cities array by countryId
    const filteredCities = selectedCountryId
        ? cities.filter(
            (city) => city.countryId.toString() === selectedCountryId.toString()
        )
        : [];

    return (
        <Select
            value={selectedCityId ? selectedCityId.toString() : undefined}
            onValueChange={(value: string) => onSelect(value)}
        >
            <SelectTrigger>
                <SelectValue placeholder="Select a city" />
            </SelectTrigger>
            <SelectContent>
                {filteredCities.map((city) => (
                    <SelectItem key={city.id} value={city.id.toString()}>
                        {city.name} ({city.cityCode})
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default CitiesDropDown;
