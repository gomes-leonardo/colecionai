import { randomUUID } from "crypto";
import { AppError } from "../../../../shared/errors/AppError";
import { CreateProductUseCase } from "../../useCases/createProduct/createProductUseCase";
import { UpdateProductUseCase } from "../../useCases/updateProduct/updateProductUseCase";
import { ProductsRepositoryInMemory } from "./ProductsRepositoryInMemory";
import { InMemoryCacheProvider } from "../../../../shared/container/providers/CacheProvider/Implementations/InMemoryCacheProvider";

let updateProductUseCase: UpdateProductUseCase;
let productRepositoryInMemory: ProductsRepositoryInMemory;
let createProductUseCase: CreateProductUseCase;
let cacheProvider: InMemoryCacheProvider;

describe("Update Product Info", () => {
  beforeEach(() => {
    productRepositoryInMemory = new ProductsRepositoryInMemory();

    productRepositoryInMemory = new ProductsRepositoryInMemory();
    cacheProvider = new InMemoryCacheProvider();
    updateProductUseCase = new UpdateProductUseCase(
      productRepositoryInMemory,
      cacheProvider
    );
    createProductUseCase = new CreateProductUseCase(
      productRepositoryInMemory,
      cacheProvider
    );
  });

  const userId = randomUUID();

  it("should be able to update a product", async () => {
    const oldProduct = await createProductUseCase.execute({
      name: "Original",
      price: 500,
      description: "Descrição",
      category: "MANGA",
      condition: "USED",
      userId: userId,
    });

    const newProduct = await updateProductUseCase.execute({
      id: oldProduct.id,
      name: "Editado",
      price: 1000,
      description: "Descrição",
      category: "MANGA",
      condition: "USED",
      userId: oldProduct.user_id,
    });
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    expect(newProduct.id).toMatch(uuidRegex);
    expect(newProduct.user_id).toMatch(uuidRegex);
    expect(newProduct.name).toEqual("Editado");
    expect(newProduct.price).toEqual(1000);
  });

  it("should not be able to update a non-existing product", async () => {
    await expect(
      updateProductUseCase.execute({
        id: "9999",
        name: "Test",
        price: 100,
        description: "Descrição",
        category: "MANGA",
        condition: "USED",
        userId: userId,
      })
    ).rejects.toEqual(
      expect.objectContaining({
        message: "Produto não encontrado",
        statusCode: 404,
      })
    );
  });

  it("should not be able to update a product if user is not the owner", async () => {
    const product = await createProductUseCase.execute({
      name: "Original",
      price: 500,
      description: "Descrição",
      category: "MANGA",
      condition: "USED",
      userId: userId,
    });

    await expect(
      updateProductUseCase.execute({
        id: product.id,
        name: "Hacked",
        price: 0,
        description: "Descrição",
        category: "MANGA",
        condition: "USED",
        userId: "2",
      })
    ).rejects.toEqual(
      expect.objectContaining({
        message: "Você não tem permissão para editar este produto",
        statusCode: 403,
      })
    );
  });

  it("should not be able to update a product with negative price", async () => {
    const product = await createProductUseCase.execute({
      name: "Original",
      price: 500,
      description: "Descrição",
      category: "MANGA",
      condition: "USED",
      userId: userId,
    });

    await expect(
      updateProductUseCase.execute({
        id: product.id,
        name: "Editado",
        price: -100,
        description: "Descrição",
        category: "MANGA",
        condition: "USED",
        userId: product.user_id,
      })
    ).rejects.toEqual(
      expect.objectContaining({
        message: "Preço deve ser maior que zero.",
        statusCode: 400,
      })
    );
  });

  it("should not be able to update a product with zero price", async () => {
    const product = await createProductUseCase.execute({
      name: "Original",
      price: 500,
      description: "Descrição",
      category: "MANGA",
      condition: "USED",
      userId: userId,
    });

    await expect(
      updateProductUseCase.execute({
        id: product.id,
        name: "Editado",
        price: 0,
        description: "Descrição",
        category: "MANGA",
        condition: "USED",
        userId: product.user_id,
      })
    ).rejects.toEqual(
      expect.objectContaining({
        message: "Preço deve ser maior que zero.",
        statusCode: 400,
      })
    );
  });
});
