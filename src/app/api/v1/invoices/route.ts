// path: src/app/api/v1/invoices/route.ts

import {NextRequest, NextResponse} from 'next/server';
import prisma from "@/lib/db";
import {generateCommunicationVCS, generateInvoiceNumber} from "@/lib/utils/invoice";
import {accessControlHelper} from "@/lib/utils/accessControlHelper";

/**
 * Fetch all invoices with optional filtering and sorting.
 * Supports search, pagination, and sorting.
 */
export async function GET(request: NextRequest) {
    if (request.method !== "GET") {
        return NextResponse.json({error: "Method not allowed"}, {status: 405});
    }

    if (!accessControlHelper) {
        return NextResponse.json({error: 'Access denied'}, {status: 403})
    }

    try {
        // Extract query parameters
        const {searchParams} = new URL(request.url);
        const search = searchParams.get("search");
        const sort = searchParams.get("sort") || "issuedAt"; // Default sorting by issuedAt
        const order = searchParams.get("order") === "asc" ? "asc" : "desc"; // Default descending
        const page = parseInt(searchParams.get("page") || "1", 10);
        const invoiceNumber = searchParams.get("invoiceNumber");
        const communicationVCS = searchParams.get("communicationVCS");
        const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);


        // Pagination settings
        const skip = (page - 1) * pageSize;
        const take = pageSize;

        // Build search filters
        const invoiceFilters: any = search
            ? {
                OR: [
                    {invoiceNumber: {contains: search, mode: "insensitive"}},
                    {communicationVCS: {contains: search, mode: "insensitive"}},
                    {issuedAt: {contains: search, mode: "insensitive"}},
                    {dueDate: {contains: search, mode: "insensitive"}},
                    {totalAmount: {contains: search, mode: "insensitive"}},
                    {totalVatAmount: {contains: search, mode: "insensitive"}},
                    {totalTtcAmount: {contains: search, mode: "insensitive"}},

                    {
                        User: {
                            OR: [
                                {name: {contains: search, mode: "insensitive"}},
                                {userNumber: {contains: search, mode: "insensitive"}},
                                {email: {contains: search, mode: "insensitive"}},
                                {phone: {contains: search, mode: "insensitive"}},
                                {mobile: {contains: search, mode: "insensitive"}},
                                {companyName: {contains: search, mode: "insensitive"}},
                                {companyNumber: {contains: search, mode: "insensitive"}},
                                {exportNumber: {contains: search, mode: "insensitive"}},
                                {vatNumber: {contains: search, mode: "insensitive"}},
                                {isEnterprise: {equals: true}},
                            ],
                        },
                    },
                ],
            }
            : {};

        // Fetch invoices with pagination, sorting, and search filters
        const invoices = await prisma.invoice.findMany({
            where: invoiceFilters,
            orderBy: {[sort]: order},
            skip,
            take,
            include: {
                User: {
                    select: {
                        id: true,
                        name: true,
                        userNumber: true,
                    },
                },
                invoiceDetails: {
                    include: {
                        item: {
                            select: {
                                id: true,
                                label: true,
                                retailPrice: true,
                                stockQuantity: true,
                            },
                        },
                    },
                },
            },
        });

        // Count total invoices for pagination
        const totalInvoices = await prisma.invoice.count({where: invoiceFilters});

        return NextResponse.json({
            invoices: invoices,
            pagination: {
                total: totalInvoices,
                page,
                pageSize,
                totalPages: Math.ceil(totalInvoices / pageSize),
            },
        }, {status: 200});

    } catch (error) {
        console.error("Error fetching invoices:", error);
        return NextResponse.json({error: "Failed to fetch invoices"}, {status: 500});
    }
}


