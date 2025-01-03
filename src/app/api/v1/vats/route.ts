// path: src/app/api/v1/vats/route.ts

import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/db";

/**
 * GET Method to get all vat types
 * @param req - The request object
 * @returns A response object with the status code and the vat types
 */
export async function GET(req: NextRequest) {
    if (req.method !== "GET") {
        return NextResponse.json({message: "Method not allowed!"}, {status: 405});
    }
    try {
        const vatTypes = await prisma.vat.findMany({
            select: {
                id: true,
                vatPercent: true,
                vatType: true,
                country: {
                    select: {
                        id: true,
                        countryCode: true,
                        name: true,
                    }
                },
            }
        });
        if (!vatTypes) {
            return NextResponse.json({message: "Vat types not found!"}, {status: 404});
        }
        return NextResponse.json(
            {vatTypes}, {status: 200} // 200 OK
        );
    } catch (error) {
        return NextResponse.json({message: "Error retrieving vat types!"}, {status: 500});
    }
}