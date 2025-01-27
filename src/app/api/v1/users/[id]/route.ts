// path: src/app/api/v1/users/[id]/route.ts

import {NextRequest, NextResponse} from 'next/server'
import prisma from '@/lib/db'
import {saltAndHashPassword} from "@/lib/utils/auth-helper";

export async function GET(request: NextRequest, {params}: { params: { id: string } }) {

    if (request.method !== 'GET') {
        return NextResponse.json({error: "Method not allowed"}, {status: 405})
    }
    try {
        const user = await prisma.user.findUnique({
            where: {id: params.id},
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

        if (!user) {
            return NextResponse.json({error: 'User not found'}, {status: 404})
        }
        //
        // // decrypt data before sending it to the client
        // user.email = decrypt(user.email)
        // user.firstName = decrypt(user.firstName)
        // user.lastName = decrypt(user.lastName)

        return NextResponse.json(user, {status: 200})
    } catch (error) {
        console.error('Error fetching user:', error)
        return NextResponse.json({error: 'Failed to fetch user'}, {status: 500})
    }
}

export async function PUT(request: NextRequest, {params}: { params: { id: string } }) {
    if (request.method !== 'PUT') {
        return NextResponse.json({error: "Method not allowed"}, {status: 405});
    }

    try {
        const body = await request.json();

        // Remove null or empty string values
        const cleanedData = Object.fromEntries(
            Object.entries(body).filter(([_, value]) => value !== null && value !== '')
        );


        // Hash password if it exists
        if (cleanedData.password) {
            cleanedData.password = await saltAndHashPassword(cleanedData.password as string);
        }

        // get user by id
        const user = await prisma.user.findUnique({
            where: {id: params.id},
            select: {
                id: true,
                userNumber: true,
                firstName: true,
                lastName: true,
                name: true,
                email: true,
                password: true,
                role: true,
                isEnterprise: true,
                companyName: true,
                vatNumber: true,
                isVerified: true,
                isEnabled: true,
                createdAt: true,
            },
        });

        if (!user) {
            return NextResponse.json({error: 'User not found'}, {status: 404});
        }

        if(cleanedData.role !== 'SUPER_ADMIN') {
            return NextResponse.json({error: 'You do not have permission to update this user'}, {status: 403});
        }
        const updatedUser = await prisma.user.update({
            where: {id: params.id},
            data: {
                ...cleanedData,
                password: cleanedData.passwrd ?
                    await saltAndHashPassword(cleanedData.password as string) : '',
                name: `${cleanedData.firstName} ${cleanedData.lastName}`,
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
        });

        return NextResponse.json(updatedUser, {status: 201});
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({error: 'Failed to update user'}, {status: 500});
    }
}


export async function DELETE(request: NextRequest, {params}: { params: { id: string } }) {

    if (request.method !== 'DELETE') {
        return NextResponse.json({error: "Method not allowed"}, {status: 405})
    }
    try {
        await prisma.user.delete({
            where: {id: params.id},
        })

        return NextResponse.json({message: 'User deleted successfully'}, {status: 200})
    } catch (error) {
        console.error('Error deleting user:', error)
        return NextResponse.json({error: 'Failed to delete user'}, {status: 500})
    }
}

