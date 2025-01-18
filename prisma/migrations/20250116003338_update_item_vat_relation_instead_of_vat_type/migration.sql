/*
  Warnings:

  - You are about to drop the column `vatType` on the `items` table. All the data in the column will be lost.
  - Added the required column `vatId` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "items" DROP COLUMN "vatType",
ADD COLUMN     "vatId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_vatId_fkey" FOREIGN KEY ("vatId") REFERENCES "vats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
