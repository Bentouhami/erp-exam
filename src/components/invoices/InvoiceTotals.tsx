// path: src/components/invoices/InvoiceTotals.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const InvoiceTotals = ({
                           groupedVAT = {}, // Default value
                           totalHT = "0.00",
                           totalVAT = "0.00",
                           totalTTC = "0.00"
                       }: {
    groupedVAT?: Record<string, { vatBaseAmount: number; vatAmount: number }>;
    totalHT: string;
    totalVAT: string;
    totalTTC: string;
}) => {
    return (
        <Card className="w-full max-w-md ml-auto">
            <CardContent className="pt-6">
                <div className="space-y-2">
                    {/* Display VAT breakdown per rate */}
                    {Object.entries(groupedVAT ?? {}).map(([rate, details]) => (
                        <div key={rate} className="space-y-1">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Base {rate}:</span>
                                <span className="font-medium">
                                    {details.vatBaseAmount.toFixed(2)} €
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">VAT {rate}:</span>
                                <span className="font-medium">
                                    {details.vatAmount.toFixed(2)} €
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Total HT, VAT, and TTC */}
                    <div className="h-px bg-gray-200 my-2" />
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Total Untaxed Amount (HT):</span>
                        <span className="font-medium">{totalHT}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Total VAT:</span>
                        <span className="font-medium">{totalVAT}</span>
                    </div>
                    <div className="h-px bg-gray-200 my-2" />
                    <div className="flex justify-between items-center text-base font-semibold">
                        <span>Total TTC:</span>
                        <span>{totalTTC}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default InvoiceTotals;
