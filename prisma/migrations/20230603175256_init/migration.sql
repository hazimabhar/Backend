/*
  Warnings:

  - You are about to drop the column `idWorker` on the `sale` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idAccount]` on the table `Sale` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idAccount` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `sale` DROP FOREIGN KEY `Sale_idWorker_fkey`;

-- AlterTable
ALTER TABLE `sale` DROP COLUMN `idWorker`,
    ADD COLUMN `idAccount` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Sale_idAccount_key` ON `Sale`(`idAccount`);

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_idAccount_fkey` FOREIGN KEY (`idAccount`) REFERENCES `User`(`idAccount`) ON DELETE RESTRICT ON UPDATE CASCADE;
