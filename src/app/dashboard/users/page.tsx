'use client'

import React, { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {NewCustomer} from "@/components/users/NewCustomer";
import {NewAdmin} from "@/components/users/NewAdminForm";
import {NewAccountant} from "@/components/users/NewAccountant";
import {NewSuperAdmin} from "@/components/users/NewSuperAdminsForm";

export default function UsersPage() {
    const [activeTab, setActiveTab] = useState('customer');

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">User Management</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                    <TabsTrigger value="customer">New Customer</TabsTrigger>
                    <TabsTrigger value="admin">New Admin</TabsTrigger>
                    <TabsTrigger value="accountant">New Accountant</TabsTrigger>
                    <TabsTrigger value="superadmin">New Super Admin</TabsTrigger>
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
                <TabsContent value="superadmin">
                    <NewSuperAdmin />
                </TabsContent>
            </Tabs>
        </div>
    );
}

