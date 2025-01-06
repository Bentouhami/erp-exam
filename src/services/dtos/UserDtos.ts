// path: src/services/dtos/UserDtos.ts



import {UserAddressDTO} from "@/services/dtos/AddressDtos";
import {RoleDTO} from "@/services/dtos/EnumsDtos";


export enum TokenTypeDTO {
    PASSWORD_RESET = 'PASSWORD_RESET',
    EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
    TWO_FACTOR_AUTH = 'TWO_FACTOR_AUTH',
}
//endregion


export interface UserVerificationTokenDTO {
    id: string;
    token: string;
    type: TokenTypeDTO;
    expires: Date;
}

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
    password?: string;
    companyName?: string;
    vatNumber?: string;
    companyNumber?: string;
    exportNumber?: string;
    isEnabled: boolean;
    isVerified: boolean;
    phone?: string;
    mobile?: string;
    fax?: string;
    additionalInfo?: string;
    paymentTermDays: number;
    role: RoleDTO;
    userAddress?: UserAddressDTO[];
    userVerificationToken?: UserVerificationTokenDTO[];

}

/**
 * DTO for creating a new user.
 */
export interface ClientCreateDTO {
    userNumber: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    vatNumber?: string;
    companyNumber?: string;
    exportNumber?: string;
    isEnabled?: boolean;
    isVerified?: boolean;
    phone?: string;
    mobile?: string;
    fax?: string;
    additionalInfo?: string;
    paymentTermDays: number;
    role: RoleDTO;
    userAddress?: UserAddressDTO[];

}

/**
 * DTO for creating a new user.
 */
export interface CreateAdminDTO {
    userNumber?: string;
    firstName: string;
    lastName: string;
    mobile: string;
    phone?: string;
    email: string;
    isEnabled?: boolean;
    isVerified?: boolean;
    emailVerified?: Date;
    role?: RoleDTO;
    password: string;
    userVerificationToken?: UserVerificationTokenDTO[];
}

/**
 * DTO for updating user details.
 */
export interface UserUpdateDTO extends Partial<Omit<UserDTO, 'id'>> {
    id: string;

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
    isVerified?: boolean;
    role?: RoleDTO;
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
    role: RoleDTO;

}

/**
 * DTO for user login.
 */
export interface LoginDTO {
    email: string;
    password: string; // hashed password
}

// UserDTO response after login
export interface UserLoginResponseDTO extends UserDTO {
    id : string;
    name : string;
    email : string;
    role : RoleDTO;
    userNumber : string;
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