export async function POST(request: NextRequest) {
    if (request.method !== "POST") {
        return new Response("Method not allowed", {status: 405});
    }
    if (!accessControlHelper) {
        return NextResponse.json({error: 'Access denied'}, {status: 403})
    }

    try {
        const body = await request.json();

        console.log("Invoice data received in POST request:", body);


        delete body.id;
        const {userId, items, issuedAt, invoiceNumber, communicationVCS, ...invoiceData} = body;
        console.log("log ====> items in POST method in path src/app/api/v1/invoices/route.ts:", items);

        if (!userId || !items || !issuedAt) {
            return NextResponse.json({error: "Missing required parameters"}, {status: 400});
        }


        // Generate invoice number if not provided
        if (!invoiceNumber ) {
            const { invoiceNumber: generatedInvoiceNumber, numericPart } = await generateInvoiceNumber();
             const communicationVCS = generateCommunicationVCS(numericPart);

            invoiceData.invoiceNumber = await generateInvoiceNumber();
            invoiceData.communicationVCS = communicationVCS;
        }

        // Fetch user details including countryId from address
        const user = await prisma.user.findUnique({
            where: {id: userId},
            select: {
                paymentTermDays: true,
                id: true,
                isEnterprise: true,
                userAddress: {
                    select: {
                        address: {
                            select: {
                                city: {select: {countryId: true}},
                            },
                        },
                    },
                },
            },
        });

        if (!user || !user.userAddress.length) {
            return NextResponse.json({error: "User or country information not found"}, {status: 400});
        }

        // Extract user's countryId
        const countryId = user.userAddress[0].address.city.countryId;

        if (!countryId) {
            return NextResponse.json({error: "User country not found"}, {status: 400});
        }

        // Calculate due date based on user's payment terms
        const issuedAtDate = new Date(issuedAt);
        const dueDate = new Date(issuedAtDate);
        dueDate.setDate(dueDate.getDate() + (user.paymentTermDays || 0));

        // Fetch and validate items
        const itemIds = items.map((item: any) => parseInt(item.itemId));

        console.log("log ====> itemIds in POST method in path src/app/api/v1/invoices/route.ts:", itemIds);


        const itemDetails = await prisma.item.findMany({
            where: {id: {in: itemIds}, itemStatus: "ACTIVE"},
            select: {
                id: true,
                label: true,
                retailPrice: true,
                itemClass: {select: {id: true}},
                stockQuantity: true,
            },
        });

        if (itemDetails.length !== items.length) {
            return NextResponse.json({error: "Some items are inactive or not found"}, {status: 400});
        }

        // Fetch VAT rates based on country & item class
        const vatRates = await prisma.vatRate.findMany({
            where: {
                countryId: countryId,
                itemClassId: {in: itemDetails.map((i) => i.itemClass.id)},
            },
            select: {itemClassId: true, vatPercent: true},
        });

        console.log("log ====> vatRates in POST method in path src/app/api/v1/invoices/route.ts:", vatRates);

        // Create VAT lookup map (itemClassId -> vatPercent)
        const vatRateMap = new Map(vatRates.map((v) => [v.itemClassId, v.vatPercent]));

        console.log("log ====> vatRateMap in POST method in path src/app/api/v1/invoices/route.ts:", vatRateMap);

        // Stock Validation Before Processing Invoice
        // Create a Map of itemId to stockQuantity for each item in itemDetails array
        const stockMap = new Map(itemDetails.map((item) => [item.id, item.stockQuantity]));
        for (const item of items) {
            const itemId = parseInt(item.itemId);
            
            // Check if the item exists in the itemDetails array
            const currentStock = stockMap.get(itemId) || 0;

            // Check if the quantity of the item is greater than the current stock
            if (item.quantity > currentStock) {
                console.log("log ===> not enough stock for item:", item);
                return NextResponse.json(
                    {
                        error: "Not enough stock",
                        itemLabel: itemDetails.map((item) => item.label).join(", "),
                        requiredStock: item.quantity,
                        availableStock: currentStock
                    },

                    {status: 400}
                );
            }
        }

        // Prepare `invoiceDetails` data
        let totalHT = 0;
        let totalVAT = 0;

        const invoiceDetailsData = items.map((item: any, index: number) => {
            const itemDetail = itemDetails.find((i) => i.id === parseInt(item.itemId));
            if (!itemDetail) throw new Error("Item not found");

            const unitPrice = Number(itemDetail.retailPrice);
            // Retrieve the VAT rate from your lookup.
            const baseVatRate = vatRateMap.get(itemDetail.itemClass.id);
            // If the customer is French (countryId === 2), force VAT to 0.
            const effectiveVatPercent = parseInt(countryId.toString()) === 2
                ? 0
                : (baseVatRate ? baseVatRate.toNumber() : 0);
            const vatRateDecimal = effectiveVatPercent / 100;

            const vatBaseAmount = unitPrice * item.quantity * (1 - item.discount / 100);
            const vatAmount = vatBaseAmount * vatRateDecimal;

            totalHT += vatBaseAmount;
            totalVAT += vatAmount;

            return {
                item: { connect: { id: itemDetail.id } },
                quantity: item.quantity,
                discount: item.discount,
                lineNumber: index + 1,
                unitPrice,
                vatBaseAmount,
                vatPercent: effectiveVatPercent,
                vatAmount,
                totalPrice: vatBaseAmount + vatAmount,
            };
        });


        const totalTTC = totalHT + totalVAT;

        // ✅ Save invoice and update stock in a transaction
        const invoice = await prisma.$transaction(async (prisma) => {
            // Create the invoice
            const createdInvoice = await prisma.invoice.create({
                data: {
                    ...invoiceData,
                    invoiceNumber,
                    communicationVCS,
                    issuedAt: issuedAtDate,
                    dueDate,
                    totalAmount: totalHT,
                    totalVatAmount: totalVAT,
                    totalTtcAmount: totalTTC,
                    User: {connect: {id: userId}},
                    invoiceDetails: {create: invoiceDetailsData},
                },
                include: {
                    User: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            name: true,
                            userNumber: true,
                            email: true,
                            phone: true,
                            role: true,
                            userAddress: {
                                select: {
                                    address: {
                                        select: {
                                            city: {select: {countryId: true}},
                                        },
                                    },
                                }
                            },

                            companyName: true,
                            companyNumber: true,
                            exportNumber: true,
                            isEnterprise: true,
                            paymentTermDays: true,
                            vatNumber: true,
                        },
                    },
                    invoiceDetails: {include: {item: true}},
                },
            });

            // Deduct stock for each item
            for (const item of items) {
                await prisma.item.update({
                    where: {id: parseInt(item.itemId)},
                    data: {stockQuantity: {decrement: item.quantity}},
                });
            }

            return createdInvoice;
        });

        if (!invoice) {
            return NextResponse.json({error: "Failed to create invoice"}, {status: 500});
        }

        return NextResponse.json(invoice, {status: 201});
    } catch (error) {
        const err = error as Error;

        console.error("Error creating invoice:", error);
        return NextResponse.json({error: err.message || "Failed to create invoice"}, {status: 500});
    }
}
