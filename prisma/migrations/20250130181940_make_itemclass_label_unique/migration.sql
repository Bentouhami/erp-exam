/*
  Warnings:

  - A unique constraint covering the columns `[label]` on the table `item_classes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "item_classes_label_key" ON "item_classes"("label");
