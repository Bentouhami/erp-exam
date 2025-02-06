// Path: src/app/api/v1/invoices/[id]/route.ts
import {NextRequest, NextResponse} from 'next/server';
import prisma from "@/lib/db";

/**
 * Fetch invoice by id with user and invoice details included
 * @param request
 * @param params
 * @constructor
 */
export async function GET(request: NextRequest, {params}: { params: { id: string } }) {
    if (request.method !== 'GET') {
        return NextResponse.json({error: 'Method not allowed'}, {status: 405});
    }

    try {
        const invoice = await prisma.invoice.findUnique({
            where: {id: parseInt(params.id)},
            include: {
                User: true,
                invoiceDetails: {
                    include: {
                        item: true,
                    },
                },
            },
        });

        if (!invoice) {
            return NextResponse.json({error: 'Invoice not found'}, {status: 404});
        }

        return NextResponse.json(invoice);
    } catch (error) {
        console.error('Error fetching invoice:', error);
        return NextResponse.json({error: 'Failed to fetch invoice'}, {status: 500});
    }
}


/**
 * Update invoice by id
 * @param request
 * @param params
 * @constructor
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    if (request.method !== "PUT") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }

    try {
        const { id } = params;
        const body = await request.json();

        console.log("log ===> received data from PUT request:", body);

        const { userId, items, issuedAt, dueDate, ...invoiceData } = body;

        // 🚨 Validate required fields
        if (!userId || !items || !issuedAt || !dueDate || items.length === 0) {
            return NextResponse.json({ error: "Missing required parameters or empty items list" }, { status: 400 });
        }

        // ✅ Convert values to correct types
        const invoiceId = parseInt(id);
        const issuedAtDate = new Date(issuedAt);
        const dueDateDate = new Date(dueDate);

        if (isNaN(invoiceId)) {
            return NextResponse.json({ error: "Invalid invoice ID" }, { status: 400 });
        }

        // ✅ Fetch user to check country
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                isEnterprise: true,
                userAddress: {
                    select: {
                        address: {
                            select: {
                                city: {
                                    select: {
                                        countryId: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!user || !user.userAddress.length) {
            return NextResponse.json({ error: "User or country information not found" }, { status: 400 });
        }

        const countryId = user.userAddress[0].address.city.countryId;
        if (!countryId) {
            return NextResponse.json({ error: "User country not found" }, { status: 400 });
        }

        // ✅ Fetch item details
        const itemIds = items.map((item: any) => parseInt(item.itemId));
        const itemDetails = await prisma.item.findMany({
            where: { id: { in: itemIds }, itemStatus: "ACTIVE" },
            select: {
                id: true,
                retailPrice: true,
                itemClass: { select: { id: true } },
                stockQuantity: true,
            },
        });

        if (itemDetails.length !== items.length) {
            return NextResponse.json({ error: "Some items are inactive or not found" }, { status: 400 });
        }

        // ✅ Fetch VAT rates for Belgium customers only
        let vatRateMap = new Map();
        if (countryId === 1) {
            const vatRates = await prisma.vatRate.findMany({
                where: {
                    countryId: countryId,
                    itemClassId: { in: itemDetails.map((i) => i.itemClass.id) },
                },
                select: {
                    itemClassId: true,
                    vatPercent: true,
                },
            });

            vatRateMap = new Map(vatRates.map((v) => [v.itemClassId, v.vatPercent]));
        }

        // ✅ Validate stock before update
        const stockMap = new Map(itemDetails.map((item) => [item.id, item.stockQuantity]));
        for (const item of items) {
            const itemId = parseInt(item.itemId);
            const currentStock = stockMap.get(itemId) || 0;
            if (item.quantity > currentStock) {
                return NextResponse.json({ error: `Not enough stock for item ${itemId}. Available: ${currentStock}` }, { status: 400 });
            }
        }

        // ✅ Prepare invoice details data
        let totalHT = 0;
        let totalVAT = 0;

        const invoiceDetailsData = items.map((item: any, index: number) => {
            const itemDetail = itemDetails.find((i) => i.id === parseInt(item.itemId));
            if (!itemDetail) throw new Error("Item not found");

            const unitPrice = Number(itemDetail.retailPrice);
            const baseVatRate = vatRateMap.get(itemDetail.itemClass.id);

            // ✅ Ensure VAT is correctly assigned
            const effectiveVatPercent =
                parseInt(countryId.toString()) === 2 ? 0 : baseVatRate ?? item.vatPercent;
            const vatRateDecimal = effectiveVatPercent / 100;

            const vatBaseAmount = unitPrice * item.quantity * (1 - item.discount / 100);
            const vatAmount = vatBaseAmount * vatRateDecimal;

            totalHT += vatBaseAmount;
            totalVAT += vatAmount;

            return {
                itemId: itemDetail.id, // Use `itemId` instead of `{ connect: { id: itemDetail.id } }`
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

        console.log("log ====> before update invoice:", invoiceData);

        // ✅ Separate `invoiceDetails` deletion & recreation
        await prisma.invoiceDetail.deleteMany({
            where: { invoiceId },
        });

        // remove `id` from invoiceData
        delete invoiceData.id;

        // ✅ Update invoice first
        const updatedInvoice = await prisma.invoice.update({
            where: { id: invoiceId },
            data: {
                ...invoiceData,
                issuedAt: issuedAtDate,
                dueDate: dueDateDate,
                totalAmount: totalHT,
                totalVatAmount: totalVAT,
                totalTtcAmount: totalTTC,
                User: { connect: { id: userId } },
            },
            include: {
                User: true,
            },
        });

        // ✅ Insert `invoiceDetails` separately
        await prisma.invoiceDetail.createMany({
            data: invoiceDetailsData.map((detail: any) => ({
                invoiceId,
                ...detail,
            })),
        });

        // ✅ Update stock separately
        for (const item of items) {
            await prisma.item.update({
                where: { id: parseInt(item.itemId) },
                data: { stockQuantity: { decrement: item.quantity } },
            });
        }

        console.log("log ====> after update invoice:", updatedInvoice);
        return NextResponse.json(updatedInvoice);
    } catch (error) {
        console.error("Error updating invoice:", error);
        return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 });
    }
}



/**
 * Delete invoice by id
 * @param request
 * @param params
 * @constructor
 */
export async function DELETE(request: NextRequest, {params}: { params: { id: string } }) {

    if (request.method !== 'DELETE') {
        return NextResponse.json({error: 'Method not allowed'}, {status: 405});
    }

    try {
        await prisma.invoice.delete({
            where: {id: parseInt(params.id)},
        });

        return NextResponse.json({message: 'Invoice deleted successfully'}, {status: 200});
    } catch (error) {
        console.error('Error deleting invoice:', error);
        return NextResponse.json({error: 'Failed to delete invoice'}, {status: 500});
    }
}
