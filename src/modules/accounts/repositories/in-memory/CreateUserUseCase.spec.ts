import { UsersRepositoryInMemory } from "../../repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokenRepositoryInMemory } from "../../repositories/in-memory/UsersTokenRepositoryInMemory";
import { AppError } from "../../../../shared/errors/AppError";
import { CreateUserUseCase } from "../../useCases/createUser/createUserUseCase";
import { IQueueProvider } from "../../../../shared/container/providers/QueueProvider/IQueueProvider";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokenRepositoryInMemory: UsersTokenRepositoryInMemory;
let queueProvider: IQueueProvider;

const mockQueueProvider: IQueueProvider = {
  add: jest.fn().mockResolvedValue(undefined),
};

describe("Create User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokenRepositoryInMemory = new UsersTokenRepositoryInMemory();
    queueProvider = mockQueueProvider;
    createUserUseCase = new CreateUserUseCase(
      usersRepositoryInMemory,
      queueProvider,
      usersTokenRepositoryInMemory
    );
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "user@test.com",
      password: "Password123!",
    });

    expect(user).toHaveProperty("id");
    expect(user.id).toBeTruthy();
  });

  it("should not be able to create a user with duplicate email", async () => {
    await createUserUseCase.execute({
      name: "User 1",
      email: "same@test.com",
      password: "Password123!",
    });

    await expect(
      createUserUseCase.execute({
        name: "User 2",
        email: "same@test.com",
        password: "Password123!",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a user with invalid name length", async () => {
    await expect(
      createUserUseCase.execute({
        name: "Ab",
        email: "test@test.com",
        password: "Password123!",
      })
    ).rejects.toEqual(
      expect.objectContaining({ message: "Nome deve ter no mínimo 3 caracteres" })
    );
  });

  it("should not be able to create a user with invalid email format", async () => {
    await expect(
      createUserUseCase.execute({
        name: "User Test",
        email: "invalid-email",
        password: "Password123!",
      })
    ).rejects.toEqual(
      expect.objectContaining({ message: "Formato de e-mail inválido" })
    );
  });

  it("should not be able to create a user with short password", async () => {
    await expect(
      createUserUseCase.execute({
        name: "User Test",
        email: "test@test.com",
        password: "Pass",
      })
    ).rejects.toEqual(
      expect.objectContaining({
        message: "Senha deve ter no mínimo 8 caracteres",
      })
    );
  });

  it("should not be able to create a user with password missing uppercase", async () => {
    await expect(
      createUserUseCase.execute({
        name: "User Test",
        email: "test@test.com",
        password: "password123!",
      })
    ).rejects.toEqual(
      expect.objectContaining({
        message: "Senha deve conter ao menos 1 letra maiúscula",
      })
    );
  });

  it("should not be able to create a user with password missing lowercase", async () => {
    await expect(
      createUserUseCase.execute({
        name: "User Test",
        email: "test@test.com",
        password: "PASSWORD123!",
      })
    ).rejects.toEqual(
      expect.objectContaining({
        message: "Senha deve conter ao menos 1 letra minúscula",
      })
    );
  });

  it("should not be able to create a user with password missing number", async () => {
    await expect(
      createUserUseCase.execute({
        name: "User Test",
        email: "test@test.com",
        password: "Password!",
      })
    ).rejects.toEqual(
      expect.objectContaining({ message: "Senha deve conter ao menos 1 número" })
    );
  });

  it("should not be able to create a user with password missing special character", async () => {
    await expect(
      createUserUseCase.execute({
        name: "User Test",
        email: "test@test.com",
        password: "Password123",
      })
    ).rejects.toEqual(
      expect.objectContaining({
        message: "Senha deve conter ao menos 1 caractere especial",
      })
    );
  });
});
