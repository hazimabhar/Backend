/*
  Warnings:

  - The primary key for the `listitem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idItemBuyListUser` on the `listitem` table. All the data in the column will be lost.
  - The required column `idListItem` was added to the `ListItem` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `listitem` DROP PRIMARY KEY,
    DROP COLUMN `idItemBuyListUser`,
    ADD COLUMN `idListItem` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`idListItem`);
