import { Product } from "@prisma/client";
import { randomUUID } from "crypto";
import {
  ICreateProductDTO,
  IListProductDTO,
  IProductsRepository,
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

  async findById(id: string): Promise<Product | null> {
    const product = this.products.find((product) => product.id === id);
    return product || null;
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
}
