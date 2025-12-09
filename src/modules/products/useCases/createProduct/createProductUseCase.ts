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
    if (!name) throw new AppError("Campo nome é obrigatório.", 400);
    if (!price) throw new AppError("Campo preço é obrigatório.", 400);
    if (!description) throw new AppError("Descrição é obrigatória", 400);

    if (!Object.values(ProductCondition).includes(condition)) {
      if (!condition) throw new AppError("Campo condição é obrigatório", 400);
      throw new AppError("Condição inexistente", 400);
    }

    if (!Object.values(ProductCategory).includes(category)) {
      if (!category) throw new AppError("Campo category é obrigatório", 400);
      throw new AppError("Categoria inexistente", 400);
    }

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
