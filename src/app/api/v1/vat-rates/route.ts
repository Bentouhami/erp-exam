// path: src/app/api/v1/vat-rates/route.ts
export const dynamic = "force-dynamic"; // Prevents Next.js from trying to pre-render

import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/db";
import {Decimal} from "@prisma/client/runtime/library";
import {accessControlHelper} from "@/lib/utils/accessControlHelper";

export async function GET(req: NextRequest) {
    if (req.method !== "GET") {
        return NextResponse.json({message: "Method not allowed!"}, {status: 405});
    }

    if (!accessControlHelper) {
        return NextResponse.json({message: "Access denied!"}, {status: 403});
    }

    try {
        const url = new URL(req.url);
        const countryId = url.searchParams.get("countryId"); // Belgium (1) or France (2)
        const itemClassId = url.searchParams.get("itemClassId"); // Category of the item
        const isEnterprise = url.searchParams.get("isEnterprise") === "true"; // Business or Individual

        if (!countryId || isNaN(parseInt(countryId))) {
            return NextResponse.json({message: "countryId is required and must be a valid number."}, {status: 400});
        }

        if (!itemClassId || isNaN(parseInt(itemClassId))) {
            return NextResponse.json({message: "itemClassId is required and must be a valid number."}, {status: 400});
        }

        console.log("Fetching VAT rate for:", {countryId, itemClassId, isEnterprise});

        // Fetch VAT rate based on country & item class
        const vatRate = await prisma.vatRate.findFirst({
            where: {
                countryId: parseInt(countryId),
                itemClassId: parseInt(itemClassId),
            },
            select: {
                id: true,
                vatPercent: true,
                vatType: true,
                country: {
                    select: {
                        id: true,
                        countryCode: true,
                        name: true,
                    },
                },
                itemClass: {
                    select: {
                        id: true,
                        label: true,
                    },
                },
            },
        });

        if (!vatRate) {
            return NextResponse.json({message: "No VAT rate found for the given country and item class."}, {status: 404});
        }

        console.log("VAT Rate:", vatRate);

        let finalVatRate = new Decimal(vatRate.vatPercent).toNumber();

        // 🚀 **VAT EXEMPTION RULES**
        if (parseInt(countryId) === 2) {
            // France 🇫🇷 → No VAT for all users
            finalVatRate = 0;
        } else if (parseInt(countryId) === 1 && isEnterprise) {
            // Belgium 🇧🇪 → Normal VAT for businesses (no changes)
            finalVatRate = finalVatRate;
        } else if (parseInt(countryId) === 1 && !isEnterprise) {
            // Belgium 🇧🇪 → Normal VAT for individuals (no changes)
            finalVatRate = finalVatRate;
        }

        console.log("finalVatRate :", finalVatRate)

        return NextResponse.json(
            {
                id: vatRate.id,
                vatPercent: parseFloat(finalVatRate.toFixed(2)),
                vatType: vatRate.vatType,
                country: vatRate.country,
                itemClass: vatRate.itemClass,
            },
            {status: 200}
        );
    } catch (error) {
        console.error("Error retrieving VAT rate:", error);
        return NextResponse.json({message: "Error retrieving VAT rate."}, {status: 500});
    }
}
