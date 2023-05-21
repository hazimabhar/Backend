/*
  Warnings:

  - You are about to drop the column `icNumber` on the `manager` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `manager` table. All the data in the column will be lost.
  - You are about to drop the column `idAccount` on the `sale` table. All the data in the column will be lost.
  - You are about to drop the column `icNumber` on the `worker` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `worker` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idWorker]` on the table `Sale` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[icNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idWorker` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icNumber` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `sale` DROP FOREIGN KEY `Sale_idAccount_fkey`;

-- DropIndex
DROP INDEX `Manager_icNumber_key` ON `manager`;

-- DropIndex
DROP INDEX `Worker_icNumber_key` ON `worker`;

-- AlterTable
ALTER TABLE `manager` DROP COLUMN `icNumber`,
    DROP COLUMN `password`;

-- AlterTable
ALTER TABLE `sale` DROP COLUMN `idAccount`,
    ADD COLUMN `idWorker` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `icNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `worker` DROP COLUMN `icNumber`,
    DROP COLUMN `password`;

-- CreateIndex
CREATE UNIQUE INDEX `Sale_idWorker_key` ON `Sale`(`idWorker`);

-- CreateIndex
CREATE UNIQUE INDEX `User_icNumber_key` ON `User`(`icNumber`);

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_idWorker_fkey` FOREIGN KEY (`idWorker`) REFERENCES `Worker`(`idWorker`) ON DELETE RESTRICT ON UPDATE CASCADE;
