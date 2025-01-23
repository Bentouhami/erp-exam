// path: src/app/api/v1/invoices/generate-number/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateInvoiceNumber } from '@/lib/utils/invoice';

export async function GET(req: NextRequest) {
    if (req.method !== 'GET') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    try {
        const invoiceNumber = await generateInvoiceNumber();
        if (!invoiceNumber) {
            return NextResponse.json({ message: 'Invoice number not found' }, { status: 404 });
        }
        return NextResponse.json({ invoiceNumber });
    } catch (error) {
        console.error('Error generating invoice number:', error);
        return NextResponse.json(
            { message: "Error generating invoice number" },
            { status: 500 }
        );
    }
}
