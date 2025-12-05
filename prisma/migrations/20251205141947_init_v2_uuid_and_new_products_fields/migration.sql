/*
  Warnings:

  - Changed the type of `category` on the `products` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `condition` on the `products` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ProductCondition" AS ENUM ('NEW', 'USED', 'OPEN_BOX');

-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('ACTION_FIGURES', 'COLLECTIBLE_STATUES', 'FUNKO_POP', 'TRADING_CARDS', 'COMIC_BOOKS', 'MANGA', 'RETRO_GAMES', 'MINIATURES', 'MODEL_KITS', 'MOVIES_TV_COLLECTIBLES', 'ANIME_COLLECTIBLES', 'ART_BOOKS', 'RARE_COLLECTIBLES');

-- AlterTable
ALTER TABLE "products" DROP COLUMN "category",
ADD COLUMN     "category" "ProductCategory" NOT NULL,
DROP COLUMN "condition",
ADD COLUMN     "condition" "ProductCondition" NOT NULL;
