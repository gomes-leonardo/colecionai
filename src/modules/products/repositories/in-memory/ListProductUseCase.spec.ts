import { ListAllProductsUseCase } from "../../useCases/listProducts/listProductsUseCase";
import { ProductsRepositoryInMemory } from "./ProductsRepositoryInMemory";

let listAllProductsUseCase: ListAllProductsUseCase;
let productRepositoryInMemory: ProductsRepositoryInMemory;

describe("List all products", () => {
  beforeEach(() => {
    productRepositoryInMemory = new ProductsRepositoryInMemory();
    listAllProductsUseCase = new ListAllProductsUseCase(
      productRepositoryInMemory
    );
  });

  it("should be able to return all products", async () => {
    await productRepositoryInMemory.create({
      name: "Produto Teste",
      price: 100,
      userId: 1,
      banner: "foto.jpg",
    });

    const result = await listAllProductsUseCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty("id");
    expect(result[0].name).toEqual("Produto Teste");
  });
});
