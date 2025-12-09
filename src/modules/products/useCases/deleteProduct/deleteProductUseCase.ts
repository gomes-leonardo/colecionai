import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IProductsRepository } from "../../repositories/IProductsRepository";
import { ICacheProvider } from "../../../../shared/container/providers/CacheProvider/ICacheProvider";

@injectable()
export class DeleteProductUseCase {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository,
    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}

  async execute(id: string, userId: string) {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    if (product.user_id !== userId) {
      throw new AppError(
        "Você não tem permissão para deletar este produto",
        403
      );
    }
    await this.cacheProvider.invalidate(`product-details:${id}`);
    await this.cacheProvider.invalidatePrefix("products-list");

    await this.productsRepository.delete(id);
  }
}
