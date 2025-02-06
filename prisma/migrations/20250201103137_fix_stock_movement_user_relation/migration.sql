/*
  Warnings:

  - You are about to drop the `_StockMovementToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_StockMovementToUser" DROP CONSTRAINT "_StockMovementToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_StockMovementToUser" DROP CONSTRAINT "_StockMovementToUser_B_fkey";

-- DropTable
DROP TABLE "_StockMovementToUser";

-- CreateIndex
CREATE INDEX "stock_movements_itemId_userId_idx" ON "stock_movements"("itemId", "userId");

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
