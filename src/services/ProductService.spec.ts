import { ProductService } from "./ProductService";
import { AppError } from "../errors/AppError";
import { pool } from "../db";

jest.mock("../db", () => ({
  pool: {
    query: jest.fn(),
  },
}));

const mockedPool = pool as jest.Mocked<typeof pool>;

describe("ProductService Unit Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create()", () => {
    it("should throw error if inputs are missing", async () => {
      const service = new ProductService();
      await expect(service.create("", 0, 1)).rejects.toBeInstanceOf(AppError);
      await expect(service.create("TV", 0, 1)).rejects.toBeInstanceOf(AppError);
    });

    it("should throw DB error if user_id does not exist (Foreign Key)", async () => {
      const service = new ProductService();
      // Simulando erro do Postgres
      (mockedPool.query as jest.Mock).mockRejectedValue(
        new Error("violates foreign key constraint")
      );

      await expect(service.create("Iphone", 5000, 999)).rejects.toThrow(
        "violates foreign key constraint"
      );
    });

    it("should create a product successfully", async () => {
      const service = new ProductService();

      // Mock do INSERT
      (mockedPool.query as jest.Mock).mockResolvedValue({
        rows: [{ id: 1, name: "Iphone", price: 5000, user_id: 1 }],
        rowCount: 1,
      });

      const result = await service.create("Iphone", 5000, 1);

      expect(result).toHaveProperty("id", 1);
      expect(result.name).toBe("Iphone");
    });
  });

  describe("update()", () => {
    it("should throw 403 Forbidden if user is NOT the owner", async () => {
      const service = new ProductService();
      const productId = 10;
      const ownerId = 50;
      const hackerId = 999;

      (mockedPool.query as jest.Mock).mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ id: productId, user_id: ownerId, name: "Original" }],
      });

      await expect(
        service.update("Hacked", 100, hackerId, productId)
      ).rejects.toEqual(
        expect.objectContaining({
          statusCode: 403,
          message: expect.stringContaining("permissão"),
        })
      );
    });

    it("should throw 404 if product does not exist", async () => {
      const service = new ProductService();
      (mockedPool.query as jest.Mock).mockResolvedValue({
        rowCount: 0,
        rows: [],
      });

      await expect(
        service.update("Xiaomi", 4500, 1, 999)
      ).rejects.toHaveProperty("statusCode", 404);
    });

    it("should update a product successfully", async () => {
      const service = new ProductService();
      const userId = 1;

      (mockedPool.query as jest.Mock).mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ id: 1, user_id: userId, name: "Old Name" }],
      });

      (mockedPool.query as jest.Mock).mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ id: 1, user_id: userId, name: "New Name", price: 4500 }],
      });

      const result = await service.update("New Name", 4500, userId, 1);

      expect(result.name).toBe("New Name");
      expect(mockedPool.query).toHaveBeenCalledTimes(2);
    });
  });

  describe("delete()", () => {
    it("should throw 403 Forbidden if user is NOT the owner", async () => {
      const service = new ProductService();

      (mockedPool.query as jest.Mock).mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ id: 1, user_id: 50 }],
      });

      await expect(service.delete(1, 999)).rejects.toHaveProperty(
        "statusCode",
        403
      );
    });

    it("should delete a product successfully", async () => {
      const service = new ProductService();
      const userId = 1;

      (mockedPool.query as jest.Mock).mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ id: 1, user_id: userId }],
      });

      (mockedPool.query as jest.Mock).mockResolvedValueOnce({
        rowCount: 1,
        rows: [],
      });

      await service.delete(1, userId);

      expect(mockedPool.query).toHaveBeenCalledTimes(2);
      expect(mockedPool.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining("DELETE"),
        expect.any(Array)
      );
    });
  });

  describe("list() & listByUserId()", () => {
    it("should return all products", async () => {
      const service = new ProductService();
      const fakeData = [{ id: 1, name: "TV" }];

      (mockedPool.query as jest.Mock).mockResolvedValue({ rows: fakeData });

      const result = await service.list();
      expect(result).toEqual(fakeData);
    });

    it("should list my products", async () => {
      const service = new ProductService();
      const fakeData = [{ id: 1, name: "TV", user_id: 1 }];

      (mockedPool.query as jest.Mock).mockResolvedValue({ rows: fakeData });

      const result = await service.listByUserId(1);
      expect(result).toHaveLength(1);
      expect(result[0].user_id).toBe(1);
    });
  });
});
