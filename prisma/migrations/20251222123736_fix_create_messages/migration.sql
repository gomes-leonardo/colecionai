/*
  Warnings:

  - The primary key for the `conversations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idString` on the `conversations` table. All the data in the column will be lost.
  - The required column `id` was added to the `conversations` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_conversation_id_fkey";

-- AlterTable
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_pkey",
DROP COLUMN "idString",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "conversations_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "read_at" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
