import { injectable, inject } from "tsyringe";
import { IProductsRepository } from "../../repositories/IProductsRepository";

@injectable()
export class ListUserProductsUseCase {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository
  ) {}

  async execute(userId: string) {
    const result = await this.productsRepository.listByUserId(userId);

    return result;
  }
}
