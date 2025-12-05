import { Product } from "@prisma/client";
import { ICreateProductDTO, IProductsRepository } from "../IProductsRepository";
import prisma from "../../../../shared/infra/prisma";

export class PrismaProductsRepository implements IProductsRepository {
  async create({
    name,
    price,
    userId,
    banner,
  }: ICreateProductDTO): Promise<Product> {
    const product = await prisma.product.create({
      data: {
        name,
        price,
        user_id: userId,
        banner,
      },
    });
    return product;
  }
  async list(): Promise<Product[]> {
    return await prisma.product.findMany();
  }
  async listByUserId(userId: number): Promise<Product[]> {
    return await prisma.product.findMany({
      where: { user_id: userId },
    });
  }
  async findById(id: number): Promise<Product | null> {
    return await prisma.product.findUnique({
      where: { id },
    });
  }

  async update(product: Product): Promise<Product> {
    return await prisma.product.update({
      where: { id: product.id, user_id: product.user_id },
      data: {
        name: product.name,
        price: product.price,
        banner: product.banner,
      },
    });
  }
  async delete(id: number): Promise<void> {
    await prisma.product.delete({
      where: { id },
    });
  }
}
