import { CreateProductUseCase } from "../../useCases/createProduct/createProductUseCase";
import { ProductsRepositoryInMemory } from "./ProductsRepositoryInMemory";
import crypto from "crypto";

let createProductUseCase: CreateProductUseCase;
let productRepositoryInMemory: ProductsRepositoryInMemory;

describe("Create Product", () => {
  beforeEach(() => {
    productRepositoryInMemory = new ProductsRepositoryInMemory();
    createProductUseCase = new CreateProductUseCase(productRepositoryInMemory);
  });

  const userId = crypto.randomUUID();
  it("should be able to create a new product", async () => {
    const product = await createProductUseCase.execute({
      name: "Product Test",
      price: 500,
      description: "Descrição",
      category: "MANGA",
      condition: "USED",
      userId: userId,
    });

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    expect(product.id).toMatch(uuidRegex);
    expect(product.user_id).toMatch(uuidRegex);
    expect(product.id).toBeTruthy();
  });
  it("should not be able to create a product with wrong condition", async () => {
    await expect(
      createProductUseCase.execute({
        userId: userId,
        name: "Test",
        price: 1000,
        description: "Description",
        category: "MANGA",
        condition: "WRONGCONDITION" as any,
      })
    ).rejects.toEqual(
      expect.objectContaining({
        message: "Condição inexistente",
        statusCode: 400,
      })
    );
  });
  it("should not be able to create a product with wrong category", async () => {
    await expect(
      createProductUseCase.execute({
        userId: userId,
        name: "Test",
        price: 1000,
        description: "Description",
        category: "WRONGCATEGORY" as any,
        condition: "NEW",
      })
    ).rejects.toEqual(
      expect.objectContaining({
        message: "Categoria inexistente",
        statusCode: 400,
      })
    );
  });
  it("should not be able to create a product without condition", async () => {
    await expect(
      createProductUseCase.execute({
        userId: userId,
        name: "Test",
        price: 10000,
        description: "Description",
        category: "MANGA",
        condition: null as any,
      })
    ).rejects.toEqual(
      expect.objectContaining({
        message: "Campo condição é obrigatório",
        statusCode: 400,
      })
    );
  });
  it("should not be able to create a product without category", async () => {
    await expect(
      createProductUseCase.execute({
        userId: userId,
        name: "Test",
        price: 1000,
        description: "Description",
        category: null as any,
        condition: "NEW",
      })
    ).rejects.toEqual(
      expect.objectContaining({
        message: "Campo category é obrigatório",
        statusCode: 400,
      })
    );
  });
  it("should not be able to create a product without name", async () => {
    await expect(
      createProductUseCase.execute({
        userId: userId,
        name: null as any,
        price: 1000,
        description: "Descrição",
        category: "MANGA",
        condition: "USED",
      })
    ).rejects.toEqual(
      expect.objectContaining({
        message: "Campo nome é obrigatório.",
        statusCode: 400,
      })
    );
  });
  it("should not be able to create a product without price", async () => {
    await expect(
      createProductUseCase.execute({
        userId: userId,
        name: "Test",
        price: null as any,
        description: "Descrição",
        category: "MANGA",
        condition: "USED",
      })
    ).rejects.toEqual(
      expect.objectContaining({
        message: "Campo preço é obrigatório.",
        statusCode: 400,
      })
    );
  });
});
