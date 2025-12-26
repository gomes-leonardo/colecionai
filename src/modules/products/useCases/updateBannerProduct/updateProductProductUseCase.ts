import { IProductsRepository } from "../../repositories/IProductsRepository";
import { AppError } from "../../../../shared/errors/AppError";
import { injectable, inject } from "tsyringe";
import { ICacheProvider } from "../../../../shared/container/providers/CacheProvider/ICacheProvider";
import { IStorageProvider } from "../../../../shared/container/providers/StorageProvider/IStorageProvider";

interface IRequest {
  productId: string;
  userId: string;
  file: Express.Multer.File;
}
@injectable()
export class UpdateProductImageUseCase {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository,
    @inject("CacheProvider")
    private cacheProvider: ICacheProvider,
    @inject("StorageProvider")
    private storageProvider: IStorageProvider
  ) {}

  async execute({ productId, userId, file }: IRequest) {
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
      await this.storageProvider.deleteFile(product.banner);
    }

    const imageUrl = await this.storageProvider.saveFile(file);

    product.banner = imageUrl;

    const result = await this.productsRepository.update(product);

    return result;
  }
}
