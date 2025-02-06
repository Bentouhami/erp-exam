-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_vatId_fkey";

-- AlterTable
ALTER TABLE "invoice_details" ADD COLUMN     "vatPercent" DECIMAL(5,2);

-- AlterTable
ALTER TABLE "items" ALTER COLUMN "vatId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "vat_rates" (
    "id" SERIAL NOT NULL,
    "countryId" INTEGER NOT NULL,
    "itemClassId" INTEGER NOT NULL,
    "vatPercent" DECIMAL(5,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vat_rates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vat_rates_countryId_itemClassId_key" ON "vat_rates"("countryId", "itemClassId");

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_vatId_fkey" FOREIGN KEY ("vatId") REFERENCES "vats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vat_rates" ADD CONSTRAINT "vat_rates_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vat_rates" ADD CONSTRAINT "vat_rates_itemClassId_fkey" FOREIGN KEY ("itemClassId") REFERENCES "item_classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
