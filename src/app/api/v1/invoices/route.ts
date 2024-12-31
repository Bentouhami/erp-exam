// path: src/app/api/v1/invoices/route.ts
import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/db";
//
// export async function PUT(req: Request) {
//
//    if(req.method !== "PUT") {
//         return NextResponse.json({ message: "Method not allowed!" }, { status: 405 });
//     }
//
//    try {
//         const { id } = await req.json();
//         const invoice = await prisma.invoice.findUnique({
//             where: {
//                 id,
//             },
//         });
//         if (!invoice) {
//             return NextResponse.json({ message: "Invoice not found!" }, { status: 404 });
//         }
//         return NextResponse.json(invoice);
//     } catch (error) {
//         return NextResponse.json({ message: "Error retrieving invoice!" }, { status: 500 });
//     }
// }

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
        const newInvoice = await prisma.invoice.create({
            data: invoice,
        });
        return NextResponse.json(newInvoice);
    } catch (error) {
        return NextResponse.json({ message: "Error creating invoice!" }, { status: 500 });
    }
}