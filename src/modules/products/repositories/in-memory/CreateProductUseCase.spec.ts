import { AppError } from "../../../../shared/errors/AppError";
import { CreateProductUseCase } from "../../useCases/createProduct/createProductUseCase";
import { ProductsRepositoryInMemory } from "./ProductsRepositoryInMemory";

let createProductUseCase: CreateProductUseCase;
let productRepositoryInMemory: ProductsRepositoryInMemory;

describe("Create Product", () => {
  beforeEach(() => {
    productRepositoryInMemory = new ProductsRepositoryInMemory();
    createProductUseCase = new CreateProductUseCase(productRepositoryInMemory);
  });

  it("should be able to create a new product", async () => {
    const user = await createProductUseCase.execute({
      name: "Product Test",
      price: 500,
      userId: 1,
    });

    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("user_id");
    expect(user.id).toBeTruthy();
  });

  it("should not be able to create a product without name", async () => {
    await expect(
      createProductUseCase.execute({
        userId: 1,
        name: "",
        price: 100,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  it("should not be able to create a product without price", async () => {
    await expect(
      createProductUseCase.execute({
        userId: 1,
        name: "Test",
        price: 0,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
