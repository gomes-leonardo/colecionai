import { hash } from "bcryptjs";
import { pool } from "../db";
import { AppError } from "../errors/AppError";
import { AuthenticateUserService } from "./AuthenticateUserService";
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

describe("SessionService", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret-key-123";
  });
  it("should throw an error if email or password is missing", async () => {
    const sessionService = new AuthenticateUserService();
    await expect(sessionService.create("", "")).rejects.toBeInstanceOf(
      AppError
    );
  });
  it("should throw an error if email is missing", async () => {
    const sessionService = new AuthenticateUserService();

    await expect(sessionService.create("", "Mudar@123")).rejects.toBeInstanceOf(
      AppError
    );
  });
  it("should throw an error if password is missing", async () => {
    const sessionService = new AuthenticateUserService();

    await expect(
      sessionService.create("session@test.com", "")
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should throw a specific error message", async () => {
    const sessionService = new AuthenticateUserService();

    try {
      await sessionService.create("session@test.com", "");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).message).toBe(
        "E-mail e senha são obrigatórios."
      );
    }
  });
  it("should authenticate a user successfully", async () => {
    const authenticateUser = new AuthenticateUserService();

    const hashedPassword = await hash("123456", 8);

    (mockedPool.query as jest.Mock).mockResolvedValue({
      rowCount: 1,
      rows: [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          password: hashedPassword,
        },
      ],
    });

    const response = await authenticateUser.create(
      "john@example.com",
      "123456"
    );

    expect(response).toHaveProperty("token");
    expect(response.user.email).toBe("john@example.com");
  });
  it("should not authenticate with incorrect email", async () => {
    const authenticateUser = new AuthenticateUserService();

    (mockedPool.query as jest.Mock).mockResolvedValue({
      rowCount: 0,
      rows: [],
    });

    await expect(
      authenticateUser.create("email@errado.com", "123456")
    ).rejects.toEqual(
      expect.objectContaining({ message: "Email ou senha incorretos." })
    );
  });

  it("should not authenticate with incorrect password", async () => {
    const authenticateUser = new AuthenticateUserService();

    const hashedPassword = await hash("senha_correta", 8);

    (mockedPool.query as jest.Mock).mockResolvedValue({
      rowCount: 1,
      rows: [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          password: hashedPassword,
        },
      ],
    });

    await expect(
      authenticateUser.create("john@example.com", "senha_errada")
    ).rejects.toEqual(
      expect.objectContaining({ message: "Email ou senha incorretos." })
    );
  });
});
