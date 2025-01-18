// path: src/app/api/v1/countries/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
    if (req.method !== "GET") {
        return NextResponse.json({ message: "Method not allowed!" }, { status: 405 });
    }

    try {
        const countries = await prisma.country.findMany({
            select: {
                id: true,
                name: true,
                countryCode: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        if (!countries) {
            return NextResponse.json({ message: "Countries not found!" }, { status: 404 });
        }

        return NextResponse.json(
            { countries },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ message: "Error retrieving countries!" }, { status: 500 });
    }
}