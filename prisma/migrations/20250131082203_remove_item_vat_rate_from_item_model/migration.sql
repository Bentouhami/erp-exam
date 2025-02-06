/*
  Warnings:

  - You are about to drop the column `vatRateId` on the `items` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_vatRateId_fkey";

-- AlterTable
ALTER TABLE "items" DROP COLUMN "vatRateId";
