// path: src/app/api/v1/location/[country]/cities/route.ts
import {NextRequest} from "next/server";
import prisma from "@/lib/db";

/**
 * Get All cities
 */

export async function GET(request: NextRequest, {params}: { params: { country: string } }) {

    if (request.method !== "GET") {
        return new Response("Method not allowed", {status: 405});
    }

    try {
        const {country} = params;

        if (!country) {
            return new Response("Country is required", {status: 400});
        }
        const countryId = await prisma.country.findFirst({
            where: {
                name: {
                    equals: country,
                    mode: "insensitive",
                },

            },
        });

        const response = await prisma.city.findMany({
            where: {
                countryId: countryId?.id,
            },
            select: {
                id: true,
                name: true,
                cityCode: true,
                country: {
                    select: {
                        id: true,
                        countryCode: true,
                        name: true,
                    },
                },
            },
            take: 10,
            orderBy: {
                name: "asc",
            },
        });
        if (!response) {
            return new Response("Cities not found", {status: 404});
        }

        const data = response;
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        return new Response("Internal server error", {status: 500});
    }
}