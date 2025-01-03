// path: src/app/api/v1/item-classes/route.ts

import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/db";

/**
 * GET Method to get all item classes
 * @param req - The request object
 * @returns A response object with the status code and the item classes
 */
export async function GET(req: NextRequest) {
    if (req.method !== "GET") {
        return NextResponse.json({message: "Method not allowed!"}, {status: 405});
    }
    try {
        const itemClasses = await prisma.itemClass.findMany({
            select: {
                id: true,
                label: true,
            }
        });
        if (!itemClasses) {
            return NextResponse.json({message: "Item classes not found!"}, {status: 404});
        }
        return NextResponse.json(
            {itemClasses}, {status: 200} // 200 OK
        );
    } catch (error) {
        return NextResponse.json({message: "Error retrieving item classes!"}, {status: 500});
    }
}