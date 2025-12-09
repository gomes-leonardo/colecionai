import fs from "fs";
import path from "path";
import uploadConfig from "../../../../config/upload";
import { IProductsRepository } from "../../repositories/IProductsRepository";
import { AppError } from "../../../../shared/errors/AppError";
import { injectable, inject } from "tsyringe";
import { ICacheProvider } from "../../../../shared/container/providers/CacheProvider/ICacheProvider";

interface IRequest {
  productId: string;
  userId: string;
  imageFilename: string;
}
@injectable()
export class UpdateProductImageUseCase {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository,
    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}

  async execute({ productId, userId, imageFilename }: IRequest) {
    const product = await this.productsRepository.findById(productId);

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    if (product.user_id !== userId) {
      throw new AppError(
        "Você não tem permissão para editar este produto",
        403
      );
    }
    await this.cacheProvider.invalidate(`product-details:${productId}`);
    await this.cacheProvider.invalidatePrefix("products-list");

    if (product.banner) {
      const productBannerFilePath = path.join(
        uploadConfig.directory,
        product.banner
      );

      const productBannerFileExists = await fs.promises
        .stat(productBannerFilePath)
        .catch(() => false);

      if (productBannerFileExists) {
        await fs.promises.unlink(productBannerFilePath);
      }
    }

    product.banner = imageFilename;

    const result = await this.productsRepository.update(product);

    return result;
  }
}
