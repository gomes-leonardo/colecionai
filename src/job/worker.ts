import "reflect-metadata";
import "dotenv/config";
import { Worker } from "bullmq";
import { connection } from "./queue";
import { IMailProvider } from "../shared/container/providers/MailProvider/IMailProvider";
import { ConsoleMailProvider } from "../shared/container/providers/MailProvider/Implementations/ConsoleMailProvider";
import { SMTPMailProvider } from "../shared/container/providers/MailProvider/Implementations/SMTPMailProvider";

// Lazy initialization do mail provider
let mailProvider: IMailProvider | null = null;

function getMailProvider(): IMailProvider {
  if (!mailProvider) {
    const useSMTP = process.env.USE_SMTP === "true" && 
                    process.env.SMTP_HOST && 
                    process.env.SMTP_PORT && 
                    process.env.SMTP_USER && 
                    process.env.SMTP_PASS;

    if (useSMTP) {
      try {
        mailProvider = new SMTPMailProvider();
        console.log("[Worker] Usando SMTPMailProvider para envio de emails");
      } catch (error) {
        console.warn("[Worker] Falha ao inicializar SMTP, usando ConsoleMailProvider:", error);
        mailProvider = new ConsoleMailProvider();
      }
    } else {
      mailProvider = new ConsoleMailProvider();
      console.log("[Worker] Usando ConsoleMailProvider (simulação com console.log)");
    }
  }
  return mailProvider;
}

connection.on("connect", () => {
  console.log("[Worker] Conectado ao Redis com sucesso");
});

connection.on("error", (err) => {
  console.error("[Worker] Erro no Redis:", err);
});

export const worker = new Worker(
"emails",
  async (job) => {
    try {
      console.log(`[Worker] Processando job: ${job.name}`, { jobId: job.id, data: job.data });

      if (job.name === "forgot-password") {
        const { name, email, link } = job.data;

        if (!name || !email || !link) {
          throw new Error("Dados incompletos para forgot-password");
        }

        await getMailProvider().sendMail(
          email,
          "Recuperação de Senha",
          `Olá ${name}, clique aqui para resetar: <a href="${link}">Link</a>`
        );

        console.log(`[Worker] Email de recuperação enviado para: ${email}`);
      } else if (job.name === "register-confirmation") {
        const { name, email, token } = job.data;

        if (!name || !email || !token) {
          throw new Error("Dados incompletos para register-confirmation");
        }

        await getMailProvider().sendMail(
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

        console.log(`[Worker] Email de confirmação enviado para: ${email}`);
      } else {
        console.warn(`[Worker] Tipo de job desconhecido: ${job.name}`);
      }
    } catch (error) {
      console.error(`[Worker] Erro ao processar job ${job.id}:`, error);
      throw error; // Re-throw para o BullMQ tentar novamente
    }
  },
  { 
    connection,
    concurrency: 5, // Processar até 5 jobs simultaneamente
    removeOnComplete: {
      count: 100, // Manter apenas os últimos 100 jobs completos
    },
    removeOnFail: {
      count: 500, // Manter os últimos 500 jobs falhados para debug
    },
  }
);

worker.on("completed", (job) => {
  console.log(`[Worker] Job ${job.id} completado com sucesso`);
});

worker.on("failed", (job, err) => {
  console.error(`[Worker] Job ${job?.id} falhou:`, err);
});

worker.on("error", (err) => {
  console.error("[Worker] Erro no worker:", err);
});

console.log("[Worker] Worker iniciado e aguardando jobs...");
