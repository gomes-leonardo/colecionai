import { ProductCategory, ProductCondition } from "@prisma/client";
import { AppError } from "../../../../shared/errors/AppError";
import { IProductsRepository } from "../../repositories/IProductsRepository";
import { injectable, inject } from "tsyringe";
import { ICacheProvider } from "../../../../shared/container/providers/CacheProvider/ICacheProvider";

interface IRequest {
  id: string;
  name: string;
  price: number;
  description: string;
  condition: ProductCondition;
  category: ProductCategory;
  userId: string;
}

@injectable()
export class UpdateProductUseCase {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository,
    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}

  async execute({
    id,
    name,
    price,
    userId,
    description,
    category,
    condition,
  }: IRequest) {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    if (product.user_id !== userId) {
      throw new AppError(
        "Você não tem permissão para editar este produto",
        403
      );
    }

    if (price <= 0) {
      throw new AppError("Preço deve ser maior que zero.", 400);
    }

    await this.cacheProvider.invalidate(`product-details:${product.id}`);
    await this.cacheProvider.invalidatePrefix("products-list");

    product.name = name;
    product.price = price;
    product.category = category;
    product.condition = condition;
    product.description = description;

    const result = await this.productsRepository.update(product);

    return result;
  }
}
