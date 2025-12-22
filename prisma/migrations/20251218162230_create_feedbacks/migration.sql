-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('BUG', 'SUGGESTION', 'COMPLIMENT', 'OTHER');

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" TEXT NOT NULL,
    "type" "FeedbackType" NOT NULL DEFAULT 'OTHER',
    "message" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "visitor_name" VARCHAR(100),
    "context" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);
