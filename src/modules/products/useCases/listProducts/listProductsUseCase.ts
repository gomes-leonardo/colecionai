import { IProductsRepository } from "../../repositories/IProductsRepository";

export class ListAllProductsUseCase {
  constructor(private productsRepository: IProductsRepository) {}

  async execute() {
    const result = await this.productsRepository.list();

    return result;
  }
}
