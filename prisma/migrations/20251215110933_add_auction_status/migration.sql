-- CreateEnum
CREATE TYPE "AuctionStatus" AS ENUM ('OPEN', 'CLOSED', 'CANCELLED');

-- AlterTable
ALTER TABLE "auctions" ADD COLUMN     "status" "AuctionStatus" NOT NULL DEFAULT 'OPEN';
