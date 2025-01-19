// path: src/components/LoginForm.tsx
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from 'lucide-react';
import { signIn } from "next-auth/react"; // Correct import

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null); // For error handling
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Call signIn with credentials
        const result = await signIn("credentials", {
            redirect: false, // Prevent automatic redirect
            email,
            password,
        });

        if (result?.error) {
            setError("Invalid email or password");
        } else {
            console.log("Login successful, lastLogin updated");
            router.push("/dashboard");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md px-4">
            {error && <div className="text-red-500">{error}</div>}
            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
                    </Button>
                </div>
            </div>
            <Button type="submit" className="w-full">Se connecter</Button>
        </form>
    );
}
