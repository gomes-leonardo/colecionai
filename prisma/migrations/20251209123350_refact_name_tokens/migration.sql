/*
  Warnings:

  - You are about to drop the column `refresh_token` on the `usertoken` table. All the data in the column will be lost.
  - You are about to drop the column `verify_token` on the `usertoken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "usertoken" DROP COLUMN "refresh_token",
DROP COLUMN "verify_token",
ADD COLUMN     "reset_password_token" TEXT,
ADD COLUMN     "verify_email_token" TEXT;
