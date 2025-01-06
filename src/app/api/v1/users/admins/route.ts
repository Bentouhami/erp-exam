// path: src/app/api/v1/users/admins/route.ts
import {NextRequest, NextResponse} from "next/server";


/**
 * @method POST
 * @route /api/v1/users/admins
 * @desc Create new admin
 */

export async function POST(req: NextRequest) {
    console.log("log ====> Create new admin api route called")

    if (req.method !== "POST") {
        return NextResponse.json({status: 400});
    }
    try {

        return NextResponse.json({status: 200});

    } catch (error) {
        console.error("Error verifying email:", error);
        return NextResponse.json({message: "Internal server error"}, {status: 500});
    }
}