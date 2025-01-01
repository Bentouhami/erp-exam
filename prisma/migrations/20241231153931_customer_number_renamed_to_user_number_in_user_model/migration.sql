/*
  Warnings:

  - You are about to drop the column `customerId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `stock_movements` table. All the data in the column will be lost.
  - You are about to drop the column `customerNumber` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userNumber]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userNumber` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_customerNumber_key";

-- DropIndex
DROP INDEX "users_customerNumber_lastName_vatNumber_idx";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "customerId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "stock_movements" DROP COLUMN "customerId",
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "customerNumber",
ADD COLUMN     "userNumber" VARCHAR(10) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_userNumber_key" ON "users"("userNumber");

-- CreateIndex
CREATE INDEX "users_userNumber_lastName_vatNumber_idx" ON "users"("userNumber", "lastName", "vatNumber");
