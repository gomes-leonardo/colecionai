import { Worker } from "bullmq";
import { connection } from "./queue";
import { EtherealMailProvider } from "../shared/container/providers/MailProvider/Implementations/EtherealMailProvider";

const mailProvider = new EtherealMailProvider();
export const worker = new Worker(
  "emails",
  async (job) => {
    if (job.name === "forgot-password") {
      const { name, email, link } = job.data;

      await mailProvider.sendMail(
        email,
        "Recuperação de Senha",
        `Olá ${name}, clique aqui para resetar: <a href="${link}">Link</a>`
      );
    }
  },
  { connection }
);

console.log("Worker rodando...");
