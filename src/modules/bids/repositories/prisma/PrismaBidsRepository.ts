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

  async findByUser(user_id: string) {
    const bids = await prisma.bid.findMany({
      where: { user_id },
      include: {
        auction: {
          select: {
            id: true,
            status: true,
            end_date: true,
            product: { select: { name: true, banner: true } },
          },
        },
      },
      orderBy: { created_at: "asc" },
    });

    const auctionIds = [...new Set(bids.map((b) => b.auction_id))];

    const [currentByAuction, myBestByAuction] = await Promise.all([
      prisma.bid.groupBy({
        by: ["auction_id"],
        where: { auction_id: { in: auctionIds } },
        _max: { amount: true },
      }),
      prisma.bid.groupBy({
        by: ["auction_id"],
        where: { auction_id: { in: auctionIds }, user_id },
        _max: { amount: true },
      }),
    ]);

    const currentMap = new Map(
      currentByAuction.map((x) => [x.auction_id, x._max.amount])
    );
    const myBestMap = new Map(
      myBestByAuction.map((x) => [x.auction_id, x._max.amount])
    );

    const toNumber = (v: any) => (v == null ? null : Number(v.toString()));

    return bids.map((bid) => {
      const current = currentMap.get(bid.auction_id) ?? null;
      const myBest = myBestMap.get(bid.auction_id) ?? null;

      const currentN = toNumber(current);
      const myBestN = toNumber(myBest);

      return {
        ...bid,
        currentPrice: currentN,
        myBestBid: myBestN,
        isSurpassed:
          myBestN != null && currentN != null ? myBestN < currentN : false,
      };
    });
  }
}
