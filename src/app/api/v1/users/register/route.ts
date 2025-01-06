// path: src/app/api/v1/users/register/route.ts

import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/db";
import {CreateAdminDTO, TokenTypeDTO} from "@/services/dtos/UserDtos";
import {generateUniqueUserNumber} from "@/services/UserService";
import {saltAndHashPassword} from "@/lib/utils/auth-helper";
import {sendVerificationEmail} from "@/lib/utils/mailer";

import {generateUserToken} from "@/services/auth/TokenService";
import {
    isUserAlreadyExistByEmail,
    isUserVerificationTokenExpired,
    isUserVerifiedById
} from "@/services/backednServices/Bk_UserService";
import {RoleDTO} from "@/services/dtos/EnumsDtos";


/**
 * Create a new user
 * @param req type: NextRequest
 */
export async function POST(req: NextRequest) {
    if (req.method !== "POST") {
        return NextResponse.json({message: "Method not allowed!"}, {status: 405});
    }
    try {
        // 1. Get user data from request body
        const userData: CreateAdminDTO = await req.json();

        console.log("log ====> userData in src/app/api/v1/users/route.ts ===> userData", userData);

        // 2. Check if user data is valid
        if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
            return NextResponse.json({message: "Invalid user data!"}, {status: 400});
        }

        // 3. Check if user already exists by email
        const existingUserId = await isUserAlreadyExistByEmail(userData.email);

        // 3.1 Check if user is verified
        if (existingUserId) {
            const isVerified = await isUserVerifiedById(existingUserId);
            if (isVerified) {
                return NextResponse.json({message: "User already exist!"}, {status: 400});
            }

            // 3.2 Check if the verification token is expired
            const isTokenExpired = await isUserVerificationTokenExpired(existingUserId);

            if (isTokenExpired) {
                // 3.3 Generate a new verification token
                const newToken = await generateUserToken(existingUserId, TokenTypeDTO.EMAIL_VERIFICATION, 1);
                await sendVerificationEmail(`${userData.firstName} ${userData.lastName}`, userData.email, newToken.token);
                return NextResponse.json({message: "Please verify your account. A new verification email has been sent."}, {status: 200});
            }

            return NextResponse.json({message: "Please verify your account."}, {status: 400});

        }
        // // 4. Generate a unique user number
        userData.role = RoleDTO.SUPER_ADMIN;

        // 4.1 Generate userNumber based on a user role (admin, customer, etc.)
        const userNumber = await generateUniqueUserNumber(userData.role);

        // 5. Hash password
        const pwHash = await saltAndHashPassword(userData.password);
        // create user
        const newUser = await prisma.user.create({
            data: {
                userNumber: userNumber,
                name: `${userData.firstName} ${userData.lastName}`,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                password: pwHash,
                phone: userData.phone,
                mobile: userData.mobile,
                role: userData.role,
                isVerified: false,

            }
        });

        // check if a user is created
        if (!newUser) {
            return NextResponse.json({message: "Error creating user!"}, {status: 500});
        }

        // check if a verification token is created
        const verificationToken = await generateUserToken(newUser.id, TokenTypeDTO.EMAIL_VERIFICATION, 1);


        if (!verificationToken) {
            return NextResponse.json({message: "Error creating user!"}, {status: 500});
        }
        if (!verificationToken.token) {
            return NextResponse.json({message: "Error creating user!"}, {status: 500});
        }

        // send confirmation email
        await sendVerificationEmail(newUser.firstName, newUser.email, verificationToken.token);

        return NextResponse.json({message: "User created successfully. Please verify your account."}, {status: 201});

    } catch (error) {
        console.error("Error creating admin:", error);
        return NextResponse.json({message: "Error creating admin!"}, {status: 500});
    }

}

