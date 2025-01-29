// path: src/app/api/v1/users/register/route.ts

import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/db";
import {TokenTypeDTO} from "@/services/dtos/UserDtos";
import {generateUniqueUserNumber} from "@/services/UserService";
import {saltAndHashPassword} from "@/lib/utils/auth-helper";
import {sendVerificationEmail} from "@/lib/utils/mailer";
import {isUserAlreadyExistByEmail, isUserVerifiedById,} from "@/services/backend_Services/Bk_UserService";
import {generateUserToken} from "@/services/auth/TokenService";

export async function POST(req: NextRequest) {
    if (req.method !== 'POST') return NextResponse.json({error: "Method not allowed."}, {status: 405})

    try {
        const userData = await req.json();

        console.log("Incoming user data:", userData);

        // Validate required fields
        // const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'role', 'addressType', 'street', 'cityId', 'countryId', 'streetNumber', 'street', 'isEnterprise', 'paymentTermDays'];

        const requiredFields = [
            "firstName", "lastName", "email", "phone", "role", "addressType",
            "street", "streetNumber", "cityId", "countryId"
        ];

        console.log("log ===> requiredFields in POST method in path/users/register:", requiredFields);

        const missingFields = requiredFields.filter(field => !userData[field]);
        
        console.log("log ===> missingFields in POST method in path/users/register:", missingFields);
        
        if (missingFields.length > 0) {
            console.log("log ===> missingFields fields founds in POST method in path/users/register:", missingFields);

            return NextResponse.json({message: `Missing required fields: ${missingFields.join(', ')}`}, {status: 400});
        }

        if (userData.isEnterprise) {
            console.log("log ===> CUSTOMER IS isEnterprise in POST method in path/users/register:", userData.isEnterprise);


            const requiredEnterpriseFields = ['companyName', 'vatNumber'];
            
            console.log("log ===> requiredEnterpriseFields in POST method in path/users/register:", requiredEnterpriseFields);
            const missingEnterpriseFields = requiredEnterpriseFields.filter(field => !userData[field]);
            
            console.log("log ===> missingEnterpriseFields in POST method in path/users/register:", missingEnterpriseFields);
            
            
            if (missingEnterpriseFields.length > 0) {
                
                console.log("log ===> missingEnterpriseFields fields founds in POST method in path/users/register:", missingEnterpriseFields);
                return NextResponse.json(
                    {message: `Enterprise customers must provide: ${missingEnterpriseFields.join(', ')}`},
                    {status: 400}
                );
            }
        }

        // Nullify enterprise-specific fields for non-enterprise customers
        if (!userData.isEnterprise) {
            
            console.log("log ===> userData.isEnterprise in POST method in path/users/register:", userData.isEnterprise);
            
            ['companyName', 'vatNumber', 'companyNumber', 'exportNumber'].forEach(field => userData[field] = null);
            
        }


        // Check if the user already exists
        const existingUser = await isUserAlreadyExistByEmail(userData.email);
        
        console.log("log ===> existingUser in POST method in path/users/register:", existingUser);
        
        if (existingUser) {
            
            console.log("log ===> existingUser in POST method in path/users/register:", existingUser);
            
            const isVerified = await isUserVerifiedById(existingUser.id);
            
            console.log("log ===> isVerified in POST method in path/users/register:", isVerified);
            
            if (isVerified) {

                console.log("log ===> isVerified in POST method in path/users/register:", isVerified);

                return NextResponse.json({message: "User already exists!"}, {status: 409});
            }
        }

        // Generate unique user number
        const userNumber = await generateUniqueUserNumber(userData.role);

        console.log("log ===> userNumber in POST method in path/users/register:", userNumber);

        // Hash the password (if applicable)
        const pwHash = userData.password ? await saltAndHashPassword(userData.password) : undefined;

        // Add address data to the user creation logic
        const missing = requiredFields.filter(field => !userData[field]);

        console.log("log ===> missing in POST method in path/users/register:", missing);

        if (missing.length) {
            return NextResponse.json(
                { message: `Missing fields: ${missing.join(", ")}` },
                { status: 400 }
            );
        }

        // If not enterprise, nullify enterprise fields
        if (!userData.isEnterprise) {
            userData.companyName = null;
            userData.vatNumber = null;
            userData.companyNumber = null;
            userData.exportNumber = null;
        }

        // Instead of "const { address } = userData", build an object from top-level:
        const address = {
            street: userData.street,
            complement: userData.complement ?? null,
            streetNumber: userData.streetNumber ?? null,
            boxNumber: userData.boxNumber ?? null,
            cityId: parseInt(userData.cityId, 10),
        };

        console.log("log ===> address in POST method in path: /users/register:", address);


        // if any address field is missing, fail
        if (!address.street || !address.cityId) {
            return NextResponse.json(
                { message: "Address info is incomplete." },
                { status: 400 }
            );
        }

        // Validate the address fields
        if (!address || !address.street || !address.cityId) {
            return NextResponse.json({message: "Address information is incomplete!"}, {status: 400});
        }

        // Create the user in the database
        const newUser = await prisma.user.create({
            data: {
                userNumber,
                firstName: userData.firstName,
                lastName: userData.lastName,
                name: `${userData.firstName} ${userData.lastName}`,
                email: userData.email,
                phone: userData.phone || null,
                mobile: userData.mobile || null,
                companyName: userData.companyName,
                vatNumber: userData.vatNumber,
                companyNumber: userData.companyNumber,
                exportNumber: userData.exportNumber,
                password: pwHash,
                role: userData.role,
                paymentTermDays: userData.paymentTermDays,
                isEnterprise: userData.isEnterprise,
                isVerified: false,
                UserAddress: {
                    create: {
                        address: {
                            create: {
                                street: address.street,
                                complement: address.complement || null,
                                streetNumber: address.streetNumber || null,
                                boxNumber: address.boxNumber || null,
                                cityId: address.cityId,
                            },
                        },
                        addressType: userData.addressType ?? "HOME",
                    },
                },
            },
        });


        if (!newUser) {
            return NextResponse.json({message: "Error creating user!"}, {status: 500});
        }

        // Generate and send a verification email
        const verificationToken = await generateUserToken(newUser.id, TokenTypeDTO.EMAIL_VERIFICATION, 1);

        await sendVerificationEmail(
            `${newUser.firstName} ${newUser.lastName}`,
            newUser.email,
            verificationToken.token
        );

        return NextResponse.json({message: "User created successfully!"}, {status: 201});
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({message: "Error creating user!"}, {status: 500});
    }
}
