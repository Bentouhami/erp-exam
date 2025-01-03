// path: src/app/api/v1/items/generate-number/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { generateItemNumber } from '@/lib/utils/item';

export async function GET(req: NextRequest) {
    try {
        const itemNumber = await generateItemNumber();
        if (!itemNumber) {
            return NextResponse.json({ message: 'Item number not found' }, { status: 404 });
        }
        console.log("log ===> itemNumber in generate-number/route.ts: ", itemNumber);
        return NextResponse.json({ itemNumber });
    } catch (error) {
        console.error('Error generating item number:', error);
        return NextResponse.json(
            { message: "Error generating item number" },
            { status: 500 }
        );
    }
}