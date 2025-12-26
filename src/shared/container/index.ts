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
import { IFeedbacksRepository } from "../../modules/feedbacks/repositories/IFeedbacksRepository";
import { PrismaFeedbacksRepository } from "../../modules/feedbacks/repositories/prisma/PrismaFeedbacksRepository";
import { IMessagesRepository } from "../../modules/messages/IMessagesRepository";
import { PrismaMessagesRepository } from "../../modules/messages/repositories/prisma/PrismaMessagesRepository";
import { IConversationsRepository } from "../../modules/conversations/IConversationsRepository";
import { PrismaConversationsRepository } from "../../modules/conversations/repositories/prisma/PrismaConversationsRepository";
import { IOrdersRepository } from "../../modules/orders/IOrdersRepository";
import { PrismaOrdersRepository } from "../../modules/orders/repositories/prisma/PrismaOrdersRepository";

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

container.registerSingleton<IFeedbacksRepository>(
  "FeedbacksRepository",
  PrismaFeedbacksRepository
);

container.registerSingleton<IMessagesRepository>(
  "MessagesRepository",
  PrismaMessagesRepository
);

container.registerSingleton<IConversationsRepository>(
  "ConversationsRepository",
  PrismaConversationsRepository
);

container.registerSingleton<IOrdersRepository>(
  "OrdersRepository",
  PrismaOrdersRepository
);

container.registerSingleton<IQueueProvider>("QueueProvider", BullQueueProvider);

const mailProvider = process.env.MAIL_PROVIDER || "console";

if (mailProvider === "smtp") {
  // Verifica previamente se o nodemailer está disponível; se não estiver, faz fallback.
  let nodemailerDisponivel = true;
  try {
    require("nodemailer");
  } catch (error: any) {
    nodemailerDisponivel = false;
    console.warn("[Container] ⚠️  nodemailer não está instalado em produção.");
    console.warn("[Container] 📧 Usando ConsoleMailProvider como fallback.");
  }

  if (nodemailerDisponivel) {
    try {
      const smtpModule = require("./providers/MailProvider/Implementations/SMTPMailProvider");
      const SMTPMailProvider = smtpModule.SMTPMailProvider;

      if (!SMTPMailProvider) {
        throw new Error("SMTPMailProvider não encontrado no módulo");
      }

      container.registerSingleton<IMailProvider>(
        "MailProvider",
        SMTPMailProvider
      );
      console.log("[Container] ✅ SMTPMailProvider registrado com sucesso");
    } catch (error: any) {
      const errorMsg = error?.message || String(error);
      console.warn(
        "[Container] ⚠️  Erro ao carregar SMTPMailProvider:",
        errorMsg
      );
      console.warn("[Container] 📧 Usando ConsoleMailProvider como fallback");
      container.registerSingleton<IMailProvider>(
        "MailProvider",
        ConsoleMailProvider
      );
    }
  } else {
    container.registerSingleton<IMailProvider>(
      "MailProvider",
      ConsoleMailProvider
    );
  }
} else {
  container.registerSingleton<IMailProvider>(
    "MailProvider",
    ConsoleMailProvider
  );
  console.log(
    "[Container] 📧 ConsoleMailProvider registrado (emails serão logados no console)"
  );
}
