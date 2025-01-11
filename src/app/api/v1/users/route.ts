// src/app/api/v1/users/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { decrypt } from "@/lib/security/security"

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                userNumber: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        // decrypt data before sending it to the client
        users.forEach(user => {
            user.email = decrypt(user.email)
            user.firstName = decrypt(user.firstName)
            user.lastName = decrypt(user.lastName)
        })

        return NextResponse.json(users)
    } catch (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        await prisma.user.delete({
            where: { id },
        })

        return NextResponse.json({ message: 'User deleted successfully' })
    } catch (error) {
        console.error('Error deleting user:', error)
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
    }
}

