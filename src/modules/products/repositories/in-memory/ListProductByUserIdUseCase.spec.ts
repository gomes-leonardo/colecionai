import { ListAllProductsUseCase } from "../../useCases/listProducts/listProductsUseCase";
import { ListUserProductsController } from "../../useCases/listUserProduct/ListUserProductsController";
import { ListUserProductsUseCase } from "../../useCases/listUserProduct/listUserProductsUseCase";
import { ProductsRepositoryInMemory } from "./ProductsRepositoryInMemory";

let listUserProductUseCase: ListUserProductsUseCase;
let productRepositoryInMemory: ProductsRepositoryInMemory;

describe("List products by user", () => {
  beforeEach(() => {
    productRepositoryInMemory = new ProductsRepositoryInMemory();
    listUserProductUseCase = new ListUserProductsUseCase(
      productRepositoryInMemory
    );
  });

  it("should be able to return my product", async () => {
    const product = await productRepositoryInMemory.create({
      name: "Meu produto",
      price: 100,
      description: "Descrição",
      category: "MANGA",
      condition: "USED",
      userId: "2",
      banner: "foto.jpg",
    });

    const result = await listUserProductUseCase.execute(product.user_id);

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty("id");
    expect(result[0].name).toEqual("Meu produto");
  });

  it("should return empty array when user has no products", async () => {
    const result = await listUserProductUseCase.execute("non-existent-user");

    expect(result).toHaveLength(0);
  });

  it("should return only products from the specified user", async () => {
    const userId1 = "user-1";
    const userId2 = "user-2";

    await productRepositoryInMemory.create({
      name: "Produto User 1",
      price: 100,
      description: "Descrição",
      category: "MANGA",
      condition: "USED",
      userId: userId1,
      banner: "foto.jpg",
    });

    await productRepositoryInMemory.create({
      name: "Produto User 2",
      price: 200,
      description: "Descrição",
      category: "COMIC_BOOKS",
      condition: "NEW",
      userId: userId2,
      banner: "foto2.jpg",
    });

    const result = await listUserProductUseCase.execute(userId1);

    expect(result).toHaveLength(1);
    expect(result[0].name).toEqual("Produto User 1");
  });
});
