// src/app/api/v1/users/role/[role]/route.ts
import {NextRequest, NextResponse} from 'next/server';
import prisma from "@/lib/db";

export async function GET(req: NextRequest, {params}: { params: { role: string } }) {
    if(req.method !== 'GET') return NextResponse.json({error: "Method not allowed."}, {status : 405})

    try {
        const userRole = params.role; // Extract the role from the URL

        let whereClause = {};

        switch (userRole) {
            case 'SUPER_ADMIN':
                whereClause = {}; // SUPER_ADMIN sees all users
                break;
            case 'ADMIN':
                whereClause = {NOT: {role: 'SUPER_ADMIN'}}; // ADMIN cannot see SUPER_ADMIN
                break;
            case 'ACCOUNTANT':
                whereClause = {role: 'CUSTOMER'}; // ACCOUNTANT sees only customers
                break;
            default:
                return NextResponse.json({error: 'Invalid role'}, {status: 403});
        }

        const users = await prisma.user.findMany({
            where: whereClause,
            select: {
                id: true,
                userNumber: true,
                firstName: true,
                lastName: true,
                name: true,
                role: true,
                email: true,
                isEnabled: true,
                isVerified: true,
                isEnterprise: true,
                phone: true,
                vatNumber: true,
                companyName: true,
                companyNumber: true,
                exportNumber: true,
                lastLogin: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Ensure no null values are returned
        const sanitizedUsers = users.map(user => ({
            ...user,
            userNumber: user.userNumber || '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            name: user.name || '',
            email: user.email || '',
            role: user.role || '',
        }));

        return NextResponse.json(sanitizedUsers, {status : 200});
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({error: 'Failed to fetch users'}, {status: 500});
    }
}
