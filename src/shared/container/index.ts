import { container } from "tsyringe";

import { IUserRepository } from "../../modules/accounts/repositories/IUserRepository";
import { PrismaUsersRepository } from "../../modules/accounts/repositories/prisma/PrismaUsersRepository";
import { IProductsRepository } from "../../modules/products/repositories/IProductsRepository";
import { PrismaProductsRepository } from "../../modules/products/repositories/prisma/PrismaProductsRepository";
import { IUsersTokensRepository } from "../../modules/accounts/repositories/IUserTokensRepository";
import { PrismaUserTokenRepository } from "../../modules/accounts/repositories/prisma/PrismaUserTokenRepository";
import { ICacheProvider } from "./providers/CacheProvider/ICacheProvider";
import { RedisCacheProvider } from "./providers/CacheProvider/Implementations/RedisCacheProvider";
import { BullQueueProvider } from "./providers/QueueProvider/Implementations/BullQueueProvider";
import { IQueueProvider } from "./providers/QueueProvider/IQueueProvider";

container.registerSingleton<IUserRepository>(
  "UsersRepository",
  PrismaUsersRepository
);

container.registerSingleton<IProductsRepository>(
  "ProductsRepository",
  PrismaProductsRepository
);

container.registerSingleton<IUsersTokensRepository>(
  "UsersTokenRepository",
  PrismaUserTokenRepository
);

container.registerSingleton<ICacheProvider>(
  "CacheProvider",
  RedisCacheProvider
);

container.registerSingleton<IQueueProvider>("QueueProvider", BullQueueProvider);
