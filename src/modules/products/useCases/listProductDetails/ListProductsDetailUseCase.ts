import { injectable, inject } from "tsyringe";
import { IProductsRepository } from "../../repositories/IProductsRepository";
import { AppError } from "../../../../shared/errors/AppError";
import { ICacheProvider } from "../../../../shared/container/providers/CacheProvider/ICacheProvider";
import { Product } from "@prisma/client";

@injectable()
export class ListProductsDetailUseCase {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository,
    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}

  async execute(productId: string) {
    const cacheKey = `products-list:${JSON.stringify(productId)}`;

    const productDetailsInCache = await this.cacheProvider.recover<Product>(
      cacheKey
    );

    if (productDetailsInCache) {
      console.log("⚡ Hit no ProductDetailsCache! Retornando do Redis.");
      return productDetailsInCache;
    }
    const result = await this.productsRepository.findById(productId);

    await this.cacheProvider.save(cacheKey, result);

    return result;
  }
}
