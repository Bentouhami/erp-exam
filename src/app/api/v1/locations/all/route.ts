// path: src/app/api/v1/locations/all/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
    try {
        const countries = await prisma.country.findMany({
            select: {
                id: true,
                name: true,
                countryCode: true,
            },
            orderBy: { name: "asc" },
        });

        const cities = await prisma.city.findMany({
            select: {
                id: true,
                cityCode: true,
                name: true,
                countryId: true,
            },
            orderBy: { name: "asc" },
        });

        return NextResponse.json(
            { countries, cities },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error retrieving locations:", error);
        return NextResponse.json({ message: "Error retrieving data!" }, { status: 500 });
    }
}
