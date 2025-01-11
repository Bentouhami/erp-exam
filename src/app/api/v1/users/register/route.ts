import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/db";
import {TokenTypeDTO} from "@/services/dtos/UserDtos";
import {generateUniqueUserNumber} from "@/services/UserService";
import {saltAndHashPassword} from "@/lib/utils/auth-helper";
import {sendVerificationEmail} from "@/lib/utils/mailer";
import {generateUserToken} from "@/services/auth/TokenService";
import {decrypt, encrypt, hashEmail} from "@/lib/security/security";
import {
    isUserAlreadyExistByEmailHash,
    isUserVerificationTokenExpired,
    isUserVerifiedById
} from "@/services/backend_Services/Bk_UserService";

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
        const userData = await req.json();

        console.log("log ====> userData in src/app/api/v1/users/route.ts ===> userData", userData);

        // // 2. Check if user data is valid
        // if (!userData.firstName || !userData.lastName || !userData.email || !userData.password || !userData.phone || !userData.mobile || !userData.companyName || !userData.vatNumber || !userData.companyNumber || !userData.exportNumber || !userData.role) {
        //
        //     console.log("log ====> userData in src/app/api/v1/users/route.ts after check ===> userData");
        //
        //     return NextResponse.json({ message: "Invalid user data!" }, { status: 400 });
        // }


        // 3. Hash the email for lookup
        const emailHash = hashEmail(userData.email);

        // 4. Check if a user already exists by email hash
        const existingUser = await isUserAlreadyExistByEmailHash(emailHash);
        const isCustomer = userData.role === 'CUSTOMER';

        if (existingUser && !isCustomer) {

            console.log("log ====> existingUser in src/app/api/v1/users/route.ts ===> existingUser", existingUser);

            // is the existed user email verified?
            const isVerified = await isUserVerifiedById(existingUser.id)

            if (isVerified) {
                console.log(" email is verified");
                return NextResponse.json({message: "User already exists!"}, {status: 409}); // Use 409 for conflict
            }


            // is token expired
            const isTokenExpired = await isUserVerificationTokenExpired(existingUser.id);

            // if token expired generate new token
            if (isTokenExpired) {

                console.log('log ====> token expired in src/app/api/v1/users/route.ts ===> token expired');


                const newVerificationToken = await generateUserToken(existingUser.id, TokenTypeDTO.EMAIL_VERIFICATION, 1)
                // send the new email verification

                await sendVerificationEmail(existingUser.id, decrypt(existingUser.email), newVerificationToken.token)
            }

            console.log('log ====> token NOT expired in src/app/api/v1/users/route.ts ===> token expired');

            await sendVerificationEmail(existingUser.id, decrypt(existingUser.email), existingUser.userVerificationToken[0].token)

        } else if (existingUser && isCustomer) {
            return NextResponse.json({message: "User already exists!"}, {status: 409});
        }

        const userNumber = await generateUniqueUserNumber(userData.role);

        // 6. Hash the password
        const pwHash = await saltAndHashPassword(userData.password);

        // 7. Encrypt sensitive fields
        const encryptedName = encrypt(`${userData.firstName} ${userData.lastName}`);
        const encryptedEmail = encrypt(userData.email);
        const encryptedPhone = encrypt(userData.phone || '');
        const encryptedMobile = encrypt(userData.mobile || '');


        // 8. Create the user in the database
        const newUser = await prisma.user.create({
            data: {
                userNumber: userNumber,
                name: encryptedName,
                firstName: encrypt(userData.firstName),
                lastName: encrypt(userData.lastName),
                email: encryptedEmail,      // Encrypted email for confidentiality
                emailHash: emailHash,        // Hashed email for lookup
                password: pwHash,
                phone: encryptedPhone,
                mobile: encryptedMobile,
                role: userData.role,
                isVerified: false,
            },
        });

        if (!newUser) {
            return NextResponse.json({message: "Error creating user!"}, {status: 500});
        }

        // 9. Generate a verification token
        const verificationToken = await generateUserToken(newUser.id, TokenTypeDTO.EMAIL_VERIFICATION, 1);

        if (!verificationToken || !verificationToken.token) {
            return NextResponse.json({message: "Error creating verification token!"}, {status: 500});
        }

        // 10. Decrypt the new user's data for email sending
        const decryptedEmail = decrypt(newUser.email);
        const decryptedFirstName = decrypt(newUser.firstName);
        const decryptedLastName = decrypt(newUser.lastName);
        const decryptedName = `${decryptedFirstName} ${decryptedLastName}`;

        // 11. Send the confirmation email
        await sendVerificationEmail(decryptedName, decryptedEmail, verificationToken.token);

        return NextResponse.json({message: "User created successfully. Please verify your account."}, {status: 201});

    } catch (error) {
        console.error("Error creating admin:", error);
        return NextResponse.json({message: "Error creating admin!"}, {status: 500});
    }
}
