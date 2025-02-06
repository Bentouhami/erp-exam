// path: src/components/users/MultiStepRegistrationForm.tsx
"use client";

import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {StepIndicator} from "./StepIndicator";
import {BaseUserForm} from "./BaseUserForm";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import axios from "axios";
import {API_DOMAIN} from "@/lib/utils/constants";
import {useRouter} from "next/navigation";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddressForm from "@/components/dashboard/forms/AddressForm";
import {ArrowLeftIcon, ArrowRightIcon, Loader2, SaveIcon} from "lucide-react";
import IsEnterpriseForm from "@/components/dashboard/forms/IsEnterpriseForm";
import {CustomerFormData, getUserSchema} from "@/lib/userSchemas";
import apiClient from "@/lib/axiosInstance";

interface MultiStepRegistrationFormProps {
    role: "ADMIN" | "ACCOUNTANT" | "SUPER_ADMIN" | "CUSTOMER";
}

type Country = {
    id: number;
    name: string;
    countryCode: string;
};

type City = {
    id: number;
    cityCode: string;
    name: string;
    countryId: number;
};

export function MultiStepRegistrationForm({role}: MultiStepRegistrationFormProps) {
    const router = useRouter();
    const [step, setStep] = useState(1);

    const [isLoading, setIsLoading] = useState(false);
    // For address
    const [selectedCountryId, setSelectedCountryId] = useState<string | number>("");
    const [selectedCityId, setSelectedCityId] = useState<string | number>("");

    // If role === CUSTOMER => 3 steps, else 2
    const totalSteps = role === "CUSTOMER" ? 3 : 2;

    // New states for all countries & cities
    const [countries, setCountries] = useState<Country[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [locationsLoading, setLocationsLoading] = useState(true);

    // The unified form context using your new schema
    const form = useForm<CustomerFormData>({
        resolver: zodResolver(getUserSchema(role)),
        defaultValues: getDefaultValues(role),
    });

    // 1) Fetch all countries & cities once, e.g. on mount
    useEffect(() => {
        async function fetchLocations() {
            try {
                setLocationsLoading(true);
                const response = await apiClient.get("/locations/all");
                const {countries, cities} = response.data;
                setTimeout(() => {
                    setCountries(countries);
                    setCities(cities);
                }, 100);
            } catch (err) {
                console.error("Error fetching all locations:", err);
                toast.error("Failed to load location data.");
            } finally {
                setLocationsLoading(false);
            }
        }

        fetchLocations();
    }, []);

    // Next step
    const handleNext = async () => {
        // prevent default form submission
        // e.preventDefault();

        // Validate the fields on the current step, e.g. for step 1
        setIsLoading(true);
        const isValid = await form.trigger(["firstName", "lastName", "email", "phone"]);

        setTimeout(() => {
            if (isValid) {
                setStep(step + 1);
                setIsLoading(false);
            }
        }, 100);
    };

    // Previous step
    const handlePrevious = () => {
        setIsLoading(true);
        setTimeout(() => setStep((prev) => prev - 1), 100);
        setIsLoading(false);
    };

    // Final form submission
    const onSubmit = async () => {

        setIsLoading(true);
        console.log("Form submitted with data:", form.getValues());

        const payload = {
            ...form.getValues(),
            role,
            countryId: selectedCountryId,
            cityId: selectedCityId,
            address: {
                street: form.getValues().street,
                streetNumber: form.getValues().streetNumber,
                complement: form.getValues().complement,
                boxNumber: form.getValues().boxNumber,
                addressType: form.getValues().addressType,
            }
        };

        console.log("Submitting payload:", payload);

        try {
            const response = await axios.post(`${API_DOMAIN}/users/register`, payload);
            if (response.status === 201) {
                toast.success("User created successfully!");
                setTimeout(() => router.push("/dashboard/users"), 3000);
            }
            setIsLoading(false);
        } catch (error) {
            console.error("Error creating user:", error);
            toast.error("Failed to create user. Please try again.");
            setIsLoading(false);
        }
    };

    // If still loading countries & cities, show a spinner
    if (locationsLoading) {
        return (
            <div className="flex items-center gap-2 p-4">
                <Loader2 className="animate-spin"/>
                <span>Loading countries & cities...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8 w-full max-w-2xl px-4 mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(
                    async (data) => {
                        console.log("Data passed validation:", data);
                        await onSubmit();
                    },
                    (errors) => {
                        console.log("Validation errors:", errors);
                        // Possibly toast or do something, so you see there's an error
                    }
                )}>
                    <StepIndicator currentStep={step} totalSteps={totalSteps}/>

                    {/* Step 1: Personal/base info */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <BaseUserForm
                                formData={form.getValues()}
                                updateFormData={form.setValue}
                                role={role}
                            />
                        </div>
                    )}
                    {/* Step 2: Enterprise info (only if a role=CUSTOMER) */}
                    {step === 2 && role === "CUSTOMER" && (
                        <>
                            <IsEnterpriseForm/>
                            <FormField
                                control={form.control}
                                name="vatNumber"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>VAT Number (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="VAT Number" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            If you have a VAT number, we will automatically calculate the VAT rate for
                                            you.
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                    {/* Step 3 (or 2 for staff): Address info */}
                    {step === totalSteps && (
                        <AddressForm
                            selectedCountryId={selectedCountryId}
                            selectedCityId={selectedCityId}
                            onCountrySelect={setSelectedCountryId}
                            onCitySelect={setSelectedCityId}
                            // pass the entire list so we can filter in the child
                            countries={countries}
                            cities={cities}
                        />
                    )}
                    <div className="flex justify-between">
                        {step > 1 && (
                            <Button type="button" onClick={handlePrevious} className="mt-5 mr-auto">
                                <ArrowLeftIcon className="inline-block mr-2"/> Previous
                            </Button>
                        )}
                        {step < totalSteps ? (
                            <>
                                {!isLoading &&
                                    <Button type="button"  onClick={handleNext}
                                            className=" mt-5 ml-auto"> Next
                                        <ArrowRightIcon className="inline-block ml-2"/>
                                    </Button>
                                }

                                {isLoading &&
                                    <Button type="button"  disabled={true}
                                            className=" mt-5 ml-auto"> Next
                                        <Loader2
                                            className="animate-spin"/>
                                    </Button>
                                }
                            </>
                        ) : (
                            <Button type="submit" className="ml-auto mt-5">
                                Create {role} <SaveIcon className="inline-block ml-2"/>
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar theme="colored"/>
        </div>
    );
}

function getDefaultValues(
    role: "ADMIN" | "ACCOUNTANT" | "SUPER_ADMIN" | "CUSTOMER"
): CustomerFormData {
    return {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        mobile: "",
        isEnterprise: false,
        companyName: "",
        vatNumber: "",
        companyNumber: "",
        exportNumber: "",
        paymentTermDays: 0,
        street: "",
        streetNumber: "",
        countryId: "",
        cityId: "",
        complement: "",
        boxNumber: "",
        addressType: "HOME",
        ...(role !== "CUSTOMER" && {password: ""}),
    };
}