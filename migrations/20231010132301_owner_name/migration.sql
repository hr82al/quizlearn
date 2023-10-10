/*
  Warnings:

  - Added the required column `ownerName` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "ownerName" VARCHAR(25) NOT NULL;
