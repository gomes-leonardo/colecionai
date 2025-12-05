import { Product } from "@prisma/client";

export interface ICreateProductDTO {
  name: string;
  price: number;
  userId: number;
  banner: string;
}

export interface IProductsRepository {
  create(data: ICreateProductDTO): Promise<Product>;
  list(): Promise<Product[]>;
  listByUserId(userId: number): Promise<Product[]>;
  findById(id: number): Promise<Product | null>;
  update(product: Product): Promise<Product>;
  delete(id: number): Promise<void>;
}
