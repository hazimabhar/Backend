-- CreateTable
CREATE TABLE `user` (
    `idAccount` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `icNumber` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_icNumber_key`(`icNumber`),
    PRIMARY KEY (`idAccount`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `worker` (
    `idWorker` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `idAccount` VARCHAR(191) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `worker_idAccount_key`(`idAccount`),
    PRIMARY KEY (`idWorker`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `manager` (
    `idManager` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `idAccount` VARCHAR(191) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `manager_idAccount_key`(`idAccount`),
    PRIMARY KEY (`idManager`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `listitem` (
    `idListItem` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `totalPrice` DOUBLE NOT NULL,
    `idItem` VARCHAR(191) NOT NULL,
    `idSale` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`idListItem`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `item` (
    `idItem` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `barcode` VARCHAR(191) NOT NULL,
    `weight` VARCHAR(191) NULL,
    `unit` VARCHAR(191) NULL,
    `quantity` INTEGER NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `item_barcode_key`(`barcode`),
    PRIMARY KEY (`idItem`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sale` (
    `idSale` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `paymentMethod` VARCHAR(191) NOT NULL,
    `idAccount` VARCHAR(191) NOT NULL,
    `idReport` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`idSale`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `report` (
    `idReport` VARCHAR(191) NOT NULL,
    `numberSale` INTEGER NOT NULL,
    `saleRevenue` DOUBLE NOT NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`idReport`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `worker` ADD CONSTRAINT `worker_idAccount_fkey` FOREIGN KEY (`idAccount`) REFERENCES `user`(`idAccount`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `manager` ADD CONSTRAINT `manager_idAccount_fkey` FOREIGN KEY (`idAccount`) REFERENCES `user`(`idAccount`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `listitem` ADD CONSTRAINT `listitem_idItem_fkey` FOREIGN KEY (`idItem`) REFERENCES `item`(`idItem`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `listitem` ADD CONSTRAINT `listitem_idSale_fkey` FOREIGN KEY (`idSale`) REFERENCES `sale`(`idSale`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sale` ADD CONSTRAINT `sale_idAccount_fkey` FOREIGN KEY (`idAccount`) REFERENCES `user`(`idAccount`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sale` ADD CONSTRAINT `sale_idReport_fkey` FOREIGN KEY (`idReport`) REFERENCES `report`(`idReport`) ON DELETE RESTRICT ON UPDATE CASCADE;
