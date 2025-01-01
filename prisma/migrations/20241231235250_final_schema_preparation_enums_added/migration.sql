/*
  Warnings:

  - You are about to drop the column `vatTypeId` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `paymentModeId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `addressTypeId` on the `user_addresses` table. All the data in the column will be lost.
  - You are about to drop the column `utaxTypeId` on the `utaxes` table. All the data in the column will be lost.
  - You are about to drop the column `vatTypeId` on the `vats` table. All the data in the column will be lost.
  - You are about to drop the `address_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment_modes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `utax_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vat_types` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id,countryId]` on the table `vats` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `vatType` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMode` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `movementType` on the `stock_movements` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `addressType` to the `user_addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `utaxType` to the `utaxes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vatType` to the `vats` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('HOME', 'OFFICE', 'BILLING', 'SHIPPING');

-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('PURCHASE', 'SALE', 'RETURN', 'TRANSFER', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('PASSWORD_RESET', 'EMAIL_VERIFICATION', 'TWO_FACTOR_AUTH');

-- CreateEnum
CREATE TYPE "UtaxType" AS ENUM ('LUXURY', 'BASIC', 'SPECIAL');

-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('CASH', 'CREDIT_CARD', 'BANK_TRANSFER', 'PAYPAL');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "VatType" AS ENUM ('REDUCED', 'STANDARD', 'EXEMPT');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('PHYSICAL', 'DIGITAL');

-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_vatTypeId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_paymentModeId_fkey";

-- DropForeignKey
ALTER TABLE "user_addresses" DROP CONSTRAINT "user_addresses_addressTypeId_fkey";

-- DropForeignKey
ALTER TABLE "utaxes" DROP CONSTRAINT "utaxes_utaxTypeId_fkey";

-- DropForeignKey
ALTER TABLE "vats" DROP CONSTRAINT "vats_vatTypeId_fkey";

-- DropIndex
DROP INDEX "vats_vatTypeId_countryId_key";

-- AlterTable
ALTER TABLE "items" DROP COLUMN "vatTypeId",
ADD COLUMN     "vatType" "VatType" NOT NULL;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "paymentModeId",
ADD COLUMN     "paymentMode" "PaymentMode" NOT NULL;

-- AlterTable
ALTER TABLE "stock_movements" DROP COLUMN "movementType",
ADD COLUMN     "movementType" "MovementType" NOT NULL;

-- AlterTable
ALTER TABLE "user_addresses" DROP COLUMN "addressTypeId",
ADD COLUMN     "addressType" "AddressType" NOT NULL;

-- AlterTable
ALTER TABLE "utaxes" DROP COLUMN "utaxTypeId",
ADD COLUMN     "utaxType" "UtaxType" NOT NULL;

-- AlterTable
ALTER TABLE "vats" DROP COLUMN "vatTypeId",
ADD COLUMN     "vatType" "VatType" NOT NULL;

-- DropTable
DROP TABLE "address_types";

-- DropTable
DROP TABLE "payment_modes";

-- DropTable
DROP TABLE "utax_types";

-- DropTable
DROP TABLE "vat_types";

-- CreateTable
CREATE TABLE "user_verification_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_verification_tokens_token_key" ON "user_verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "vats_id_countryId_key" ON "vats"("id", "countryId");

-- AddForeignKey
ALTER TABLE "user_verification_tokens" ADD CONSTRAINT "user_verification_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
