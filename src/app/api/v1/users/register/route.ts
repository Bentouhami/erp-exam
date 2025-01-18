import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { TokenTypeDTO } from "@/services/dtos/UserDtos";
import { generateUniqueUserNumber } from "@/services/UserService";
import { saltAndHashPassword } from "@/lib/utils/auth-helper";
import { sendVerificationEmail } from "@/lib/utils/mailer";
import {
    isUserAlreadyExistByEmail,
    isUserVerifiedById,
} from "@/services/backend_Services/Bk_UserService";
import {generateUserToken} from "@/services/auth/TokenService";

export async function POST(req: NextRequest) {
    try {
        const userData = await req.json();

        console.log("Incoming user data:", userData);

        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'role'];
        const missingFields = requiredFields.filter(field => !userData[field]);
        if (missingFields.length > 0) {
            return NextResponse.json({ message: `Missing required fields: ${missingFields.join(', ')}` }, { status: 400 });
        }

        if (userData.isEnterprise) {
            const requiredEnterpriseFields = ['companyName', 'vatNumber'];
            const missingEnterpriseFields = requiredEnterpriseFields.filter(field => !userData[field]);
            if (missingEnterpriseFields.length > 0) {
                return NextResponse.json(
                    { message: `Enterprise customers must provide: ${missingEnterpriseFields.join(', ')}` },
                    { status: 400 }
                );
            }
        }

        // Nullify enterprise-specific fields for non-enterprise customers
        if (!userData.isEnterprise) {
            ['companyName', 'vatNumber', 'companyNumber', 'exportNumber'].forEach(field => userData[field] = null);
        }


        // Check if the user already exists
        const existingUser = await isUserAlreadyExistByEmail(userData.email);
        if (existingUser) {
            const isVerified = await isUserVerifiedById(existingUser.id);
            if (isVerified) {
                return NextResponse.json({ message: "User already exists!" }, { status: 409 });
            }
        }

        // Generate unique user number
        const userNumber = await generateUniqueUserNumber(userData.role);

        // Hash the password (if applicable)
        const pwHash = userData.password ? await saltAndHashPassword(userData.password) : undefined;

        // Create the user in the database
        const newUser = await prisma.user.create({
            data: {
                userNumber,
                firstName: userData.firstName,
                lastName: userData.lastName,
                name: `${userData.firstName} ${userData.lastName}`,
                email: userData.email,
                phone: userData.phone || null,
                mobile: userData.mobile || null,
                companyName: userData.companyName,
                vatNumber: userData.vatNumber,
                companyNumber: userData.companyNumber,
                exportNumber: userData.exportNumber,
                password: pwHash,
                role: userData.role,
                paymentTermDays: userData.paymentTermDays,
                isEnterprise: userData.isEnterprise,
                isVerified: false,
            },
        });

        if (!newUser) {
            return NextResponse.json({ message: "Error creating user!" }, { status: 500 });
        }

        // Generate and send a verification email
        const verificationToken = await generateUserToken(newUser.id, TokenTypeDTO.EMAIL_VERIFICATION, 1);

        await sendVerificationEmail(
            `${newUser.firstName} ${newUser.lastName}`,
            newUser.email,
            verificationToken.token
        );

        return NextResponse.json({ message: "User created successfully!" }, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ message: "Error creating user!" }, { status: 500 });
    }
}
