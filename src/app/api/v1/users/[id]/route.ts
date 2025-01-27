// path: src/app/api/v1/users/[id]/route.ts

import {NextRequest, NextResponse} from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {

    if (request.method !== 'GET'){
        return NextResponse.json({error: "Method not allowed"}, {status : 405})
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id: params.id },
            select: {
                id: true,
                userNumber: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                mobile: true,
                fax: true,
                paymentTermDays: true,
                role: true,
                isEnterprise: true,
                companyName: true,
                vatNumber: true,
                isVerified: true,
                isEnabled: true,
                createdAt: true,
            },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }
        //
        // // decrypt data before sending it to the client
        // user.email = decrypt(user.email)
        // user.firstName = decrypt(user.firstName)
        // user.lastName = decrypt(user.lastName)

        return NextResponse.json(user, {status : 200})
    } catch (error) {
        console.error('Error fetching user:', error)
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    if (request.method !== 'PUT'){
        return NextResponse.json({error: "Method not allowed"}, {status : 405})
    }

    try {
        const body = await request.json()
        const { firstName, lastName, email, role, phone, mobile, fax, paymentTermDays, isEnterprise, companyName, vatNumber } = body

        const updatedUser = await prisma.user.update({
            where: { id: params.id },
            data: {
                firstName,
                lastName,
                name: `${firstName} ${lastName}`,
                email : email || '',
                role : role || 'CUSTOMER',
                phone : phone || '',
                mobile : mobile || '',
                fax :  fax || '',
                paymentTermDays: paymentTermDays || 0,
                isEnterprise : isEnterprise || false,
                companyName : companyName || '',
                vatNumber : vatNumber || '',
            },
            select: {
                id: true,
                userNumber: true,
                firstName: true,
                lastName: true,
                name: true,
                email: true,
                phone: true,
                mobile: true,
                fax: true,
                paymentTermDays: true,
                role: true,
                isEnterprise: true,
                companyName: true,
                vatNumber: true,
                isVerified: true,
                isEnabled: true,
                createdAt: true,
            },
        })

        // // decrypt data before sending it to the client
        // updatedUser.email = decrypt(updatedUser.email)
        // updatedUser.firstName = decrypt(updatedUser.firstName)
        // updatedUser.lastName = decrypt(updatedUser.lastName)

        return NextResponse.json(updatedUser, {status : 201})
    } catch (error) {
        console.error('Error updating user:', error)
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {

    if (request.method !== 'DELETE'){
        return NextResponse.json({error: "Method not allowed"}, {status : 405})
    }
    try {
        await prisma.user.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ message: 'User deleted successfully' }, {status : 200})
    } catch (error) {
        console.error('Error deleting user:', error)
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
    }
}

