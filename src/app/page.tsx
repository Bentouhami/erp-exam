// path: src/app/page.tsx
'use client';

import RequireAuth from "@/components/auth/RequireAuth";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {DollarSign, FileText, Package, Users} from 'lucide-react';
import React, {useEffect, useState} from "react";
import {API_DOMAIN} from "@/lib/utils/constants";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import axios from "axios";
import DashboardCharts from "@/components/charts/DashboardCharts";
import UsersList from "@/components/lists/UsersList";
import AdminList from "@/components/lists/AdminList";
import AccountantList from "@/components/lists/AccountantList";

export default function Dashboard() {
    const router = useRouter();
    const {data: session, status} = useSession();
    const [summary, setSummary] = useState({
        totalInvoices: '',
        totalCustomers: '',
        totalItems: '',
        totalRevenue: ''
    });
    const [role, setRole] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth');
            return;
        }

        if (session?.user?.role) {
            setRole(session.user.role);
        }

        const fetchSummaryData = async () => {
            try {
                const response = await axios.get(`${API_DOMAIN}/dashboard/summary`);
                if (response.status === 200 && response.data) {
                    setSummary(response.data);
                }
            } catch (error) {
                console.error('Error fetching summary data:', error);
            }
        };

        fetchSummaryData();
    }, [status, router, session, role]);

    return (
        <RequireAuth>
            <div className="space-y-8">
                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summary.totalInvoices}</div>
                            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                        </CardContent>
                    </Card>
                    {role !== 'ACCOUNTANT' && (
                        <>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground"/>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{summary.totalCustomers}</div>
                                    <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                                    <Package className="h-4 w-4 text-muted-foreground"/>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{summary.totalItems}</div>
                                    <p className="text-xs text-muted-foreground">+19% from last month</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                    <DollarSign className="h-4 w-4 text-muted-foreground"/>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">${summary.totalRevenue}</div>
                                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>

                {/* Charts Section */}

                    <DashboardCharts/>


                {/* List of users according to a role */}
                {role === 'ADMIN' && <AdminList/>}
                {role === 'SUPER_ADMIN' && <UsersList role={'SUPER_ADMIN'}/>}
                {role === 'ACCOUNTANT' && <AccountantList/>}


                {/* Recent Activity Section */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Invoices</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                <li className="flex justify-between">
                                    <span>Invoice #INV-001</span>
                                    <span>$2,300.00</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Invoice #INV-002</span>
                                    <span>$1,200.00</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Invoice #INV-003</span>
                                    <span>$3,450.00</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </RequireAuth>
    );
}
