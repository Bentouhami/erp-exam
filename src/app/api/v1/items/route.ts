// path: src/app/api/v1/items/route.ts

import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/db";
import {ItemCreateDTO} from "@/services/dtos/ItemDtos";



/**
 * POST Method to create a new article
 * @param req - The request object
 * @returns A response object with the status code and the created article
 */

export async function POST(req: NextRequest) {
    if (req.method !== "POST") {
        return new Response("Method not allowed", {status: 405});
    }

    try {
        const data : ItemCreateDTO = await req.json();

        const response = await prisma.item.create({
            data: {
                itemNumber: data.itemNumber,
                supplierReference: data.supplierReference,
                barcode: data.barcode,
                label: data.label,
                description: data.description,
                purchasePrice: data.purchasePrice,
                retailPrice: data.retailPrice,
                stockQuantity: data.stockQuantity,
                minQuantity: data.minQuantity,
                unitId: data.unitId,
                classId: data.classId,
                vatType: data.vatType,
            },
        });
        if (!response) {
            return NextResponse.json("Article not found", {status: 404}); // 404 Not Found
        }

        const item = response;
        return NextResponse.json({item}, {
            status: 201,
        }); // 201 Created
    } catch (error) {
        return new Response("Internal server error", {status: 500}); // 500 Internal Server Error
    }
}

/**
 * Get all articles
 * @param req NextRequest
 */
export async function GET(req: NextRequest) {
    if(req.method !== "GET") {
        return NextResponse.json({ message: "Method not allowed!" }, { status: 405 });
    }
    try {
        const articles = await prisma.item.findMany();
        return NextResponse.json(
            {articles}, {status: 200} // 200 OK
        );
    } catch (error) {
        return NextResponse.json({ message: "Error retrieving articles!" }, { status: 500 });
    }
}