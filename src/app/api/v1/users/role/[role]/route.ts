// src/app/api/v1/users/role/[role]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { role: string } }) {
    try {
        const userRole = params.role; // Extract the role from the URL

        let whereClause = {};

        switch (userRole) {
            case 'SUPER_ADMIN':
                whereClause = {}; // SUPER_ADMIN sees all users
                break;
            case 'ADMIN':
                whereClause = { NOT: { role: 'SUPER_ADMIN' } }; // ADMIN cannot see SUPER_ADMIN
                break;
            case 'ACCOUNTANT':
                whereClause = { role: 'CUSTOMER' }; // ACCOUNTANT sees only customers
                break;
            default:
                return NextResponse.json({ error: 'Invalid role' }, { status: 403 });
        }

        const users = await prisma.user.findMany({
            where: whereClause,
            select: {
                id: true,
                userNumber: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                isEnabled: true,
                isVerified: true,
                isEnterprise: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        //
        // users.forEach(user => {
        //     user.email = decrypt(user.email);
        //     user.firstName = decrypt(user.firstName);
        //     user.lastName = decrypt(user.lastName);
        // });

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}
