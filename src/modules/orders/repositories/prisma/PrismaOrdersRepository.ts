import { Order, OrderStatus } from "@prisma/client";
import {
  IOrdersRepository,
  ICreateOrderDTO,
} from "../../IOrdersRepository";
import prisma from "../../../../shared/infra/prisma";

export class PrismaOrdersRepository implements IOrdersRepository {
  async create({
    buyer_id,
    seller_id,
    product_id,
    conversation_id,
    final_price,
  }: ICreateOrderDTO): Promise<Order> {
    return await prisma.order.create({
      data: {
        buyer_id,
        seller_id,
        product_id,
        conversation_id,
        final_price,
        status: "PENDING",
      },
    });
  }

  async findById(id: string): Promise<Order | null> {
    return await prisma.order.findUnique({
      where: { id },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            banner: true,
            price: true,
          },
        },
      },
    });
  }

  async listByUser(user_id: string): Promise<Order[]> {
    return await prisma.order.findMany({
      where: {
        OR: [{ buyer_id: user_id }, { seller_id: user_id }],
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            banner: true,
            price: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  async listBySeller(user_id: string): Promise<Order[]> {
    return await prisma.order.findMany({
      where: {
        seller_id: user_id,
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            banner: true,
            price: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  async listByBuyer(user_id: string): Promise<Order[]> {
    return await prisma.order.findMany({
      where: {
        buyer_id: user_id,
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            banner: true,
            price: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  async updateStatus(
    id: string,
    status: "PENDING" | "COMPLETED" | "CANCELLED"
  ): Promise<Order> {
    return await prisma.order.update({
      where: { id },
      data: {
        status: status as OrderStatus,
        completed_at: status === "COMPLETED" ? new Date() : null,
      },
    });
  }
}
