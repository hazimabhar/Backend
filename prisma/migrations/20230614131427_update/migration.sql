/*
  Warnings:

  - Made the column `filePath` on table `report` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fileName` on table `report` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `report` MODIFY `createdAt` VARCHAR(191) NOT NULL,
    MODIFY `filePath` VARCHAR(191) NOT NULL,
    MODIFY `fileName` VARCHAR(191) NOT NULL;
