import "reflect-metadata";
import "dotenv/config";
import { auctionWorker } from "./AuctionJob";
import { emailWorker } from "./MailProvider";
import { connection } from "./queue";

connection.on("connect", () => {
  console.log("🔥 Redis conectado com sucesso!");
});

connection.on("error", (err) => {
  console.error("❌ Erro de conexão com Redis:", err);
});

const workers = [emailWorker, auctionWorker];

workers.forEach((worker) => {
  worker.on("active", (job) => {
    console.log(`[${worker.name}] Job ${job.id} iniciou...`);
  });

  worker.on("completed", (job) => {
    console.log(`[${worker.name}] Job ${job.id} completou!`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[${worker.name}] Job ${job?.id} falhou: ${err.message}`);
  });
});

console.log("🚀 Workers estão rodando e aguardando tarefas...");
