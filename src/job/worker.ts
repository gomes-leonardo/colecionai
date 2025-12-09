import "reflect-metadata";
import "dotenv/config";
import { Worker } from "bullmq";
import { connection } from "./queue";
import { SMTPMailProvider } from "../shared/container/providers/MailProvider/Implementations/SMTPMailProvider";

const mailProvider = new SMTPMailProvider();
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
    if (job.name === "register-confirmation") {
      const { name, email, token } = job.data;
      await mailProvider.sendMail(
        email,
        "Bem-vindo ao Coleciona Ai! 🚀",
        `
        <h1>Olá, ${name}!</h1>
        <p>Estamos muito felizes em ter você aqui.</p>
        <p>Prepare-se para dar lances incríveis em itens raros.</p>
        <br/>
        <p>Seu token de verificação: ${token}</p>
        <strong>Equipe Coleciona.ai</strong>
      `
      );
    }
  },
  { connection }
);

console.log("Worker rodando...");
