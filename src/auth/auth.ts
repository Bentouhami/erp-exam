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
                    // 1. Call the login route via apiCalls
                    // const encryptedEmail = encrypt(credentials.email as string);
                    const user = await apiCalls.getUserByEmail({
                        email: credentials.email as string,
                        password: credentials.password as string,
                    });

                    console.log("user found by email and or phone number in isUserAlreadyExist function in path: src/app/api/v1/users/verify/route.ts: ", user);

                    // 2. Return the user if login is successful
                    if (user) {
                        console.log("user found by email and or phone number in isUserAlreadyExist function in path: src/app/api/v1/users/verify/route.ts: ", user);

                        return {
                            id: user.id,
                            name: `${user.firstName} ${user.lastName}`,
                            email: user.email,
                            role: user.role,
                            userNumber: user.userNumber,
                        };
                    }

                    console.log("user not found by email and or phone number in isUserAlreadyExist function in path: src/app/api/v1/users/verify/route.ts return NULL");


                    return null; // Return null if no user is found
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
                token.email = user.email!; // Ensure email is always defined
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
