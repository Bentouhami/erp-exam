import NextAuth, {Session} from "next-auth"
import {JWT} from "next-auth/jwt";
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import {generateUniqueUserNumber, getUserFromDb} from "@/services/UserService";
import {LoginDTO} from "@/services/dtos/UserDtos";
import {saltAndHashPassword} from "@/lib/utils/auth-helper";


export const {handlers, signIn, signOut, auth} = NextAuth({
    providers: [
        Google,
        Github,
        Credentials({
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            name: "credentials",
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"},
            },
            authorize: async (credentials) => {
                let user = null

                // logic to salt and hash password
                const pwHash = await saltAndHashPassword(credentials.password as string)

                // set data login
                const loginData: LoginDTO = {
                    email: credentials.email as string,
                    pwHash: pwHash,
                }
                // logic to verify if the user exists
                user = await getUserFromDb(loginData)

                if (!user) {
                    // No user found, so this is their first attempt to login
                    // Optionally, this is also the place you could do a user registration
                    throw new Error("Invalid credentials.")
                }

                // return user object with their profile data
                return {
                    ...user,
                    userNumber: user.userNumber || (await generateUniqueUserNumber()), // Assign userNumber if missing
                };

            },
        }),

    ],
    callbacks: {

        async jwt({token, user}): Promise<JWT> {
            if (user) {
                token.id = user.id as string;
                token.userNumber = user.userNumber;
                token.roles = user.roles;
            }
            return token;
        },
        async session({session, token}): Promise<Session> {
            session.user = {
                ...session.user,
                id: token.id as string,
                userNumber: token.userNumber,
                roles: token.roles,
            };
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV !== "production",
    trustHost: true,
});
