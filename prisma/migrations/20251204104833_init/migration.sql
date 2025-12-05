-- AlterTable
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "products_user_id_fkey";
ALTER TABLE "products" ADD CONSTRAINT "products_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
