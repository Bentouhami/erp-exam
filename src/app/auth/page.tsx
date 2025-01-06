// path: src/app/auth/page.tsx
'use client';

import { AuthForms } from "@/components/auth/AuthForms";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            // Redirect to dashboard if authenticated
            router.push('/dashboard');
        }
    }, [status, router]);

    // Show loading spinner while session status is being checked
    if (status === "loading" || status === "authenticated") {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    // If unauthenticated, show the AuthForms component
    return (
        <div className="flex min-h-screen flex-col items-center justify-center w-full">
            <AuthForms />
        </div>
    );
}
