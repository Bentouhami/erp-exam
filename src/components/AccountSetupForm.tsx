import React, {useEffect, useState} from "react"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Eye, EyeOff} from 'lucide-react'
import {Button} from "@/components/ui/button"
import {checkPasswordStrength, getStrengthColor} from "@/lib/password-strength"

interface AccountSetupFormProps {
    formData: {
        email: string,
        password: string
    }
    updateFormData: (data: Partial<AccountSetupFormProps['formData']>) => void
}

export function AccountSetupForm({formData, updateFormData}: AccountSetupFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState(0)

    useEffect(() => {
        setPasswordStrength(checkPasswordStrength(formData.password))
    }, [formData.password])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateFormData({[e.target.id]: e.target.value})
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4"/>
                        ) : (
                            <Eye className="h-4 w-4"/>
                        )}
                        <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                        </span>
                    </Button>
                </div>
                <div
                    className={`h-2 w-full rounded ${getStrengthColor(passwordStrength)}`}
                    style={{width: `${passwordStrength}%`}}
                ></div>


                <div className="text-xs text-muted-foreground">
                    {passwordStrength === 0 && <span className="text-red-500">Enter a password 🤗 </span>}
                    {(passwordStrength >= 20 && passwordStrength <= 50) && <span className="text-yellow-500">Weak password 😐 </span>}
                    {(passwordStrength >= 51 && passwordStrength < 60) && <span className="text-orange-500">Fair password 😐 </span>}
                    {(passwordStrength >= 60 && passwordStrength < 80) && <span className="text-green-500">Good password 👍 </span>}
                    {passwordStrength === 80 && "Strong password"}
                    {passwordStrength > 80 && <span className="text-green-500">Strong password 👍 </span>}
                </div>

            </div>
        </div>
    )
}
