// Auth.js overrides
import {DefaultSession} from "next-auth";
import {Roles} from "./UserDtos";
import {UserAddressDTO} from "@/services/dtos/AddressDtos";

declare module "next-auth" {
    interface Session {
        user: User & DefaultSession["user"];
    }

    interface User {
        id: number | string | null;
        firstName?: string | null;
        lastName?: string | null;
        name?: string | null;
        email: string;
        phone?: string | null; // Aligning with User model field name (changed from phoneNumber)
        mobile?: string | null; // Adding support for mobile if necessary
        image?: string | null;
        roles?: Roles; // Making roles mandatory for stricter access control
        userAddress?: UserAddressDTO[];
        emailVerified?: Date | null;
        isEnabled?: boolean; // Adding isEnabled to match User model
        companyName?: string | null; // Adding companyName for completeness
        vatNumber?: string | null; // Adding vatNumber to reflect User model
        userNumber: string; // Adding userNumber to reflect User model

    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: number | string | null;
        firstName?: string | null;
        lastName?: string | null;
        name?: string | null;
        email: string;
        phone?: string | null; // Aligning with User model field name (changed from phoneNumber)
        mobile?: string | null; // Adding support for mobile if necessary
        image?: string | null;
        roles?: Roles; // Making roles mandatory for stricter access control
        userAddress?: UserAddressDTO[];
        emailVerified?: Date | null;
        isEnabled?: boolean; // Adding isEnabled to match User model
        companyName?: string | null; // Adding companyName for completeness
        vatNumber?: string | null; // Adding vatNumber to reflect User model
        userNumber: string; // Adding userNumber to reflect User model
    }
}
