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

  it("should be able to filter products by name", async () => {
    await productRepositoryInMemory.create({
      name: "Produto Teste",
      price: 100,
      description: "Descrição",
      category: "COMIC_BOOKS",
      condition: "NEW",
      userId: "1",
      banner: "foto.jpg",
    });

    await productRepositoryInMemory.create({
      name: "Outro Produto",
      price: 200,
      description: "Descrição",
      category: "MANGA",
      condition: "USED",
      userId: "2",
      banner: "foto2.jpg",
    });

    const result = await listAllProductsUseCase.execute({ name: "Teste" });

    expect(result).toHaveLength(1);
    expect(result[0].name).toEqual("Produto Teste");
  });

  it("should be able to filter products by category", async () => {
    await productRepositoryInMemory.create({
      name: "Produto Teste",
      price: 100,
      description: "Descrição",
      category: "COMIC_BOOKS",
      condition: "NEW",
      userId: "1",
      banner: "foto.jpg",
    });

    await productRepositoryInMemory.create({
      name: "Outro Produto",
      price: 200,
      description: "Descrição",
      category: "MANGA",
      condition: "USED",
      userId: "2",
      banner: "foto2.jpg",
    });

    const result = await listAllProductsUseCase.execute({
      category: "MANGA",
    });

    expect(result).toHaveLength(1);
    expect(result[0].category).toEqual("MANGA");
  });

  it("should be able to filter products by condition", async () => {
    await productRepositoryInMemory.create({
      name: "Produto Teste",
      price: 100,
      description: "Descrição",
      category: "COMIC_BOOKS",
      condition: "NEW",
      userId: "1",
      banner: "foto.jpg",
    });

    await productRepositoryInMemory.create({
      name: "Outro Produto",
      price: 200,
      description: "Descrição",
      category: "MANGA",
      condition: "USED",
      userId: "2",
      banner: "foto2.jpg",
    });

    const result = await listAllProductsUseCase.execute({
      condition: "USED",
    });

    expect(result).toHaveLength(1);
    expect(result[0].condition).toEqual("USED");
  });

  it("should return empty array when no products match filters", async () => {
    await productRepositoryInMemory.create({
      name: "Produto Teste",
      price: 100,
      description: "Descrição",
      category: "COMIC_BOOKS",
      condition: "NEW",
      userId: "1",
      banner: "foto.jpg",
    });

    const result = await listAllProductsUseCase.execute({
      category: "FUNKO_POP",
    });

    expect(result).toHaveLength(0);
  });
});
