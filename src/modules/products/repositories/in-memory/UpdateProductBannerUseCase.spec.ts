import { randomUUID } from "crypto";
import { AppError } from "../../../../shared/errors/AppError";
import { CreateProductUseCase } from "../../useCases/createProduct/createProductUseCase";
import { UpdateProductImageUseCase } from "../../useCases/updateBannerProduct/updateBannerProductUseCase"; // Ajuste o caminho
import { ProductsRepositoryInMemory } from "./ProductsRepositoryInMemory";

let updateProductImageUseCase: UpdateProductImageUseCase;
let createProductUseCase: CreateProductUseCase;
let productRepositoryInMemory: ProductsRepositoryInMemory;

describe("Update Product Image", () => {
  beforeEach(() => {
    productRepositoryInMemory = new ProductsRepositoryInMemory();
    updateProductImageUseCase = new UpdateProductImageUseCase(
      productRepositoryInMemory
    );
    createProductUseCase = new CreateProductUseCase(productRepositoryInMemory);
  });

  const userId = randomUUID();

  it("should be able to update product image", async () => {
    const product = await createProductUseCase.execute({
      name: "PS5",
      price: 4000,
      description: "Descrição",
      category: "MANGA",
      condition: "USED",
      userId: userId,
    });

    const updatedProduct = await updateProductImageUseCase.execute({
      productId: product.id,
      userId: product.user_id,
      imageFilename: "nova-foto.jpg",
    });
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    expect(product.id).toMatch(uuidRegex);
    expect(product.user_id).toMatch(uuidRegex);
    expect(updatedProduct.banner).toBe("nova-foto.jpg");
  });

  it("should not be able to update image of non-existing product", async () => {
    await expect(
      updateProductImageUseCase.execute({
        productId: "999",
        userId: userId,
        imageFilename: "foto.jpg",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to update image if user is not the owner", async () => {
    const product = await createProductUseCase.execute({
      name: "Xbox",
      price: 3000,
      description: "Descrição",
      category: "MANGA",
      condition: "USED",
      userId: "1",
    });

    await expect(
      updateProductImageUseCase.execute({
        productId: product.id,
        userId: "2",
        imageFilename: "hacked.jpg",
      })
    ).rejects.toEqual(expect.objectContaining({ statusCode: 403 }));
  });
});
