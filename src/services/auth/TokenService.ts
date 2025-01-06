// path: src/services/auth/TokenService.ts
import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';
import {TokenTypeDTO} from "@/services/dtos/UserDtos";

const prisma = new PrismaClient();

/**
 * Generate a verification token for a user
 * @param userId - ID of the user to associate the token with
 * @param tokenType - Type of the token (EMAIL_VERIFICATION, PASSWORD_RESET, TWO_FACTOR_AUTH)
 * @param expiresInHours - Expiration time in hours (default is 1 hour)
 * @returns The created token object
 */
export async function generateUserToken(
    userId: string,
    tokenType: TokenTypeDTO,
    expiresInHours: number = 1
) {
    try {
        const token = randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

        const newToken = await prisma.userVerificationToken.create({
            data: {
                userId: userId,
                token: token,
                type: tokenType,
                expires: expires,
            },
        });

        return newToken;
    } catch (error) {
        console.error('Error generating user token:', error);
        throw new Error('Failed to generate user token');
    }
}
