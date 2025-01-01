// path: src/services/dtos/UserDtos.ts
// src/services/dtos/UserDtos.ts

// Enums
import {UserAddressDTO} from "@/services/dtos/AddressDtos";

export enum Roles {
    CUSTOMER = 'CUSTOMER',
    ADMIN = 'ADMIN',
    STAFF = 'STAFF',
    ACCOUNTANT = 'ACCOUNTANT',
    WAREHOUSE_MANAGER = 'WAREHOUSE_MANAGER',
    SALES_REP = 'SALES_REP',
    SUPPORT_AGENT = 'SUPPORT_AGENT',
    SUPER_ADMIN = 'SUPER_ADMIN',
}

// User DTOs

/**
 * Full user data structure for internal use or data transfer.
 */
export interface UserDTO {
    id: string;
    name?: string;
    email: string;
    emailVerified?: Date;
    image?: string;

    userNumber: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    vatNumber?: string;
    companyNumber?: string;
    exportNumber?: string;
    isEnabled: boolean;
    phone?: string;
    mobile?: string;
    fax?: string;
    additionalInfo?: string;
    paymentTermDays: number;
    roles: Roles;
    userAddress?: UserAddressDTO[];
}

/**
 * DTO for creating a new user.
 */
export interface UserCreateDTO {
    name?: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    vatNumber?: string;
    companyNumber?: string;
    exportNumber?: string;
    phone?: string;
    mobile?: string;
    fax?: string;
    additionalInfo?: string;
    paymentTermDays?: number;
    roles?: Roles[]; // Defaults to CUSTOMER in service logic
}

/**
 * DTO for updating user details.
 */
export interface UserUpdateDTO {
    name?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    vatNumber?: string;
    companyNumber?: string;
    exportNumber?: string;
    isEnabled?: boolean;
    phone?: string;
    mobile?: string;
    fax?: string;
    additionalInfo?: string;
    paymentTermDays?: number;
    roles?: Roles[];
}

/**
 * DTO for filtering or searching users.
 */
export interface UserRequestDTO {
    userNumber?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    isEnabled?: boolean;
    roles?: Roles[];
}

/**
 * DTO for sanitized response sent back to clients.
 */
export interface UserResponseDTO {
    id: string;
    name?: string;
    userNumber: string;
    email: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    vatNumber?: string;
    phone?: string;
    mobile?: string;
    roles: Roles[];
    createdAt: Date;
    updatedAt: Date;
}

/**
 * DTO for user login.
 */
export interface LoginDTO {
    email: string;
    pwHash: string; // hashed password
}

/**
 * DTO for changing a user's password.
 */
export interface ChangePasswordDTO {
    oldPassword: string;
    newPassword: string;
}

/**
 * DTO for handling forgot password requests.
 */
export interface ForgotPasswordDTO {
    email: string;
}

/**
 * DTO for enabling or disabling a user.
 */
export interface EnableDisableUserDTO {
    isEnabled: boolean;
}
