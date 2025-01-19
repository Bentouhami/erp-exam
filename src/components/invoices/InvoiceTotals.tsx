// path: src/components/invoices/InvoiceTotals.tsx

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const InvoiceTotals = ({ totalHT, totalVAT, totalTTC }  :{totalHT: string, totalVAT: string, totalTTC: string}) => {
    return (
        <Card className="w-full max-w-md ml-auto">
            <CardContent className="pt-6">
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Untaxed Amount:</span>
                        <span className="font-medium">{totalHT}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Tax 15%:</span>
                        <span className="font-medium">{totalVAT}</span>
                    </div>
                    <div className="h-px bg-gray-200 my-2" />
                    <div className="flex justify-between items-center text-base font-semibold">
                        <span>Total:</span>
                        <span>{totalTTC}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default InvoiceTotals;