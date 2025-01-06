// path: src/services/UserService.ts

import {LoginDTO, UserDTO} from "@/services/dtos/UserDtos";
import axios from "axios";
import prisma from "@/lib/db";
import {User} from "next-auth";
import {API_DOMAIN} from "@/lib/utils/constants";
import {RoleDTO} from "@/services/dtos/EnumsDtos";

export const getUserFromDb = async (loginData : LoginDTO) : Promise<User | null> => {
    // Logic to retrieve user from database based on email
    
    if (!loginData.email || !loginData.password) {
        throw new Error("Invalid credentials.");
    }
    
    try {
        // Logic to retrieve user from database based on email and password
        const user = await axios.get(`${API_DOMAIN}/users/login`, {
            params: {
                email: loginData.email,
                pwHash: loginData.password,
            },

        });
        
        if (user.status === 200) {
            // Return the user object if found, or null if not found
            return user.data;
        }
        // Return the user object if found, or null if not found
        return null;
    } catch (error) {
        console.error("Error retrieving user from database:", error);
        return null;
    }
};

export const getUserByEmail = async (email: string) : Promise<UserDTO | null> => {
    // Logic to retrieve user from database based on email
    
    if (!email) {
        throw new Error("Invalid email.");
    }
    
    try {
        // Logic to retrieve user from database based on email
        
        // Return the user object if found, or null if not found
        return null;
    } catch (error) {
        console.error("Error retrieving user from database:", error);
        return null;
    }
};

export const getUserById = async (id: string) => {
    // Logic to retrieve user from database based on id
    
    if (!id) {
        throw new Error("Invalid id.");
    }
    
    try {
        // Logic to retrieve user from database based on id
        
        // Return the user object if found, or null if not found
        return null;
    } catch (error) {
        console.error("Error retrieving user from database:", error);
        return null;
    }
};

export const getUserByUserNumber = async (userNumber: string) => {
    // Logic to retrieve user from database based on userNumber
    
    if (!userNumber) {
        throw new Error("Invalid userNumber.");
    }
    
    try {
        // Logic to retrieve user from database based on userNumber
        
        // Return the user object if found, or null if not found
        return null;
    } catch (error) {
        console.error("Error retrieving user from database:", error);
        return null;
    }
};

export const getUserByPhoneNumber = async (phoneNumber: string) => {
    // Logic to retrieve user from database based on phoneNumber
    
    if (!phoneNumber) {
        throw new Error("Invalid phoneNumber.");
    }
    
    try {
        // Logic to retrieve user from database based on phoneNumber
        
        // Return the user object if found, or null if not found
        return null;
    } catch (error) {
        console.error("Error retrieving user from database:", error);
        return null;
    }
};

export const getUserByVatNumber = async (vatNumber: string) => {
    // Logic to retrieve user from database based on vatNumber
    
    if (!vatNumber) {
        throw new Error("Invalid vatNumber.");
    }
    
    try {
        // Logic to retrieve user from database based on vatNumber
        
        // Return the user object if found, or null if not found
        return null;
    } catch (error) {
        console.error("Error retrieving user from database:", error);
        return null;
    }
};


/**
 * Generate a unique, sequential `userNumber` in the format U000001.
 * Ensures it's unique and future-proof for larger datasets.
 */
export async function generateUniqueUserNumber(userRole: string): Promise<string> {

    let userPrefix = ""; // Prefix for user numbers
    if (userRole === RoleDTO.ADMIN) {
        userPrefix = "ADM";
    } else if (userRole === RoleDTO.CUSTOMER) {
        userPrefix = "CUS";
    } else if (userRole === RoleDTO.SUPER_ADMIN) {
        userPrefix = "SAD";
    } else if (userRole === RoleDTO.ACCOUNTANT) {
        userPrefix = "ACC";
    }

    const paddingLength = 6; // Length of the number portion (e.g., U000001)

    // Find the latest user based on userNumber
    const latestUser = await prisma.user.findFirst({
        where: {
            userNumber: {
                startsWith: userPrefix,
            },
        },
        orderBy: {
            userNumber: "desc",
        },
    });

    let nextNumber = 1; // Default to 1 if no users exist

    if (latestUser && latestUser.userNumber) {
        // Extract the numeric part from the latest userNumber
        const latestNumber = parseInt(latestUser.userNumber.slice(userPrefix.length), 10);
        nextNumber = latestNumber + 1;
    }

    // Generate the new userNumber with zero-padded numeric part
    const userNumber = `${userPrefix}${nextNumber.toString().padStart(paddingLength, "0")}`;
    return userNumber;
}

