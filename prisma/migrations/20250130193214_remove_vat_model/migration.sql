/*
  Warnings:

  - You are about to drop the column `vatId` on the `items` table. All the data in the column will be lost.
  - You are about to drop the `vats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_vatId_fkey";

-- DropForeignKey
ALTER TABLE "vats" DROP CONSTRAINT "vats_countryId_fkey";

-- AlterTable
ALTER TABLE "items" DROP COLUMN "vatId",
ADD COLUMN     "vatRateId" INTEGER;

-- AlterTable
ALTER TABLE "vat_rates" ADD COLUMN     "vatType" "vat_types" DEFAULT 'STANDARD';

-- DropTable
DROP TABLE "vats";

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_vatRateId_fkey" FOREIGN KEY ("vatRateId") REFERENCES "vat_rates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
