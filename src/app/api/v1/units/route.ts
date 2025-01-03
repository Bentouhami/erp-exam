// path: src/app/api/v1/units/route.ts

import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/db";

/**
 * GET Method to get all units
 * @param req - The request object
 * @returns A response object with the status code and the units
 */
export async function GET(req: NextRequest) {
    if (req.method !== "GET") {
        return NextResponse.json({message: "Method not allowed!"}, {status: 405});
    }
    try {
        const units = await prisma.unit.findMany({
            select: {
                id: true,
                name: true,
            }
        });
        if (!units) {
            return NextResponse.json({message: "Units not found!"}, {status: 404});
        }
        return NextResponse.json(
            {units}, {status: 200} // 200 OK
        );
    } catch (error) {
        return NextResponse.json({message: "Error retrieving units!"}, {status: 500});
    }
}