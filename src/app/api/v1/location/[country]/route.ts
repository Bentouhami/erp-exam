// path: src/app/api/v1/location/[country]/route.ts
import {NextRequest} from "next/server";
import prisma from "@/lib/db";

/**
 * Get All countries
 */

export async function GET(request: NextRequest, { params } : { params: { country: string } }) {

    if (request.method !== "GET") {
        return new Response("Method not allowed", {status: 405});
    }

    try {
        const {country} = params;

        if (!country) {
            return new Response("Country is required", {status: 400});
        }

        const response = await prisma.country.findFirst({
            where: {
                name: {
                    equals: country,
                    mode: "insensitive", // Recherche insensible à la casse
                },
            },

        });

        if (!response) {
            return new Response("Country not found", {status: 404});
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

