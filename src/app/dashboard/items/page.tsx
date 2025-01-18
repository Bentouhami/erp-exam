// path: src/app/dashboard/items/page.tsx

'use client'
import ItemList from '@/components/ItemList'
import RequireAuth from "@/components/auth/RequireAuth";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {accessControlHelper} from "@/lib/utils/accessControlHelper";

export default function ItemsPage() {
    const {data: session, status} = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth');
        } else if (status === 'authenticated') {
            const canManageUsers = accessControlHelper.canManageUsers(session);
            if (!canManageUsers) {
                router.push('/dashboard');
            }
        }
    }, [status, session, router]);

    return (
        <RequireAuth>
            <div className="container mx-auto py-10">
                <h1 className="text-2xl font-bold mb-5">Items</h1>
                <ItemList/>
            </div>
        </RequireAuth>
    )
}

