import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { decrypt, encrypt } from "@/lib/security/security"

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: params.id },
            select: {
                id: true,
                userNumber: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                createdAt: true,
            },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // decrypt data before sending it to the client
        user.email = decrypt(user.email)
        user.firstName = decrypt(user.firstName)
        user.lastName = decrypt(user.lastName)

        return NextResponse.json(user)
    } catch (error) {
        console.error('Error fetching user:', error)
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json()
        const { firstName, lastName, email, role } = body

        const updatedUser = await prisma.user.update({
            where: { id: params.id },
            data: {
                firstName: encrypt(firstName),
                lastName: encrypt(lastName),
                email: encrypt(email),
                role,
            },
            select: {
                id: true,
                userNumber: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                createdAt: true,
            },
        })

        // decrypt data before sending it to the client
        updatedUser.email = decrypt(updatedUser.email)
        updatedUser.firstName = decrypt(updatedUser.firstName)
        updatedUser.lastName = decrypt(updatedUser.lastName)

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error('Error updating user:', error)
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.user.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ message: 'User deleted successfully' })
    } catch (error) {
        console.error('Error deleting user:', error)
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
    }
}

