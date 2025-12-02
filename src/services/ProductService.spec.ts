import { ProductService } from "./ProductService";
import { AppError } from "../errors/AppError";
import { pool } from "../db";

jest.mock("../db", () => {
  return {
    pool: {
      query: jest.fn(),
    },
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

const mockedPool = pool as jest.Mocked<typeof pool>;

describe("POST - ProductService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should throw an error if name or price is missing", async () => {
    const productService = new ProductService();
    await expect(productService.create("", 0, 1)).rejects.toBeInstanceOf(
      AppError
    );
  });
  it("should throw an error if name is missing", async () => {
    const productService = new ProductService();

    await expect(productService.create("", 5000, 1)).rejects.toBeInstanceOf(
      AppError
    );
  });
  it("should throw an error if price is missing", async () => {
    const productService = new ProductService();

    await expect(
      productService.create("Macbook air 2010", 0, 1)
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should throw a specific error message", async () => {
    const productService = new ProductService();

    try {
      await productService.create("", 10, 1);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).message).toBe(
        "Nome e preços são obrigatórios."
      );
    }
  });
  it("should create a product successfully", async () => {
    const productService = new ProductService();

    (mockedPool.query as jest.Mock).mockResolvedValue({
      rows: [{ id: 1, name: "Iphone", price: 5000 }],
      rowCount: 1,
    });

    const result = await productService.create("Iphone", 5000, 1);

    expect(result).toHaveProperty("id", 1);
    expect(result.name).toBe("Iphone");

    expect(mockedPool.query).toHaveBeenCalledTimes(1);
  });
});
describe("PUT - ProductService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw a specific error message if name or price is missing", async () => {
    const productService = new ProductService();
    try {
      await productService.update("", 10, 1);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).message).toBe(
        "Nome e preços são obrigatórios."
      );
    }
  });

  it("should throw 404 if product does not exist", async () => {
    const productService = new ProductService();

    (mockedPool.query as jest.Mock).mockResolvedValue({
      rowCount: 0,
      rows: [],
    });

    await expect(productService.update("Xiaomi", 4500, 999)).rejects.toEqual(
      expect.objectContaining({
        statusCode: 404,
        message: "Produto não encontrado",
      })
    );
  });

  it("should update a product successfully", async () => {
    const productService = new ProductService();

    (mockedPool.query as jest.Mock).mockResolvedValue({
      rowCount: 1,
      rows: [{ id: 1, name: "Xiaomi", price: 4500 }],
    });

    const result = await productService.update("Xiaomi", 4500, 1);

    expect(result).toHaveProperty("id", 1);
    expect(result.name).toBe("Xiaomi");
    expect(mockedPool.query).toHaveBeenCalledTimes(1);
  });
});
describe("DELETE - ProductService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw 404 if product does not exist", async () => {
    const productService = new ProductService();

    (mockedPool.query as jest.Mock).mockResolvedValue({
      rowCount: 0,
      rows: [],
    });

    await expect(productService.delete(99)).rejects.toEqual(
      expect.objectContaining({
        statusCode: 404,
        message: "Produto não encontrado",
      })
    );
  });

  it("should delete a product successfully", async () => {
    const productService = new ProductService();

    (mockedPool.query as jest.Mock).mockResolvedValue({
      rowCount: 1,
      rows: [],
    });

    const result = await productService.delete(1);

    expect(result).toBeUndefined();

    expect(mockedPool.query).toHaveBeenCalledTimes(1);

    expect(mockedPool.query).toHaveBeenCalledWith(
      expect.stringContaining("DELETE"),
      expect.arrayContaining([1])
    );
  });
});
