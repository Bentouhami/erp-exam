// path: src/services/backend-services/Bk_UserService.ts
'use server';
'use server';

import prisma from "@/lib/db";

/**
 * Check if a user already exists by email
 * @param email - Email of the user to check
 * @returns ID of the user if it exists, null otherwise
 */
export async function isUserAlreadyExistByEmail(email: string): Promise<string | null> {
    const user = await prisma.user.findFirst({
        where: { email },
        select: { id: true }
    });
    return user ? user.id : null;
}

/**
 * Check if a user is verified by ID
 * @param id - ID of the user to check
 * @returns True if the user is verified, false otherwise
 */
export async function isUserVerifiedById(id: string): Promise<boolean> {
    const user = await prisma.user.findFirst({
        where: { id },
        select: { isVerified: true }
    });
    return user ? user.isVerified : false;
}

/**
 * Check if a user verification token is expired
 * @param id - ID of the user to check
 * @returns True if the token is expired, false otherwise
 */
export async function isUserVerificationTokenExpired(id: string): Promise<boolean> {
    const user = await prisma.user.findFirst({
        where: { id },
        select: { UserVerificationToken: true }
    });

    if (!user || !user.UserVerificationToken || user.UserVerificationToken.length === 0) {
        return false;
    }

    const token = user.UserVerificationToken[0];
    return token.expires < new Date();
}



