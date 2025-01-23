// path: src/app/api/v1/invoices/generate-number/route.ts
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server';
import { generateInvoiceNumber } from '@/lib/utils/invoice';

export async function GET(req: NextResponse) {
    try {
        const invoiceNumber = await generateInvoiceNumber();
        if (!invoiceNumber) {
            return NextResponse.json({ message: 'Invoice number not found' }, { status: 404 });
        }

        // Disable caching
        const headers = new Headers();
        headers.set('Cache-Control', 'no-store, max-age=0');
        headers.set('Pragma', 'no-cache');
        headers.set('Expires', '0');

        return NextResponse.json({ invoiceNumber }, { headers });
    } catch (error) {
        console.error('Error generating invoice number:', error);
        return NextResponse.json(
            { message: 'Error generating invoice number' },
            { status: 500 },
        );
    }
}