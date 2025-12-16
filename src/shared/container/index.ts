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
import { IAuctionsRepository } from "../../modules/auctions/IAuctionsRepository";
import { PrismaAuctionsRepository } from "../../modules/auctions/repositories/prisma/PrismaAuctionsRepository";
import { IBidsRepository } from "../../modules/bids/repositories/IBidsRepository";
import { PrismaBidsRepository } from "../../modules/bids/repositories/prisma/PrismaBidsRepository";
import { IMailProvider } from "./providers/MailProvider/IMailProvider";
import { ConsoleMailProvider } from "./providers/MailProvider/Implementations/ConsoleMailProvider";

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

container.registerSingleton<IAuctionsRepository>(
  "AuctionsRepository",
  PrismaAuctionsRepository
);

container.registerSingleton<IBidsRepository>(
  "BidsRepository",
  PrismaBidsRepository
);

container.registerSingleton<IQueueProvider>("QueueProvider", BullQueueProvider);

// MailProvider - escolhe implementação baseado na variável de ambiente
const mailProvider = process.env.MAIL_PROVIDER || "console";
if (mailProvider === "smtp") {
  // Importação dinâmica para evitar erro se nodemailer não estiver instalado
  const { SMTPMailProvider } = require("./providers/MailProvider/Implementations/SMTPMailProvider");
  container.registerSingleton<IMailProvider>("MailProvider", SMTPMailProvider);
} else {
  container.registerSingleton<IMailProvider>("MailProvider", ConsoleMailProvider);
}
