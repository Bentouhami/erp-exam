// path: src/app/api/v1/clients/route.ts

import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/db";


/**
 * Create a new client
 * @param req
 */
export async function POST(req: NextRequest) {
    if(req.method !== "POST") {
        return NextResponse.json({ message: "Method not allowed!" }, { status: 405 });
    }
    try {
        const client = await req.json();
        const newClient = await prisma.user.create({
            data: client,
        });
        return NextResponse.json(newClient);
    } catch (error) {
        return NextResponse.json({ message: "Error creating client!" }, { status: 500 });
    }
}
/**
 * Get all clients
 * @param req NextRequest
 */
export async function GET(req: NextRequest) {
    if(req.method !== "GET") {
        return NextResponse.json({ message: "Method not allowed!" }, { status: 405 });
    }
    try {
        const clients = await prisma.user.findMany();
        return NextResponse.json(
            {clients},
        );
    } catch (error) {
        return NextResponse.json({ message: "Error retrieving clients!" }, { status: 500 });
    }
}
