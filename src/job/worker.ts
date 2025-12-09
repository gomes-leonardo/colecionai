import "reflect-metadata";
import "dotenv/config";
import { Worker } from "bullmq";
import { connection } from "./queue";
import { SMTPMailProvider } from "../shared/container/providers/MailProvider/Implementations/SMTPMailProvider";

console.log("[Worker] Iniciando worker...");
console.log("[Worker] Variáveis de ambiente:", {
  REDIS_HOST: process.env.REDIS_HOST || "não definido",
  REDIS_PORT: process.env.REDIS_PORT || "não definido",
  SMTP_HOST: process.env.SMTP_HOST ? "definido" : "não definido",
  SMTP_PORT: process.env.SMTP_PORT || "não definido",
  NODE_ENV: process.env.NODE_ENV || "não definido",
});

let mailProvider: SMTPMailProvider;

try {
  mailProvider = new SMTPMailProvider();
  console.log("[Worker] SMTPMailProvider inicializado com sucesso");
} catch (error) {
  console.error("[Worker] Erro ao inicializar SMTPMailProvider:", error);
  console.error("[Worker] Worker não pode continuar sem configuração SMTP válida");
  process.exit(1);
}

connection.connect().catch((err) => {
  console.error("[Worker] Erro ao conectar ao Redis:", err);
  console.error("[Worker] Verifique se o Redis está rodando e acessível");
  process.exit(1);
});

connection.on("connect", () => {
  console.log("[Worker] Conectado ao Redis com sucesso");
});

connection.on("error", (err) => {
  console.error("[Worker] Erro no Redis:", err);
});

connection.on("ready", () => {
  console.log("[Worker] Redis está pronto");
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

        await mailProvider.sendMail(
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

worker.on("ready", () => {
  console.log("[Worker] Worker está pronto e aguardando jobs...");
});

// Tratamento de sinais para shutdown graceful
process.on("SIGTERM", async () => {
  console.log("[Worker] Recebido SIGTERM, encerrando worker...");
  await worker.close();
  await connection.quit();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("[Worker] Recebido SIGINT, encerrando worker...");
  await worker.close();
  await connection.quit();
  process.exit(0);
});

// Log de inicialização
console.log("[Worker] Worker iniciado e aguardando jobs...");
console.log("[Worker] Processando fila: emails");
