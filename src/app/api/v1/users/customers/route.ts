// path: src/app/api/v1/users/customers/route.ts

import { NextResponse } from 'next/server'
import prisma from "@/lib/db";
import {decrypt} from "@/lib/security/security";

export async function GET(request: Request) {


    const customers = await prisma.user.findMany({
        where: {
            role: 'CUSTOMER',
        },
        select: {
            id: true,
            userNumber: true,
            vatNumber: true,
            firstName: true,
            lastName: true,
            name: true,
            // email: true,
            createdAt: true,
        },
    })

    // decrypt sensitive names
    customers.forEach(customer => {
        customer.firstName = decrypt(customer.firstName!);
        customer.lastName = decrypt(customer.lastName!);
        customer.name = `${customer.firstName} ${customer.lastName}`
    })

    return NextResponse.json(customers)
}

export async function POST(request: Request) {
    const body = await request.json()

    const customer = await prisma.user.create({
        data: {
            ...body,
            role: 'CUSTOMER',
        },
    })

    return NextResponse.json(customer)
}

