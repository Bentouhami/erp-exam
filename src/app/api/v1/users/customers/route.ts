// path: src/app/api/v1/users/customers/route.ts

import {NextRequest, NextResponse} from 'next/server'
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {


    const customers = await prisma.user.findMany({
        where: {
            role: 'CUSTOMER',
        },
        select: {
            id: true,
            isEnterprise: true,
            userNumber: true,
            vatNumber: true,
            firstName: true,
            lastName: true,
            name: true,
            role: true,
            email: true,
            createdAt: true,
        },
    })

    console.log('log ====> customers BEFORE decrypting', customers)
    return NextResponse.json(customers)
}

export async function POST(request: NextRequest) {
    const body = await request.json()

    const customer = await prisma.user.create({
        data: {
            ...body,
            role: 'CUSTOMER',
        },
    })

    return NextResponse.json(customer)
}

