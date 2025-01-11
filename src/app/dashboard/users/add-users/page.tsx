// path: src/app/dashboard/users/add-users/page.tsx
'use client'

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewCustomer } from "@/components/users/NewCustomer";
import { NewAdmin } from "@/components/users/NewAdminForm";
import { NewAccountant } from "@/components/users/NewAccountant";
import { NewSuperAdmin } from "@/components/users/NewSuperAdminsForm";
import RequireAuth from "@/components/auth/RequireAuth";
import { useSession } from "next-auth/react";

export default function UsersPage() {
    const [activeTab, setActiveTab] = useState('customer');
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'unauthenticated') {
        return <div>You are not authenticated</div>;
    }

    // Check if the user is a Super Admin
    const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN';

    // Calculate number of columns based on whether Super Admin tab is shown
    const gridCols = isSuperAdmin ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3';

    return (
        <RequireAuth>
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">User Management</h1>

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
                        <NewCustomer />
                    </TabsContent>
                    <TabsContent value="admin">
                        <NewAdmin />
                    </TabsContent>
                    <TabsContent value="accountant">
                        <NewAccountant />
                    </TabsContent>
                    {isSuperAdmin && (
                        <TabsContent value="superadmin">
                            <NewSuperAdmin />
                        </TabsContent>
                    )}
                </Tabs>
            </div>
        </RequireAuth>
    );
}