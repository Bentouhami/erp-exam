// path: src/utils/email.utils.ts
import axios from 'axios';
import {API_DOMAIN, DOMAIN} from "@/lib/utils/constants";


/**
 * Envoie un email de vérification générique pour tous les utilisateurs
 * @param name
 * @param email - L'adresse email de l'utilisateur
 * @param token - Le token de vérification
 */

export async function sendVerificationEmail(name: string, email: string, token: string) {
    console.log("log ====> sendVerificationEmail function called in src/lib/mailer.ts", {name, email});

    if (!name || !email || !token) {
        throw new Error("Missing required parameters");
    }
    try {
        console.log("log ====> sending request in process in function sendVerificationEmail in src/lib/mailer.ts", {name, email, token});

        await axios.post(`${API_DOMAIN}/send-email`, {name, email, token});
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
}
