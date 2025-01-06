// path : src/app/dashboard/page.tsx

// path: src/app/dashboard/page.tsx

import RequireAuth from "@/components/auth/RequireAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Package, DollarSign } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import a chart component (replace with your actual chart component)
const LineChart = dynamic(() => import('@/components/charts/LineChart'), { ssr: false });

export default function Dashboard() {
    return (
        // <RequireAuth>
            <div className="space-y-8">
                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">254</div>
                            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12,234</div>
                            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">573</div>
                            <p className="text-xs text-muted-foreground">+19% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$45,231.89</div>
                            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid gap-8 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Revenue Over Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <LineChart />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Growth</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <LineChart />
                        </CardContent>
                    </Card>
                </div>

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
        // </RequireAuth>
    );
}
