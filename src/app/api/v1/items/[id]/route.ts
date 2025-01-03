// path: src/app/api/v1/items/[id]/route.ts
import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/db";

/**
 * Get article by id
 * @param req
 */
export async function GET(req: NextRequest) {
    if(req.method !== "GET") {
        return NextResponse.json({ message: "Method not allowed!" }, { status: 405 });
    }
    try {
        const { id } = await req.json();
        const article = await prisma.item.findUnique({
            where: {
                id : Number(id),
            },
        });
        if (!article) {
            return NextResponse.json({ message: "Article not found!" }, { status: 404 });
        }
        return NextResponse.json({article}, {
            status: 200

        });
    } catch (error) {
        return NextResponse.json({ message: "Error retrieving article!" }, { status: 500 });
    }
}


/**
 * Update article by id
 * @param req
 * @param params
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    if(req.method !== "PUT") {
        return NextResponse.json({ message: "Method not allowed!" }, { status: 405 }); // 405 Method Not Allowed
    }

    try {
        const {id} = params;
        const article = await prisma.item.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!article) {
            return NextResponse.json({ message: "Article not found!" }, { status: 404 }); // 404 Not Found
        }
        return NextResponse.json({article}, {status: 201}); // 201 Created
    } catch (error) {
        return NextResponse.json({ message: "Error retrieving article!" }, { status: 500 }); // 500 Internal Server Error
    }
}

/**
 * Delete article by id
 * @param req
 * @param params
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    if(req.method !== "DELETE") {
        return NextResponse.json({ message: "Method not allowed!" }, { status: 405 });
    }

    try {
        const {id} = params;
        const article = await prisma.item.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!article) {
            return NextResponse.json({ message: "Article not found!" }, { status: 404 });
        }
        return NextResponse.json({article}, {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        return NextResponse.json({ message: "Error retrieving article!" }, { status: 500 });
    }
}