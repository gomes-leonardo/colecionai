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
});
