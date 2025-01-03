import { InvoiceList } from "@/components/InvoiceList"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardPage() {
    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>
            <div className="mb-4">
                <Button asChild>
                    <Link href="/dashboard/invoice/new">Ajouter une facture</Link>
                </Button>
            </div>
            <InvoiceList />
        </div>
    )
}

