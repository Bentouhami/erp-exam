import { NextResponse } from 'next/server'
import prisma from "@/lib/db";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    const customers = await prisma.user.findMany({
        where: {
            role: 'CUSTOMER',
            OR: search
                ? [
                    { name: { contains: search, mode: 'insensitive' } },
                    { userNumber: { contains: search, mode: 'insensitive' } },
                    { vatNumber: { contains: search, mode: 'insensitive' } },
                ]
                : undefined,
        },
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

