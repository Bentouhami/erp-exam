// /src/app/utils/generateToken.ts : génération de jeton

import {randomBytes} from "crypto";

export function generateVerificationTokenForUser() {

    // Générer un token de vérification de l'email
    // Générer un token de vérification
    const verificationToken = randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // Expire in 7 days

    return {
        verificationToken,
        verificationTokenExpires
    };
}