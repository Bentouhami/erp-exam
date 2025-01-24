import NextAuth, {Session, User} from "next-auth"
import {JWT} from "next-auth/jwt";
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import apiCalls from "@/services/apiCalls";


export const {handlers, signIn, signOut, auth} = NextAuth({
    providers: [
        Google,
        Github,
        Credentials({
            name: "credentials",
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials): Promise<User | null> {
                try {
                    if(!credentials.email || !credentials.password) {
                        throw new Error("Email and password are required.");
                    }
                    // 1. Call the login route via apiCalls
                    // const encryptedEmail = encrypt(credentials.email as string);
                    const user = await apiCalls.getUserByEmail({
                        email: credentials.email as string,
                        password: credentials.password as string,
                    });

                    // 2. Return the user if login is successful
                    if (user) {

                        return {
                            id: user.id,
                            name: `${user.firstName} ${user.lastName}`,
                            email: user.email,
                            role: user.role,
                            userNumber: user.userNumber,
                        };
                    }


                    return null; // Return null if login fails
                } catch (error) {
                    console.error("Error during login:", error);
                    throw new Error("Invalid credentials.");
                }
            },
        }),
    ],
    callbacks: {
        async jwt({token, user}): Promise<JWT> {
            if (user) {
                token.id = user.id ? user.id.toString() : null;
                token.userNumber = user.userNumber;
                token.role = user.role;
                token.email = user.email!;
                token.name = user.name;
            }
            return token;
        },
        async session({session, token}): Promise<Session> {
            session.user = {
                ...session.user,
                id: token.id as string,
                userNumber: token.userNumber,
                role: token.role,
                email: token.email,
                name: token.name,
            };
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV !== "production",
});
