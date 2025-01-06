// path: src/app/api/v1/clients/[id]/route.ts
import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/db";

/**
 * Get client by id
 * @param req
 */
export async function GET(req: NextRequest) {
    if(req.method !== "GET") {
        return NextResponse.json({ message: "Method not allowed!" }, { status: 405 });
    }
    try {
        const { id } = await req.json();
        const client = await prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (!client) {
            return NextResponse.json({ message: "Client not found!" }, { status: 404 });
        }
        return NextResponse.json({client}, {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        return NextResponse.json({ message: "Error retrieving client!" }, { status: 500 });
    }
}


/**
 * Update client by id
 * @param req
 * @param params
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    if(req.method !== "PUT") {
        return NextResponse.json({ message: "Method not allowed!" }, { status: 405 });
    }

    try {
        const {id} = params;
        const client = await prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (!client) {
            return NextResponse.json({ message: "Client not found!" }, { status: 404 });
        }
        return NextResponse.json({client}, {
            status: 201,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        return NextResponse.json({ message: "Error retrieving client!" }, { status: 500 });
    }
}

/**
 * Delete client by id
 * @param req
 * @param params
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    if(req.method !== "DELETE") {
        return NextResponse.json({ message: "Method not allowed!" }, { status: 405 });
    }

    try {
        const {id} = params;
        const client = await prisma.user.findUnique({
            where: {
                id: id,
            },
        });
        if (!client) {
            return NextResponse.json({ message: "Client not found!" }, { status: 404 });
        }
        return NextResponse.json({client}, {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        return NextResponse.json({ message: "Error retrieving client!" }, { status: 500 });
    }
}