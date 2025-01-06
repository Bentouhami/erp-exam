// path: src/app/api/v1/users/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

/**
 * @method POST
 * @route /api/v1/users/verify
 * @desc Verify email
 */
export async function POST(req: NextRequest) {
    console.log("log ====> Verification email API route called");

    if (req.method !== "POST") {
        return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
    }

    try {
        // Récupérer le token depuis le corps de la requête
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ message: "Token is required" }, { status: 400 });
        }

        // 1. Rechercher le token dans la base de données
        const verificationToken = await prisma.userVerificationToken.findFirst({
            where: { token },
            include: { user: true },
        });

        if (!verificationToken) {
            return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
        }

        // 2. Vérifier si le token est expiré
        if (verificationToken.expires < new Date()) {
            return NextResponse.json({ message: "Token has expired" }, { status: 400 });
        }

        // 3. Mettre à jour le statut de l'utilisateur en tant que vérifié
        await prisma.user.update({
            where: { id: verificationToken.userId },
            data: { isVerified: true, emailVerified: new Date() },
        });

        // 4. Supprimer le token après vérification
        await prisma.userVerificationToken.delete({
            where: { id: verificationToken.id },
        });

        return NextResponse.json({ message: "Email successfully verified" }, { status: 200 });
    } catch (error) {
        console.error("Error verifying email:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
