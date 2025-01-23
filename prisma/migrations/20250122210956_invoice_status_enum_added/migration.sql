/*
  Warnings:

  - The `itemStatus` column on the `items` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `paymentMode` on the `payments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `movementType` on the `stock_movements` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `addressType` on the `user_addresses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `user_verification_tokens` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `utaxType` on the `utaxes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `vatType` on the `vats` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "address_types" AS ENUM ('HOME', 'OFFICE', 'BILLING', 'SHIPPING', 'OTHER');

-- CreateEnum
CREATE TYPE "movement_types" AS ENUM ('PURCHASE', 'SALE', 'RETURN');

-- CreateEnum
CREATE TYPE "token_types" AS ENUM ('PASSWORD_RESET', 'EMAIL_VERIFICATION', 'TWO_FACTOR_AUTH');

-- CreateEnum
CREATE TYPE "utax_types" AS ENUM ('LUXURY', 'BASIC', 'SPECIAL');

-- CreateEnum
CREATE TYPE "payment_modes" AS ENUM ('CASH', 'CREDIT_CARD', 'BANK_TRANSFER', 'PAYPAL');

-- CreateEnum
CREATE TYPE "payment_statuses" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "vat_types" AS ENUM ('REDUCED', 'STANDARD', 'EXEMPT');

-- CreateEnum
CREATE TYPE "item_types" AS ENUM ('PHYSICAL', 'DIGITAL');

-- CreateEnum
CREATE TYPE "item_statuses" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "invoice_statuses" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'CANCELED');

-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "status" "invoice_statuses" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "items" DROP COLUMN "itemStatus",
ADD COLUMN     "itemStatus" "item_statuses" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "paymentMode",
ADD COLUMN     "paymentMode" "payment_modes" NOT NULL;

-- AlterTable
ALTER TABLE "stock_movements" DROP COLUMN "movementType",
ADD COLUMN     "movementType" "movement_types" NOT NULL;

-- AlterTable
ALTER TABLE "user_addresses" DROP COLUMN "addressType",
ADD COLUMN     "addressType" "address_types" NOT NULL;

-- AlterTable
ALTER TABLE "user_verification_tokens" DROP COLUMN "type",
ADD COLUMN     "type" "token_types" NOT NULL;

-- AlterTable
ALTER TABLE "utaxes" DROP COLUMN "utaxType",
ADD COLUMN     "utaxType" "utax_types" NOT NULL;

-- AlterTable
ALTER TABLE "vats" DROP COLUMN "vatType",
ADD COLUMN     "vatType" "vat_types" NOT NULL;

-- DropEnum
DROP TYPE "AddressType";

-- DropEnum
DROP TYPE "ItemStatus";

-- DropEnum
DROP TYPE "ItemType";

-- DropEnum
DROP TYPE "MovementType";

-- DropEnum
DROP TYPE "PaymentMode";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "TokenType";

-- DropEnum
DROP TYPE "UtaxType";

-- DropEnum
DROP TYPE "VatType";
