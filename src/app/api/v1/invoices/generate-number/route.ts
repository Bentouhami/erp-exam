// path: src/app/api/v1/invoices/generate-number/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { generateInvoiceNumber } from "@/lib/utils/invoice"

export async function GET(req: NextRequest) {
    let retries = 3
    while (retries > 0) {
        try {
            const invoiceNumber = await generateInvoiceNumber()
            if (!invoiceNumber) {
                console.error("Invoice number generation failed")
                return NextResponse.json(
                    { message: "Invoice number not found" },
                    {
                        status: 404,
                        headers: {
                            "Cache-Control": "no-store, max-age=0",
                        },
                    },
                )
            }
            console.log(`Generated invoice number: ${invoiceNumber}`)
            return NextResponse.json(
                { invoiceNumber },
                {
                    headers: {
                        "Cache-Control": "no-store, max-age=0",
                    },
                },
            )
        } catch (error) {
            console.error("Error generating invoice number:", error)
            retries--
            if (retries === 0) {
                return NextResponse.json(
                    { message: "Error generating invoice number after multiple attempts" },
                    {
                        status: 500,
                        headers: {
                            "Cache-Control": "no-store, max-age=0",
                        },
                    },
                )
            }
            // Wait for a short time before retrying
            await new Promise((resolve) => setTimeout(resolve, 100))
        }
    }
}

export const dynamic = "force-dynamic"

