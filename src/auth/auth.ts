import NextAuth, {Session, User} from "next-auth"
import {JWT} from "next-auth/jwt";
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import {generateUniqueUserNumber, getUserByEmail, getUserFromDb} from "@/services/UserService";
import {LoginDTO, Roles} from "@/services/dtos/UserDtos";
import {saltAndHashPassword} from "@/utils/auth-helper";
import {UserAddressDTO} from "@/services/dtos/AddressDtos";


export const {handlers, signIn, signOut, auth} = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    scope: "openid email profile",
                },
            },

            async profile(profile) {

                const [firstName, lastName] = profile.name?.split(" ") || ["", ""];

                // check if user exists
                const existingUser = await getUserByEmail(
                    profile.email as string);
                if (existingUser) {
                    return existingUser;
                }
                // if not, create new user
                const userNumber = await generateUniqueUserNumber();
                return {
                    id: profile.sub,
                    email: profile.email,
                    userNumber,
                    name: profile.name,
                    firstName: profile.given_name || firstName,
                    lastName: profile.family_name || lastName,
                    image: profile.picture,
                    phoneNumber: null,
                    roles: Roles.CUSTOMER, // Assign default role using Roles enum
                    isVerified: false,
                }
            }

        }),

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
        async jwt({ token, user }): Promise<JWT> {
            if (user) {
                token.id = user.id as string;
                token.userNumber = user.userNumber;
                token.roles = user.roles;
            }
            return token;
        },
        async session({ session, token }): Promise<Session> {
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
