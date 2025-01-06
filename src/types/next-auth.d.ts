// path: src/types/next-auth.d.ts
// Auth.js overrides
import {DefaultSession} from "next-auth";
import {Role} from "@/services/dtos/EnumsDtos";

declare module "next-auth" {
    interface Session {
        user: User & DefaultSession["user"];
    }

    interface User {
        id: number | string | null;
        name?: string | null;
        email: string;
        image?: string | null;
        role?: Role; // Making role mandatory for stricter access control
        userNumber: string; // Adding userNumber to reflect User model

    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: number | string | null;
        name?: string | null;
        email: string;
        image?: string | null;
        role?: Role; // Making role mandatory for stricter access control
        userNumber: string; // Adding userNumber to reflect User model
    }
}
