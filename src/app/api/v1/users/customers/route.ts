// path: src/app/api/v1/users/customers/route.ts

import {NextRequest, NextResponse} from 'next/server'
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {

    if (request.method !== 'GET') return NextResponse.json({error: "Method not allowed"}, {status: 405});

    try {
        const customers = await prisma.user.findMany({
            where: {
                role: "CUSTOMER",
            },
            select: {
                id: true,
                isEnterprise: true,
                userNumber: true,
                vatNumber: true,
                firstName: true,
                lastName: true,
                name: true,
                role: true,
                email: true,
                phone: true,
                mobile: true,
                companyName: true,
                companyNumber: true,
                exportNumber: true,
                paymentTermDays: true,
                createdAt: true,
                userAddress: {
                    select: {
                        addressType: true,
                        address: {
                            select: {
                                city: {
                                    select: {
                                        country: {
                                            select: {
                                                id: true,
                                                name: true,
                                                countryCode: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        // Extract `countryId` from `userAddress`
        const customersWithCountry = customers.map((customer) => {
            const primaryAddress = customer.userAddress.find(
                (addr) => addr.addressType === "BILLING" || addr.addressType === "HOME"
            );

            return {
                ...customer,
                countryId: primaryAddress?.address?.city?.country?.id || null, // Retourne null au lieu de throw
                countryName: primaryAddress?.address?.city?.country?.name || "Unknown", // Ajoute un nom par défaut
            };
        });


        console.log("Processed customers with countryId:", customersWithCountry);

        return NextResponse.json(customersWithCountry, {status: 200});
    } catch (error) {
        console.error("Error fetching customers:", error);
        return NextResponse.json({error: "Failed to fetch customers"}, {status: 500});
    }
}


export async function POST(request: NextRequest) {
    const body = await request.json()

    const customer = await prisma.user.create({
        data: {
            ...body,
            role: 'CUSTOMER',
        },
    })

    return NextResponse.json(customer)
}


