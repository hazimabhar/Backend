-- AlterTable
ALTER TABLE `report` ADD COLUMN `fileName` VARCHAR(191) NULL,
    MODIFY `filePath` VARCHAR(191) NULL;
