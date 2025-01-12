/*
  Warnings:

  - The values [TRANSFER,ADJUSTMENT] on the enum `MovementType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MovementType_new" AS ENUM ('PURCHASE', 'SALE', 'RETURN');
ALTER TABLE "stock_movements" ALTER COLUMN "movementType" TYPE "MovementType_new" USING ("movementType"::text::"MovementType_new");
ALTER TYPE "MovementType" RENAME TO "MovementType_old";
ALTER TYPE "MovementType_new" RENAME TO "MovementType";
DROP TYPE "MovementType_old";
COMMIT;

-- AlterTable
ALTER TABLE "items" ADD COLUMN     "itemStatus" "ItemStatus" NOT NULL DEFAULT 'ACTIVE';
