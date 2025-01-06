import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React from "react";

interface PersonalInfoFormProps {
    formData: {
        firstName: string
        lastName: string
        email: string
        phone: string
        mobile: string

    }
    updateFormData: (data: Partial<PersonalInfoFormProps['formData']>) => void
}

export function PersonalInfoForm({ formData, updateFormData }: PersonalInfoFormProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateFormData({ [e.target.id]: e.target.value })
    }

    return (
        <div className="space-y-4 px-4">
            <div>
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                />
            </div>
            <div>
                <Label htmlFor="mobile">Mobile</Label>
                <Input
                    id="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleChange}
                />
            </div>
        </div>
    )
}

