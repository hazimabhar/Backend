/*
  Warnings:

  - You are about to drop the `_buylisttoitem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_buylisttoitem` DROP FOREIGN KEY `_BuyListToItem_A_fkey`;

-- DropForeignKey
ALTER TABLE `_buylisttoitem` DROP FOREIGN KEY `_BuyListToItem_B_fkey`;

-- DropTable
DROP TABLE `_buylisttoitem`;
