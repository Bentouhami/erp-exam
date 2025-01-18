/*
  Warnings:

  - You are about to drop the column `emailHash` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_emailHash_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "emailHash";
