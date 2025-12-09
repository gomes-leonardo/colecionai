-- AlterTable
ALTER TABLE "usertoken" ADD COLUMN     "verify_token" TEXT,
ALTER COLUMN "refresh_token" DROP NOT NULL;
