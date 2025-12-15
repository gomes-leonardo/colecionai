import { injectable, inject } from "tsyringe";
import {
  IListProductDTO,
  IProductsRepository,
  ProductDetailsDTO,
} from "../../repositories/IProductsRepository";
import { ICacheProvider } from "../../../../shared/container/providers/CacheProvider/ICacheProvider";
import { Product } from "@prisma/client";

@injectable()
export class ListAllProductsUseCase {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository,
    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}

  async execute(filter: IListProductDTO) {
    const cacheKey = `products-list:${JSON.stringify(filter)}`;

    const productsInCache = await this.cacheProvider.recover<
      ProductDetailsDTO[]
    >(cacheKey);

    if (productsInCache) {
      console.log("⚡ Hit no Products in Cache! Retornando do Redis.");
      return productsInCache;
    }
    const result = await this.productsRepository.list({
      name: filter.name,
      condition: filter.condition,
      category: filter.category,
    });

    await this.cacheProvider.save(cacheKey, result);

    return result;
  }
}
