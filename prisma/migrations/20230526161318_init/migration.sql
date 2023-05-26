/*
  Warnings:

  - You are about to drop the column `role` on the `manager` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `worker` table. All the data in the column will be lost.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `manager` DROP COLUMN `role`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `worker` DROP COLUMN `role`;
