import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { TokenTypeDTO } from "@/services/dtos/UserDtos";
import { generateUniqueUserNumber } from "@/services/UserService";
import { saltAndHashPassword } from "@/lib/utils/auth-helper";
import { sendVerificationEmail } from "@/lib/utils/mailer";
import { generateUserToken } from "@/services/auth/TokenService";
import { decrypt, encrypt, hashEmail } from "@/lib/security/security";
import {
    isUserAlreadyExistByEmailHash,
    isUserVerifiedById,
} from "@/services/backend_Services/Bk_UserService";

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


        // Validate enterprise-related fields
        if (userData.isEnterprise) {
            const requiredEnterpriseFields = ['companyName', 'vatNumber'];
            const missingEnterpriseFields = requiredEnterpriseFields.filter(field => !userData[field]);
            if (missingEnterpriseFields.length > 0) {
                return NextResponse.json(
                    { message: `Enterprise customers must provide: ${missingEnterpriseFields.join(', ')}` },
                    { status: 400 }
                );
            }
        } else {
            // Nullify enterprise-specific fields for non-enterprise customers
            ['companyName', 'vatNumber', 'companyNumber', 'exportNumber'].forEach(field => userData[field] = null);
        }

        // Hash email for lookup
        const emailHash = hashEmail(userData.email);

        // Check if the user already exists
        const existingUser = await isUserAlreadyExistByEmailHash(emailHash);
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

        // Encrypt sensitive fields
        const encryptedFields = {
            name: encrypt(`${userData.firstName} ${userData.lastName}`),
            firstName: encrypt(userData.firstName),
            lastName: encrypt(userData.lastName),
            email: encrypt(userData.email),
            phone: encrypt(userData.phone || ""),
            mobile: encrypt(userData.mobile || ""),
            companyName: userData.companyName ? encrypt(userData.companyName) : null,
            vatNumber: userData.vatNumber ? encrypt(userData.vatNumber) : null,
            companyNumber: userData.companyNumber ? encrypt(userData.companyNumber) : null,
            exportNumber: userData.exportNumber ? encrypt(userData.exportNumber) : null,
        };

        console.log("Encrypted fields:", encryptedFields);

        // Create the user in the database
        const newUser = await prisma.user.create({
            data: {
                userNumber,
                ...encryptedFields,
                emailHash,
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
        const decryptedEmail = decrypt(newUser.email);
        const decryptedFirstName = decrypt(newUser.firstName);
        const decryptedLastName = decrypt(newUser.lastName);

        await sendVerificationEmail(`${decryptedFirstName} ${decryptedLastName}`, decryptedEmail, verificationToken.token);

        return NextResponse.json({ message: "User created successfully!" }, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ message: "Error creating user!" }, { status: 500 });
    }
}

