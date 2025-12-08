import { ProductCategory, ProductCondition } from "@prisma/client";
import { AppError } from "../../../../shared/errors/AppError";
import { IProductsRepository } from "../../repositories/IProductsRepository";
import { injectable, inject } from "tsyringe";

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
    private productsRepository: IProductsRepository
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

    product.name = name;
    product.price = price;
    product.category = category;
    product.condition = condition;
    product.description = description;

    const result = await this.productsRepository.update(product);

    return result;
  }
}
