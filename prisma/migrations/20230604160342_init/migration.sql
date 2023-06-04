/*
  Warnings:

  - You are about to drop the `buylist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `itembuylistuser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `buylist` DROP FOREIGN KEY `BuyList_idSale_fkey`;

-- DropForeignKey
ALTER TABLE `itembuylistuser` DROP FOREIGN KEY `ItemBuyListUser_idBuyList_fkey`;

-- DropForeignKey
ALTER TABLE `itembuylistuser` DROP FOREIGN KEY `ItemBuyListUser_idItem_fkey`;

-- DropTable
DROP TABLE `buylist`;

-- DropTable
DROP TABLE `itembuylistuser`;

-- CreateTable
CREATE TABLE `ListItem` (
    `idItemBuyListUser` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `totalPrice` DOUBLE NOT NULL,
    `idItem` VARCHAR(191) NOT NULL,
    `idSale` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`idItemBuyListUser`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ListItem` ADD CONSTRAINT `ListItem_idItem_fkey` FOREIGN KEY (`idItem`) REFERENCES `Item`(`idItem`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ListItem` ADD CONSTRAINT `ListItem_idSale_fkey` FOREIGN KEY (`idSale`) REFERENCES `Sale`(`idSale`) ON DELETE RESTRICT ON UPDATE CASCADE;
