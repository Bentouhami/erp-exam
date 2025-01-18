// path: src/components/dashboard/forms/ItemFormSkeleton.tsx

'use client';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ItemFormSkeleton() {
    return (
        <div className="space-y-8">
            {/* Item Number Field Skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-full" />
            </div>

            {/* Label Field Skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-10 w-full" />
            </div>

            {/* Pricing Section Skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>

            {/* VAT Selection Skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-10 w-full" />
            </div>

            {/* Unit Selection Skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-10 w-full" />
            </div>

            {/* Item Class Selection Skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-10 w-full" />
            </div>

            {/* Stock Quantity and Min Quantity Skeleton */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>

            {/* Additional Taxes Skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-10 w-full" />
            </div>

            {/* Save Button Skeleton */}
            <div className="flex justify-end">
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    );
}
