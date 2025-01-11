// path: src/app/api/v1/item-taxes/route.ts

import {NextResponse} from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
    try {
        const itemTaxes = await prisma.itemTax.findMany({
            include: {
                utax: {
                    select: {
                        label: true,
                    },
                },
            },
        });

        // Transform the response to include id and label
        const transformedTaxes = itemTaxes.map((tax) => ({
            id: tax.id,
            label: tax.utax.label, // Use the label from Utax
        }));

        return NextResponse.json({taxes: transformedTaxes});
    } catch (error) {
        console.error('Error fetching item taxes:', error);
        return NextResponse.json({error: 'Failed to fetch item taxes'}, {status: 500});
    }
}
