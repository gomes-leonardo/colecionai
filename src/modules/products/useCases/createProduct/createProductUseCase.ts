import { ProductCategory, ProductCondition } from "@prisma/client";
import { AppError } from "../../../../shared/errors/AppError";
import { IProductsRepository } from "../../repositories/IProductsRepository";
import { inject, injectable } from "tsyringe";
import { ICacheProvider } from "../../../../shared/container/providers/CacheProvider/ICacheProvider";

interface IRequest {
  name: string;
  price: number;
  description: string;
  category: ProductCategory;
  condition: ProductCondition;
  userId: string;
}
@injectable()
export class CreateProductUseCase {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository,
    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}

  async execute({
    name,
    price,
    userId,
    description,
    category,
    condition,
  }: IRequest) {
    const product = await this.productsRepository.create({
      name,
      price,
      description,
      category,
      condition,
      userId,
      banner: "",
    });
    await this.cacheProvider.invalidatePrefix("products-list");

    return product;
  }
}
