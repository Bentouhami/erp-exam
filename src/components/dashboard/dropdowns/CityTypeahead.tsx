"use client";

import React, { useState, useMemo } from "react";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty, CommandGroup } from "@/components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface City {
    id: number;
    name: string;
    cityCode: string;
    countryId: number;
}

interface CityTypeaheadProps {
    cities: City[];
    selectedCountryId: string | number;
    selectedCityId: string | number;
    onSelect: (cityId: string | number) => void;
}

/**
 * A typeahead for cities:
 * - Filters `cities` by the selectedCountryId
 * - Lets the user type part of the city name
 * - Shows a short list of matches
 */
export default function CityTypeahead({
                                          cities,
                                          selectedCountryId,
                                          selectedCityId,
                                          onSelect,
                                      }: CityTypeaheadProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");

    // 1) Filter by country
    const filteredByCountry = useMemo(() => {
        if (!selectedCountryId) return [];
        return cities.filter(
            (city) => city.countryId.toString() === selectedCountryId.toString()
        );
    }, [cities, selectedCountryId]);

    // 2) Further filter by user's typed query
    const filteredCities = useMemo(() => {
        const q = query.toLowerCase();
        return filteredByCountry.filter((city) =>
            city.name.toLowerCase().includes(q) || city.cityCode?.toLowerCase().includes(q)
        );
    }, [filteredByCountry, query]);

    // 3) Find label for the "selected" city if we want to display it
    const selectedCityName = useMemo(() => {
        const c = filteredByCountry.find((c) => c.id.toString() === selectedCityId?.toString());
        return c ? `${c.name} (${c.cityCode})` : "";
    }, [filteredByCountry, selectedCityId]);

    function handleSelect(cityId: string) {
        onSelect(cityId);
        setOpen(false);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {selectedCityId
                        ? selectedCityName
                        : "Select or search for a city..."}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[250px]">
                {/** Command is like a "combobox" from shadcn/ui */}
                <Command>
                    {/** Input field for searching */}
                    <CommandInput
                        placeholder="Search city..."
                        value={query}
                        onValueChange={setQuery}
                    />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {filteredCities.map((city) => (
                                <CommandItem
                                    key={city.id}
                                    onSelect={() => handleSelect(city.id.toString())}
                                >
                                    {city.name} ({city.cityCode})
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
