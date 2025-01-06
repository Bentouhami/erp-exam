// path: src/components/auth/AuthForms.tsx
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";

export function AuthForms() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="flex flex-col items-center w-full max-w-md px-4">
            <div className="w-full top-0 bg-background pt-24 pb-8 flex flex-col items-center space-y-8">
                <div className="flex justify-center space-x-4">
                    <Button
                        onClick={() => setIsLogin(true)}
                        variant={isLogin ? "default" : "outline"}
                    >
                        Se connecter
                    </Button>
                    <Button
                        onClick={() => setIsLogin(false)}
                        variant={!isLogin ? "default" : "outline"}
                    >
                        S'inscrire
                    </Button>
                </div>
            </div>
            <div className="w-full overflow-y-auto max-h-[calc(100vh-200px)]">
                {isLogin ? <LoginForm /> : <RegisterForm />}
            </div>
        </div>
    );
}
