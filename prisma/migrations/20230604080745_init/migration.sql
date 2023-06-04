-- CreateTable
CREATE TABLE `_BuyListToItem` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_BuyListToItem_AB_unique`(`A`, `B`),
    INDEX `_BuyListToItem_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_BuyListToItem` ADD CONSTRAINT `_BuyListToItem_A_fkey` FOREIGN KEY (`A`) REFERENCES `BuyList`(`idBuyList`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BuyListToItem` ADD CONSTRAINT `_BuyListToItem_B_fkey` FOREIGN KEY (`B`) REFERENCES `Item`(`idItem`) ON DELETE CASCADE ON UPDATE CASCADE;
