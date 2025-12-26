import { randomUUID } from "crypto";
import { AppError } from "../../../../shared/errors/AppError";
import { CreateProductUseCase } from "../../useCases/createProduct/createProductUseCase";
import { UpdateProductImageUseCase } from "../../useCases/updateBannerProduct/updateProductProductUseCase";
import { ProductsRepositoryInMemory } from "./ProductsRepositoryInMemory";
import { InMemoryCacheProvider } from "../../../../shared/container/providers/CacheProvider/Implementations/InMemoryCacheProvider";
import { IStorageProvider } from "../../../../shared/container/providers/StorageProvider/IStorageProvider";

let updateProductImageUseCase: UpdateProductImageUseCase;
let createProductUseCase: CreateProductUseCase;
let productRepositoryInMemory: ProductsRepositoryInMemory;
let cacheProvider: InMemoryCacheProvider;

const mockStorageProvider: IStorageProvider = {
  saveFile: jest.fn().mockImplementation(async (file: Express.Multer.File) => {
    return `https://res.cloudinary.com/test/image/upload/v123/products/${file.originalname}`;
  }),
  deleteFile: jest.fn().mockResolvedValue(undefined),
};

describe("Update Product Image", () => {
  beforeEach(() => {
    productRepositoryInMemory = new ProductsRepositoryInMemory();
    cacheProvider = new InMemoryCacheProvider();
    updateProductImageUseCase = new UpdateProductImageUseCase(
      productRepositoryInMemory,
      cacheProvider,
      mockStorageProvider
    );
    createProductUseCase = new CreateProductUseCase(
      productRepositoryInMemory,
      cacheProvider
    );
  });

  const userId = randomUUID();

  it("should be able to update product image", async () => {
    const product = await createProductUseCase.execute({
      name: "PS5",
      price: 4000,
      description: "Descrição",
      category: "MANGA",
      condition: "USED",
      userId: userId,
    });

    const mockFile = {
      fieldname: "image",
      originalname: "nova-foto.jpg",
      encoding: "7bit",
      mimetype: "image/jpeg",
      buffer: Buffer.from("fake-image-data"),
      size: 1024,
    } as Express.Multer.File;

    const updatedProduct = await updateProductImageUseCase.execute({
      productId: product.id,
      userId: product.user_id,
      file: mockFile,
    });
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    expect(product.id).toMatch(uuidRegex);
    expect(product.user_id).toMatch(uuidRegex);
    expect(updatedProduct.banner).toContain("nova-foto.jpg");
    expect(mockStorageProvider.saveFile).toHaveBeenCalledWith(mockFile);
  });

  it("should not be able to update image of non-existing product", async () => {
    const mockFile = {
      fieldname: "image",
      originalname: "foto.jpg",
      encoding: "7bit",
      mimetype: "image/jpeg",
      buffer: Buffer.from("fake-image-data"),
      size: 1024,
    } as Express.Multer.File;

    await expect(
      updateProductImageUseCase.execute({
        productId: "999",
        userId: userId,
        file: mockFile,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to update image if user is not the owner", async () => {
    const product = await createProductUseCase.execute({
      name: "Xbox",
      price: 3000,
      description: "Descrição",
      category: "MANGA",
      condition: "USED",
      userId: "1",
    });

    const mockFile = {
      fieldname: "image",
      originalname: "hacked.jpg",
      encoding: "7bit",
      mimetype: "image/jpeg",
      buffer: Buffer.from("fake-image-data"),
      size: 1024,
    } as Express.Multer.File;

    await expect(
      updateProductImageUseCase.execute({
        productId: product.id,
        userId: "2",
        file: mockFile,
      })
    ).rejects.toEqual(expect.objectContaining({ statusCode: 403 }));
  });
});
