import { Product, ProductCategory } from "@prisma/client";
import {
  ICreateProductDTO,
  IListProductDTO,
  IProductsRepository,
  ProductDetailsDTO,
} from "../IProductsRepository";
import prisma from "../../../../shared/infra/prisma";

export class PrismaProductsRepository implements IProductsRepository {
  async create({
    name,
    price,
    description,
    category,
    condition,
    userId,
    banner,
  }: ICreateProductDTO): Promise<Product> {
    const product = await prisma.product.create({
      data: {
        name,
        price,
        description,
        category,
        condition,
        user_id: userId,
        banner,
      },
    });
    return product;
  }
  async list({
    name,
    condition,
    category,
  }: IListProductDTO): Promise<Product[]> {
    return await prisma.product.findMany({
      where: {
        name: name ? { contains: name, mode: "insensitive" } : undefined,
        category: category ? { equals: category } : undefined,
        condition: condition ? { equals: condition } : undefined,
        auction: { is: null },
      },
    });
  }
  async listByUserId(userId: string): Promise<Product[]> {
    return await prisma.product.findMany({
      where: { user_id: userId },
    });
  }
  async findById(id: string): Promise<ProductDetailsDTO | null> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!product) return null;

    const { user, ...productData } = product;

    return {
      ...productData,
      authorName: user.name || "Desconhecido",
    };
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
  async delete(id: string): Promise<void> {
    await prisma.product.delete({
      where: { id },
    });
  }
}
