/*
  Warnings:

  - Added the required column `communicationVCS` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "communicationVCS" TEXT NOT NULL;
