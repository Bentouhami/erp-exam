// path: src/app/api/v1/cities/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
    if (req.method !== "GET") {
        return NextResponse.json({ message: "Method not allowed!" }, { status: 405 });
    }

    // Get countryId from query parameters
    const url = new URL(req.url);
    const countryId = url.searchParams.get('countryId');

    if (!countryId) {
        return NextResponse.json({ message: "Country ID not provided!" }, { status: 400 });
    }

    try {
        const cities = await prisma.city.findMany({
            where: {
                countryId: parseInt(countryId),
            },
            select: {
                id: true,
                cityCode: true,
                name: true,
                countryId: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        if (!cities) {
            return NextResponse.json({ message: "Cities not found!" }, { status: 404 });
        }

        return NextResponse.json(
            { countries: cities },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ message: "Error retrieving cities!" }, { status: 500 });
    }
}