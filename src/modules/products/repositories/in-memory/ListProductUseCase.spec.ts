import { InMemoryCacheProvider } from "../../../../shared/container/providers/CacheProvider/Implementations/InMemoryCacheProvider";
import { ListAllProductsUseCase } from "../../useCases/listProducts/listProductsUseCase";
import { ProductsRepositoryInMemory } from "./ProductsRepositoryInMemory";

let listAllProductsUseCase: ListAllProductsUseCase;
let productRepositoryInMemory: ProductsRepositoryInMemory;
let cacheProvider: InMemoryCacheProvider;

describe("List all products", () => {
  beforeEach(() => {
    productRepositoryInMemory = new ProductsRepositoryInMemory();
    cacheProvider = new InMemoryCacheProvider();

    listAllProductsUseCase = new ListAllProductsUseCase(
      productRepositoryInMemory,
      cacheProvider
    );
  });

  it("should be able to return all products", async () => {
    await productRepositoryInMemory.create({
      name: "Produto Teste",
      price: 100,
      description: "Descrição",
      category: "COMIC_BOOKS",
      condition: "NEW",
      userId: "1",
      banner: "foto.jpg",
    });

    const result = await listAllProductsUseCase.execute({});

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty("id");
    expect(result[0].name).toEqual("Produto Teste");
  });
});
