import { AppError } from "../../../../shared/errors/AppError";
import { CreateProductUseCase } from "../../useCases/createProduct/createProductUseCase";
import { UpdateProductUseCase } from "../../useCases/updateProduct/updateProductUseCase";
import { ProductsRepositoryInMemory } from "./ProductsRepositoryInMemory";

let updateProductUseCase: UpdateProductUseCase;
let productRepositoryInMemory: ProductsRepositoryInMemory;
let createProductUseCase: CreateProductUseCase;

describe("Update Product Info", () => {
  beforeEach(() => {
    productRepositoryInMemory = new ProductsRepositoryInMemory();
    updateProductUseCase = new UpdateProductUseCase(productRepositoryInMemory);
    createProductUseCase = new CreateProductUseCase(productRepositoryInMemory);
  });

  it("should be able to update a product", async () => {
    const oldProduct = await createProductUseCase.execute({
      name: "Original",
      price: 500,
      userId: 1,
    });

    const newProduct = await updateProductUseCase.execute({
      id: oldProduct.id,
      name: "Editado",
      price: 1000,
      userId: 1,
    });

    expect(newProduct.name).toEqual("Editado");
    expect(newProduct.price).toEqual(1000);
  });

  it("should not be able to update a non-existing product", async () => {
    await expect(
      updateProductUseCase.execute({
        id: 9999,
        name: "Test",
        price: 100,
        userId: 1,
      })
    ).rejects.toEqual(
      expect.objectContaining({ message: "Produto não encontrado" })
    );
  });

  it("should not be able to update a product if user is not the owner", async () => {
    const product = await createProductUseCase.execute({
      name: "Original",
      price: 500,
      userId: 1,
    });

    await expect(
      updateProductUseCase.execute({
        id: product.id,
        name: "Hacked",
        price: 0,
        userId: 2,
      })
    ).rejects.toEqual(
      expect.objectContaining({
        message: "Você não tem permissão para editar este produto",
      })
    );
  });
});
