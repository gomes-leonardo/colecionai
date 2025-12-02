import { pool } from "../db";
import { AppError } from "../errors/AppError";
import { UserService } from "./UserService";

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

describe("POST - UserService", () => {
  it("should throw an error if name or email or password is missing", async () => {
    const userService = new UserService();
    await expect(userService.create("", "", "")).rejects.toBeInstanceOf(
      AppError
    );
  });
  it("should throw an error if name is missing", async () => {
    const userService = new UserService();

    await expect(
      userService.create("", "leonardo@teste.com", "Mudar@123")
    ).rejects.toBeInstanceOf(AppError);
  });
  it("should throw an error if email is missing", async () => {
    const userService = new UserService();

    await expect(
      userService.create("Teste Usuario", "", "Mudar@123")
    ).rejects.toBeInstanceOf(AppError);
  });
  it("should throw an error if email is invalid", async () => {
    const userService = new UserService();

    await expect(
      userService.create("Teste Usuario", "leonardo", "Mudar@123")
    ).rejects.toBeInstanceOf(AppError);
  });
  it("should throw an error if password is missing", async () => {
    const userService = new UserService();

    await expect(
      userService.create("Teste Usuario", "test@email.com", "")
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should throw a specific error message", async () => {
    const userService = new UserService();

    try {
      await userService.create("Leonardo", "", "");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).message).toBe(
        "Nome, e-mail e senha são obrigatórios."
      );
    }
  });
  it("should create a user successfully", async () => {
    const userService = new UserService();

    (mockedPool.query as jest.Mock).mockResolvedValueOnce({
      rowCount: 0,
      rows: [],
    });

    (mockedPool.query as jest.Mock).mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          name: "Leonardo",
          email: "user@created.com",
          created_at: new Date(),
        },
      ],
      rowCount: 1,
    });

    const result = await userService.create(
      "Leonardo",
      "user@created.com",
      "Mudar@123"
    );

    expect(result).toHaveProperty("id", 1);
    expect(result.name).toBe("Leonardo");
    expect(result.password).toBeUndefined();

    expect(mockedPool.query).toHaveBeenCalledTimes(2);
  });
});
