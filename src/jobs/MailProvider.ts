import "reflect-metadata";
import { Worker } from "bullmq";
import { container } from "tsyringe";
import { IMailProvider } from "../shared/container/providers/MailProvider/IMailProvider";
import { connection } from "./queue";
import "../shared/container/index";

export const emailWorker = new Worker(
  "emails",
  async (job) => {
    console.log(`📧 Processando email: ${job.name}`);

    const mailProvider = container.resolve<IMailProvider>("MailProvider");

    try {
      switch (job.name) {
        case "forgot-password": {
          const { name, email, link } = job.data;
          await mailProvider.sendMail(
            email,
            "Recuperação de Senha",
            `Olá ${name}, clique aqui: <a href="${link}">Resetar Senha</a>`
          );
          break;
        }

        case "register-confirmation": {
          const { name, email, token } = job.data;
          await mailProvider.sendMail(
            email,
            "Bem-vindo ao Coleciona.ai!",
            `<h1>Olá ${name}!</h1><p>Seu token: <strong>${token}</strong></p>`
          );
          break;
        }

        default:
          console.warn(`Job desconhecido: ${job.name}`);
      }
    } catch (err) {
      console.error(`Erro no envio de email para job ${job.id}`, err);
      throw err;
    }
  },
  {
    connection,
    concurrency: 10,
  }
);
