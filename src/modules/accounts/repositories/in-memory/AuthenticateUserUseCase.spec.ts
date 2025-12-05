import { AppError } from "../../../../shared/errors/AppError";
import { AuthenticateUserUseCase } from "../../useCases/authenticateUser/AuthenticateUserUseCase";
import { UsersRepositoryInMemory } from "./UsersRepositoryInMemory";
import { CreateUserUseCase } from "../../useCases/createUser/createUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret";
  });

  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to authenticate an user", async () => {
    const user = await createUserUseCase.execute({
      name: "User Auth",
      email: "auth@test.com",
      password: "Password@123",
    });

    const response = await authenticateUserUseCase.execute({
      email: "auth@test.com",
      password: "Password@123",
    });

    expect(response.user.email).toBe("auth@test.com");
  });

  it("should not be able to authenticate with incorrect password", async () => {
    await createUserUseCase.execute({
      name: "User Wrong",
      email: "wrong@test.com",
      password: "Password@123",
    });

    await expect(
      authenticateUserUseCase.execute({
        email: "wrong@test.com",
        password: "wrong-password",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate with non-existent user", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "nonexistent@test.com",
        password: "password",
      })
    ).rejects.toEqual(
      expect.objectContaining({ message: "Email ou senha incorretos." })
    );
  });

  it("should not be able to authenticate without email", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "",
        password: "password",
      })
    ).rejects.toEqual(
      expect.objectContaining({ message: "E-mail e senha são obrigatórios." })
    );
  });

  it("should not be able to authenticate without password", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "test@test.com",
        password: "",
      })
    ).rejects.toEqual(
      expect.objectContaining({ message: "E-mail e senha são obrigatórios." })
    );
  });

  it("should not be able to authenticate with invalid email format", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "invalid-email",
        password: "password",
      })
    ).rejects.toEqual(
      expect.objectContaining({ message: "Formato de e-mail inválido." })
    );
  });
});
