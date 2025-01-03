// path: src/app/(auth)/login/page.tsx

import { LoginForm } from "@/components/LoginForm"

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-3xl font-bold mb-8">Inscription</h1>
            <LoginForm />
        </div>
    )
}

