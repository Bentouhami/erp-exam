// path: src/app/api/v1/invoices/[id]/route.ts

import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/db";

/**
 * Get invoice by id
 * @param req
 */
export async function GET(req: NextRequest) {
    if(req.method !== "GET") {
        return NextResponse.json({ message: "Method not allowed!" }, { status: 405 });
    }
    try {
        const { id } = await req.json();
        const invoice = await prisma.invoice.findUnique({
            where: {
                id : Number(id),
            },
        });
        if (!invoice) {
            return NextResponse.json({ message: "Invoice not found!" }, { status: 404 });
        }
        return NextResponse.json({invoice}, {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        return NextResponse.json({ message: "Error retrieving invoice!" }, { status: 500 });
    }
}


/**
 * Update invoice by id
 * @param req
 * @param params
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    if(req.method !== "PUT") {
        return NextResponse.json({ message: "Method not allowed!" }, { status: 405 });
    }

    try {
        const {id} = params;
        const invoice = await prisma.invoice.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!invoice) {
            return NextResponse.json({ message: "Invoice not found!" }, { status: 404 });
        }
        return NextResponse.json(invoice);
    } catch (error) {
        return NextResponse.json({ message: "Error retrieving invoice!" }, { status: 500 });
    }
}

/**
 * Delete invoice by id
 * @param req
 * @param params
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    if(req.method !== "DELETE") {
        return NextResponse.json({ message: "Method not allowed!" }, { status: 405 });
    }

    try {
        const {id} = params;
        const invoice = await prisma.invoice.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!invoice) {
            return NextResponse.json({ message: "Invoice not found!" }, { status: 404 });
        }
        return NextResponse.json({invoice}, {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        return NextResponse.json({ message: "Error retrieving invoice!" }, { status: 500 });
    }
}
