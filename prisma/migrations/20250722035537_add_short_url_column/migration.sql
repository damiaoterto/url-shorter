/*
  Warnings:

  - Added the required column `shortUrl` to the `Url` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Url" ADD COLUMN     "shortUrl" VARCHAR(200) NOT NULL;
