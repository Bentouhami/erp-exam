// src/app/api/v1/users/route.ts
import {NextRequest, NextResponse} from 'next/server'
import prisma from "@/lib/db";

export async function GET(request : NextRequest) {

    if(request.method !== 'GET') return NextResponse.json({error: "Methode not allowed"}, {status: 405})

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                userNumber: true,
                firstName: true,
                lastName: true,
                name: true,
                email: true,
                role: true,
                vatNumber: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return NextResponse.json(users)
    } catch (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json({error: 'Failed to fetch users'}, {status: 500})
    }
}

export async function DELETE(request: NextRequest) {
    if(request.method !== 'DELETE') return NextResponse.json({error: "Method not allowed"}, {status: 405})

    try {
        const {searchParams} = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({error: 'User ID is required'}, {status: 400})
        }

        await prisma.user.delete({
            where: {id},
        })

        return NextResponse.json({message: 'User deleted successfully'})
    } catch (error) {
        console.error('Error deleting user:', error)
        return NextResponse.json({error: 'Failed to delete user'}, {status: 500})
    }
}

