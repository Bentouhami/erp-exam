// path: src/components/RegisterForm.tsx
"use client"

import React, {useState} from "react"
import {useRouter} from "next/navigation"
import {Button} from "@/components/ui/button"
import {PersonalInfoForm} from "./PersonalInfoForm"
import {AccountSetupForm} from "./AccountSetupForm"
import {StepIndicator} from "./StepIndicator"
import apiCalls from "@/services/apiCalls";
import {CreateAdminDTO} from "@/services/dtos/UserDtos";

export function RegisterForm() {
    const [step, setStep] = useState(1)

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        mobile: "",
        email: "",
        password: "",
    })
    const router = useRouter()

    const updateFormData = (newData: Partial<typeof formData>) => {
        setFormData(prevData => ({...prevData, ...newData}))
    }

    const handleNext = () => {
        setStep(prevStep => prevStep + 1)
    }

    const handlePrevious = () => {
        setStep(prevStep => prevStep - 1)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Tentative d'inscription avec:", formData)
        // send datas to creat new user in db and NOT a new CLIENT !
        const userData: CreateAdminDTO = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            mobile: formData.mobile,
            password: formData.password,
        }
        const newUser = await apiCalls.createAdmin(formData)
        console.log("newUser", newUser)

    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-md px-4">
            <StepIndicator currentStep={step}/>

            {step === 1 && (
                <PersonalInfoForm
                    formData={formData}
                    updateFormData={updateFormData}
                />
            )}

            {step === 2 && (
                <AccountSetupForm
                    formData={formData}
                    updateFormData={updateFormData}
                />
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
                    <Button type="submit" className="ml-auto">
                        S'inscrire
                    </Button>
                )}
            </div>
        </form>
    )
}




