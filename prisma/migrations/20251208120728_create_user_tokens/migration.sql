-- CreateTable
CREATE TABLE "usertoken" (
    "id" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usertoken_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "usertoken" ADD CONSTRAINT "usertoken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
