import { Product, ProductCategory, ProductCondition } from "@prisma/client";

export interface ICreateProductDTO {
  name: string;
  price: number;
  description: string;
  category: ProductCategory;
  condition: ProductCondition;
  userId: string;
  banner: string;
}

export interface IListProductDTO {
  name?: string;
  category?: ProductCategory;
  condition?: ProductCondition;
}

export interface IProductsRepository {
  create(data: ICreateProductDTO): Promise<Product>;
  list(filters?: IListProductDTO): Promise<Product[]>;
  listByUserId(userId: string): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  update(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
}
