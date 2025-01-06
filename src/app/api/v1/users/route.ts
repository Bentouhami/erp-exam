// path: src/app/api/v1/users/route.ts
import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/db";


/**
 * @method GET
 * @route /api/v1/users
 * @desc Get all users
 *
 */

export async function GET(req: NextRequest) {
    console.log("log ====> Get all users api route called")

    if (req.method !== "GET") {
        return NextResponse.json({status: 400});
    }

    try {
        const users = await prisma.user.findMany();
        console.log("log ====> users in path: src/app/api/v1/users/route.ts: ", users);

        if (!users) {
            return NextResponse.json({message: "No users found"}, {status: 400});
        }
        return NextResponse.json(users);
    } catch (error) {
        console.error("Error getting users:", error);
        return NextResponse.json({message: "Internal server error"}, {status: 500});
    }
}