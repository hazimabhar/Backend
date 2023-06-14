/*
  Warnings:

  - Added the required column `filePath` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `item` MODIFY `weight` VARCHAR(191) NULL,
    MODIFY `unit` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `report` ADD COLUMN `filePath` VARCHAR(191) NOT NULL;
