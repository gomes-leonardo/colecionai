import { Product } from "@prisma/client";
import { randomUUID } from "crypto";
import {
  ICreateProductDTO,
  IListProductDTO,
  IProductsRepository,
  ProductDetailsDTO,
} from "../IProductsRepository";

export class ProductsRepositoryInMemory implements IProductsRepository {
  products: Product[] = [];

  async create({
    name,
    price,
    description,
    category,
    condition,
    userId,
    banner,
  }: ICreateProductDTO): Promise<Product> {
    const product: Product = {
      id: randomUUID(),
      name,
      price,
      user_id: userId,
      banner: banner || null,
      status: "AVAILABLE",
      created_at: new Date(),
      updated_at: new Date(),
      description: description,
      category: category,
      condition: condition,
    };

    this.products.push(product);
    return product;
  }

  async list(filters?: IListProductDTO): Promise<Product[]> {
    let filteredProducts = [...this.products];

    // Filtrar apenas produtos disponíveis (como no Prisma)
    filteredProducts = filteredProducts.filter(
      (product) => product.status === "AVAILABLE"
    );

    if (filters?.name) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(filters.name!.toLowerCase())
      );
    }

    if (filters?.category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === filters.category
      );
    }

    if (filters?.condition) {
      filteredProducts = filteredProducts.filter(
        (product) => product.condition === filters.condition
      );
    }

    return filteredProducts;
  }

  async listByUserId(userId: string): Promise<Product[]> {
    return this.products.filter((product) => product.user_id === userId);
  }

  async findById(id: string): Promise<ProductDetailsDTO | null> {
    const product = this.products.find((product) => product.id === id);
    if (!product) return null;
    
    return {
      ...product,
      authorName: "Test User",
    };
  }

  async update(product: Product): Promise<Product> {
    const findIndex = this.products.findIndex((p) => p.id === product.id);

    this.products[findIndex] = product;

    return product;
  }

  async delete(id: string): Promise<void> {
    const findIndex = this.products.findIndex((product) => product.id === id);

    this.products.splice(findIndex, 1);
  }

  async updateStatus(
    id: string,
    status: "AVAILABLE" | "SOLD" | "IN_AUCTION" | "RESERVED"
  ): Promise<Product> {
    const findIndex = this.products.findIndex((product) => product.id === id);
    
    if (findIndex === -1) {
      throw new Error("Product not found");
    }

    this.products[findIndex] = {
      ...this.products[findIndex],
      status,
    };

    return this.products[findIndex];
  }
}
