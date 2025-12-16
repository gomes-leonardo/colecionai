import "reflect-metadata";
import { Worker } from "bullmq";
import { container } from "tsyringe";
import { connection } from "./queue";
import { CloseAuctionUseCase } from "../modules/auctions/useCases/closeAuctionUseCase/CloseAuctionUseCase";
import "../shared/container/index";

export const auctionWorker = new Worker(
  "auctions",
  async (job) => {
    if (job.name === "close-auction") {
      const { auction_id } = job.data;

      console.log(`⏳ Processando fechamento de leilão: ${auction_id}`);

      try {
        const closeAuctionUseCase = container.resolve(CloseAuctionUseCase);

        await closeAuctionUseCase.execute(auction_id);

        console.log(`✅ Leilão ${auction_id} encerrado via Worker.`);
      } catch (err) {
        console.error(`❌ Erro ao fechar leilão ${auction_id}:`, err);
        throw err;
      }
    }
  },
  {
    connection,
    concurrency: 5, // Processa 5 leilões paralelos
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 500 },
  }
);
