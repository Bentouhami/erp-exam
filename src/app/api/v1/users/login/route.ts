// path: src/app/api/v1/users/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {

    if(req.method !== 'POST') return NextResponse.json({error: "Method not allowed."}, {status: 405})

    console.log("log ====> POST method called to login user");

    try {
        // 1. Parse the request body
        const { email, password } = await req.json();
    console.log("log ====> email and password in POST LOGIN USER: " , email, password);

        if (!email || !password) {
            console.log("log ====> email or password nopt rpovided ! ")

            return NextResponse.json({ message: "Email and password are required!" }, { status: 400 });
        }

        // 2. Find the user by email in the database
        const user = await prisma.user.findUnique({
            where: { email },
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

        if (!user || !user.password) {
            console.log("log ====> User not found by email:" , email);

            return NextResponse.json({ message: "Invalid email or password!" }, { status: 401 });
        }

        // 3. Verify the password
        const isPasswordValid = await bcrypt.compare(password, user.password as string);

        if (!isPasswordValid) {
            console.log("log ====> password invalid")


            return NextResponse.json({ message: "Invalid email or password!" }, { status: 401 });
        }

        // 4. Check if the user is enabled
        if (!user.isEnabled) {
            console.log("log ====> User is not enabled YES!")

            return NextResponse.json({ message: "User account is disabled!" }, { status: 403 });
        }

        // 5. Update the lastLogin field
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });


        // 6. Remove the password before returning the response
        const { password: _, ...userWithoutPassword } = user;

        console.log("loh ====> userWithoutPassword before returning response of : ", userWithoutPassword)

        // 7. Return the user data
        return NextResponse.json(userWithoutPassword, { status: 200 });
    } catch (error) {
        console.error("Error during user login:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}