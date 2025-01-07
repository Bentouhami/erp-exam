"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { PersonalInfoForm } from "./PersonalInfoForm"
import { AccountSetupForm } from "./AccountSetupForm"
import { StepIndicator } from "./StepIndicator"

export function RegisterForm({
                                 formData,
                                 updateFormData,
                                 handleSubmit
                             }: {
    formData: any
    updateFormData: (newData: Partial<typeof formData>) => void
    handleSubmit: (e: React.FormEvent) => void
}) {
    const [step, setStep] = useState(1)

    const handleNext = () => {
        setStep((prevStep) => prevStep + 1)
    }

    const handlePrevious = () => {
        setStep((prevStep) => prevStep - 1)
    }

    return (
        <div className="space-y-8 w-full max-w-md px-4">
            <StepIndicator currentStep={step} />

            {step === 1 && (
                <PersonalInfoForm formData={formData} updateFormData={updateFormData}  />
            )}

            {step === 2 && (
                <AccountSetupForm formData={formData} updateFormData={updateFormData} />
            )}

            <div className="flex justify-between">
                {step > 1 && (
                    <Button type="button" onClick={handlePrevious}>
                        Précédent
                    </Button>
                )}
                {step < 2 ? (
                    <Button type="button" onClick={handleNext} className="ml-auto">
                        Suivant
                    </Button>
                ) : (
                    <Button type="submit" onClick={handleSubmit} className="ml-auto">
                        S'inscrire
                    </Button>
                )}
            </div>
        </div>
    )
}
