/*
  Warnings:

  - The primary key for the `itembuylistuser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `_buylisttoitem` table. If the table is not empty, all the data it contains will be lost.
  - The required column `idItemBuyListUser` was added to the `ItemBuyListUser` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE `_buylisttoitem` DROP FOREIGN KEY `_BuyListToItem_A_fkey`;

-- DropForeignKey
ALTER TABLE `_buylisttoitem` DROP FOREIGN KEY `_BuyListToItem_B_fkey`;

-- AlterTable
ALTER TABLE `itembuylistuser` DROP PRIMARY KEY,
    ADD COLUMN `idItemBuyListUser` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`idItemBuyListUser`);

-- DropTable
DROP TABLE `_buylisttoitem`;
