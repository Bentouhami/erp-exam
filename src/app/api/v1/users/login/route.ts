// path: src/app/api/v1/users/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import {decrypt, hashEmail} from "@/lib/security/security";

/**
 * Authenticate user by email and password
 * @param req type: NextRequest
 */
export async function POST(req: NextRequest) {
    try {
        // 1. Parse the request body
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required!" }, { status: 400 });
        }
        console.log("email and password in path: src/app/api/v1/users/login/route.ts: ", email, password);

        // hash email
        const emailHash = hashEmail(email);
        // 2. Find the user by email in the database
        const user = await prisma.user.findUnique({
            where: { emailHash },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                password: true,
                userNumber: true,
                role: true,
                isEnabled: true,
            },
        });

        console.log("user in path: src/app/api/v1/users/login/route.ts: ", user);

        if (!user) {
            return NextResponse.json({ message: "Invalid email or password!" }, { status: 401 });
        }

        // 3. Verify the password
        const isPasswordValid = bcrypt.compare(password, user.password as string);

        if (!isPasswordValid) {
            return NextResponse.json({ message: "Invalid email or password!" }, { status: 401 });
        }

        // 4. Check if the user is enabled
        if (!user.isEnabled) {
            return NextResponse.json({ message: "User account is disabled!" }, { status: 403 });
        }


        // 5. Remove the password before returning the response
        const { password: _, ...userWithoutPassword } = user; // remove password from user object

        console.log("userWithoutPassword in path: src/app/api/v1/users/login/route.ts: ", userWithoutPassword);

        // decrypt userWithoutPassword data
        // decrypt userWithoutPassword data
        const decryptedFirstName = decrypt(userWithoutPassword.firstName);
        const decryptedLastName = decrypt(userWithoutPassword.lastName);
        const decryptedEmail = decrypt(userWithoutPassword.email);
        userWithoutPassword.firstName = decryptedFirstName;
        userWithoutPassword.lastName = decryptedLastName;
        userWithoutPassword.email = decryptedEmail;

        // 6. Return the user data
        return NextResponse.json(userWithoutPassword, { status: 200 });
    } catch (error) {
        console.error("Error during user login:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
