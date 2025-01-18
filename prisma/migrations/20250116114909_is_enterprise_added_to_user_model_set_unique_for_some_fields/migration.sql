/*
  Warnings:

  - A unique constraint covering the columns `[vatNumber]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[companyNumber]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[exportNumber]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isEnterprise" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "vatNumber" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_vatNumber_key" ON "users"("vatNumber");

-- CreateIndex
CREATE UNIQUE INDEX "users_companyNumber_key" ON "users"("companyNumber");

-- CreateIndex
CREATE UNIQUE INDEX "users_exportNumber_key" ON "users"("exportNumber");
