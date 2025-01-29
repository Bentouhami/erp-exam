// path: src/components/dashboard/forms/AddressForm.tsx
"use client";

import React from "react";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useFormContext} from "react-hook-form";
import CitiesDropDown from "@/components/dashboard/dropdowns/CitiesDropDown";
import {CustomerFormData} from "@/lib/userSchemas";
import CityTypeahead from "@/components/dashboard/dropdowns/CityTypeahead";
import CountriesDropDown from "@/components/dashboard/dropdowns/CountriesDropDown";

const AddressTypeDTO = [
    {label: "Home", value: "HOME"},
    {label: "Office", value: "OFFICE"},
    {label: "Billing", value: "BILLING"},
    {label: "Shipping", value: "SHIPPING"},
    {label: "Other", value: "OTHER"}
];

interface Country {
    id: number;
    name: string;
    countryCode: string;
}

interface City {
    id: number;
    cityCode: string;
    name: string;
    countryId: number;
}

interface AddressFormProps {
    selectedCountryId: string | number;
    selectedCityId: string | number;
    onCountrySelect: (countryId: string | number) => void;
    onCitySelect: (cityId: string | number) => void;
    countries: Country[]; // pass them in as props
    cities: City[];       // pass them in as props
}

const AddressForm: React.FC<AddressFormProps> = ({
                                                     selectedCountryId,
                                                     selectedCityId,
                                                     onCountrySelect,
                                                     onCitySelect,
                                                     countries,
                                                     cities
                                                 }) => {
    const {control} = useFormContext<CustomerFormData>();

    return (
        <div className="space-y-4">
            {/* Country Field */}
            <FormField
                control={control}
                name="countryId"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                            <CountriesDropDown
                                countries={countries}
                                selectedCountryId={selectedCountryId}
                                onSelect={(id) => {
                                    field.onChange(id);
                                    onCountrySelect(id);
                                    onCitySelect("");
                                }}
                            />


                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            {/* City Field */}
            <FormField
                control={control}
                name="cityId"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                            <CityTypeahead
                                cities={cities}
                                selectedCityId={selectedCityId}
                                selectedCountryId={selectedCountryId}
                                onSelect={(cityId) => {
                                    field.onChange(cityId);
                                    onCitySelect(cityId);
                                }}
                            />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            {/* Street Field */}
            <FormField
                control={control}
                name="street"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Street</FormLabel>
                        <FormControl>
                            <Input placeholder="Street Name" {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            {/* Street Number Field */}
            <FormField
                control={control}
                name="streetNumber"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Street Number</FormLabel>
                        <FormControl>
                            <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            {/* Complement */}
            <FormField
                control={control}
                name="complement"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Complement</FormLabel>
                        <FormControl>
                            <Input placeholder="Apartment, suite, etc." {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            {/* Box Number */}
            <FormField
                control={control}
                name="boxNumber"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Box Number</FormLabel>
                        <FormControl>
                            <Input placeholder="Box Number" {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            {/* Address Type Field */}
            <FormField
                control={control}
                name="addressType"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Address Type</FormLabel>
                        <FormControl>
                            {/* Could also use a <Select> like you do above */}
                            <select {...field} className="border p-2 rounded w-full">
                                <option value="">Select Address Type</option>
                                {AddressTypeDTO.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />
        </div>
    );
};

export default AddressForm;
