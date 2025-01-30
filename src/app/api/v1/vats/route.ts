import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
    if (req.method !== "GET") {
        return NextResponse.json({ message: "Method not allowed!" }, { status: 405 });
    }

    try {
        // Get countryId from query parameters
        const url = new URL(req.url);
        const countryId = url.searchParams.get('countryId');

        // Build the query based on whether countryId is provided
        const query = {
            where: countryId ? { countryId: parseInt(countryId) } : {},
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
        };

        const vatTypes = await prisma.vat.findMany(query);

        if (!vatTypes) {
            return NextResponse.json({ message: "Vat types not found!" }, { status: 404 });
        }
        return NextResponse.json(
            { vatTypes },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ message: "Error retrieving vat types!" }, { status: 500 });
    }
}