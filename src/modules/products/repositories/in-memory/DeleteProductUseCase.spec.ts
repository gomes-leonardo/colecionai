import { AppError } from "../../../../shared/errors/AppError";
import { CreateProductUseCase } from "../../useCases/createProduct/createProductUseCase";
import { DeleteProductUseCase } from "../../useCases/deleteProduct/deleteProductUseCase";
import { ProductsRepositoryInMemory } from "./ProductsRepositoryInMemory";

let deleteProductUseCase: DeleteProductUseCase;
let productRepositoryInMemory: ProductsRepositoryInMemory;
let createProductUseCase: CreateProductUseCase;

describe("Delete Product", () => {
  beforeEach(() => {
    productRepositoryInMemory = new ProductsRepositoryInMemory();
    deleteProductUseCase = new DeleteProductUseCase(productRepositoryInMemory);
    createProductUseCase = new CreateProductUseCase(productRepositoryInMemory);
  });

  it("should be able to delete a product", async () => {
    const product = await createProductUseCase.execute({
      name: "Product Test",
      price: 500,
      userId: 1,
    });

    await deleteProductUseCase.execute(product.id, 1);

    const findProduct = await productRepositoryInMemory.findById(product.id);
    expect(findProduct).toBeNull();
  });

  it("should not be able to delete a non-existing product", async () => {
    await expect(deleteProductUseCase.execute(9999, 1)).rejects.toEqual(
      expect.objectContaining({
        message: "Produto não encontrado",
        statusCode: 404,
      })
    );
  });

  it("should not be able to delete a product if user is not the owner", async () => {
    const product = await createProductUseCase.execute({
      name: "Product Test",
      price: 500,
      userId: 1,
    });

    await expect(deleteProductUseCase.execute(product.id, 999)).rejects.toEqual(
      expect.objectContaining({
        message: "Você não tem permissão para deletar este produto",
        statusCode: 403,
      })
    );
  });
});
