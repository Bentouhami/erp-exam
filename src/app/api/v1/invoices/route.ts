// path: src/app/api/v1/invoices/route.ts
import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/db";
import {generateInvoiceNumber} from "@/lib/utils/invoice";

/**
 * Create a new invoice
 * @param req
 */
export async function POST(req: NextRequest) {
    if(req.method !== "POST") {
        return NextResponse.json({ message: "Method not allowed!" }, { status: 405 });
    }

    try {
        const invoice = await req.json();
        if (!invoice.userId) {
            return NextResponse.json({ message: "UserId is required!" }, { status: 400 });
        }

        const invoiceNumber = await generateInvoiceNumber();

        const newInvoice = await prisma.invoice.create({
            data: {
                ...invoice,
                invoiceNumber,
            },
        });

        return NextResponse.json(newInvoice);
    } catch (error) {
        console.error('Error creating invoice:', error);
        return NextResponse.json({ message: "Error creating invoice!" }, { status: 500 });
    }
}

/**
 * Get all invoices
 * @param req NextRequest
 */
export async function GET(req: NextRequest) {
    if(req.method !== "GET") {
        return NextResponse.json({ message: "Method not allowed!" }, { status: 405 });
    }
    try {
        const invoices = await prisma.invoice.findMany();
        return NextResponse.json(
            {invoices},
        );
    } catch (error) {
        return NextResponse.json({ message: "Error retrieving invoices!" }, { status: 500 });
    }
}


