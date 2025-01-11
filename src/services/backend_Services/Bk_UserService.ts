// path: src/services/backend-services/Bk_UserService.ts
'use server';

import prisma from "@/lib/db";
import {Simulate} from "react-dom/test-utils";

/**
 * Check if a user already exists by email
 * @returns ID of the user if it exists, null otherwise
 * @param emailHash
 */
export async function isUserAlreadyExistByEmailHash(emailHash: string): Promise<Partial<any> | null> {
    const user = await prisma.user.findUnique({
        where: { emailHash },
        select: { id: true, name: true, emailHash: true }
    });
    return user ? user : null;
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



