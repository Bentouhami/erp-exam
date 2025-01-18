// path: src/app/dashboard/users/add-users/page.tsx
'use client'

import React, {useState} from 'react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {NewCustomer} from "@/components/users/NewCustomer";
import {NewAdmin} from "@/components/users/NewAdminForm";
import {NewAccountant} from "@/components/users/NewAccountant";
import {NewSuperAdmin} from "@/components/users/NewSuperAdminsForm";
import RequireAuth from "@/components/auth/RequireAuth";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {ListSkeleton} from "@/components/skeletons/ListSkeleton";
import {FaUsers} from "react-icons/fa6";

export default function UsersPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('customer');
    const {data: session, status} = useSession();

    if (status === 'loading') {
        return <ListSkeleton/>;
    }

    if (status === 'unauthenticated') {
        return <div>You are not authenticated</div>;
    }

    // Check if the user is a Super Admin
    const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN';
    // Check if the user is an Admin
    const isAdm = session?.user?.role === 'ADMIN';
// Check if the user has permission to manage users
    const canManageUsers = isSuperAdmin || isAdm;

    if (!canManageUsers) {
        router.push('/dashboard'); // Redirect accountants or unauthorized users
        return null;
    }

    // Calculate the number of columns based on whether Super Admin tab is shown
    const gridCols = isSuperAdmin ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3';

    return (
        <RequireAuth>
            <div className="container mx-auto p-4">
                <div className={"flex justify-between items-center mb-6"}>
                    <h1 className="text-3xl font-bold mb-6">
                        <FaUsers/> User Management
                    </h1>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className={`grid w-full ${gridCols}`}>
                        <TabsTrigger value="customer">New Customer</TabsTrigger>
                        <TabsTrigger value="admin">New Admin</TabsTrigger>
                        <TabsTrigger value="accountant">New Accountant</TabsTrigger>
                        {isSuperAdmin && (
                            <TabsTrigger value="superadmin">New Super Admin</TabsTrigger>
                        )}
                    </TabsList>
                    <TabsContent value="customer">
                        <NewCustomer/>
                    </TabsContent>
                    <TabsContent value="admin">
                        <NewAdmin/>
                    </TabsContent>
                    <TabsContent value="accountant">
                        <NewAccountant/>
                    </TabsContent>
                    {isSuperAdmin && (
                        <TabsContent value="superadmin">
                            <NewSuperAdmin/>
                        </TabsContent>
                    )}
                </Tabs>
            </div>
        </RequireAuth>
    );
}