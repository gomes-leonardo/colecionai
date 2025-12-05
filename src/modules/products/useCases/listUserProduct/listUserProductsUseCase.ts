import { IProductsRepository } from "../../repositories/IProductsRepository";

export class ListUserProductsUseCase {
  constructor(private productsRepository: IProductsRepository) {}

  async execute(userId: number) {
    const result = await this.productsRepository.listByUserId(userId);

    return result;
  }
}
