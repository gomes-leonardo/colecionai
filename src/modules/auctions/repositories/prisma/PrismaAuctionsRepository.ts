import { Auction } from "@prisma/client";
import {
  AuctionWithProduct,
  IAuctionsRepository,
  ICreateAuctionDTO,
  IListAuctionsDTO,
} from "../../IAuctionsRepository";
import prisma from "../../../../shared/infra/prisma";

export class PrismaAuctionsRepository implements IAuctionsRepository {
  async create({
    product_id,
    start_date,
    start_price,
    end_date,
  }: ICreateAuctionDTO): Promise<Auction> {
    const auction = await prisma.auction.create({
      data: {
        product_id,
        start_date,
        end_date,
        start_price,
      },
    });
    return auction;
  }
  async list({
    name,
    category,
    condition,
    page,
    per_page,
  }: IListAuctionsDTO): Promise<Auction[]> {
    const skip = (page - 1) * per_page;
    const auctions = await prisma.auction.findMany({
      skip,
      take: per_page,
      where: {
        // Filtra apenas leilões ativos
        end_date: {
          gt: new Date(),
        },
        product: {
          name: name ? { contains: name, mode: "insensitive" } : undefined,
          category: category ? { equals: category } : undefined,
          condition: condition ? { equals: condition } : undefined,
        },
      },
      include: {
        product: {
          select: {
            name: true,
            description: true,
            banner: true,
          },
        },
      },
      orderBy: {
        end_date: "asc",
      },
    });
    return auctions;
  }
  async findByProductId(product_id: string): Promise<Auction | null> {
    return await prisma.auction.findUnique({
      where: { product_id },
    });
  }
  async findById(id: string): Promise<AuctionWithProduct | null> {
    return await prisma.auction.findUnique({
      where: { id },
      include: {
        product: true,
        _count: {
          select: { bids: true },
        },
      },
    });
  }
  async findByUserId(user_id: string): Promise<Auction[]> {
    const auctions = await prisma.auction.findMany({
      where: {
        // A MÁGICA: Filtra pelo relacionamento
        product: {
          user_id: user_id,
        },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            banner: true,
            category: true,
          },
        },
      },
    });

    return auctions;
  }
  async findByIdWithDetails(id: string): Promise<Auction | null> {
    const auction = await prisma.auction.findUnique({
      where: { id },
      include: {
        product: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        bids: {
          orderBy: { amount: "desc" },
          take: 10,
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: { bids: true },
        },
      },
    });

    return auction;
  }

  async update(id: string, data: any): Promise<Auction> {
    return await prisma.auction.update({
      where: { id },
      data,
    });
  }
  async delete(id: string): Promise<Auction> {
    return await prisma.auction.delete({
      where: { id },
    });
  }
}
