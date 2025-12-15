import { Bid } from "@prisma/client";
import { IBidsRepository, ICreateBidDTO } from "../IBidsRepository";
import prisma from "../../../../shared/infra/prisma";

export class PrismaBidsRepository implements IBidsRepository {
  async create({ auction_id, amount, user_id }: ICreateBidDTO): Promise<Bid> {
    const bid = await prisma.bid.create({
      data: {
        auction_id,
        amount,
        user_id,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return bid;
  }
  async findHighestBid(auction_id: string): Promise<Bid | null> {
    const highestBid = await prisma.bid.findFirst({
      where: { auction_id },
      orderBy: { amount: "asc" },
    });

    return highestBid;
  }
}
