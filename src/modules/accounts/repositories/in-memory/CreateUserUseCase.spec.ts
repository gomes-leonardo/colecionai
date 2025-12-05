import { UsersRepositoryInMemory } from "../../repositories/in-memory/UsersRepositoryInMemory";
import { AppError } from "../../../../shared/errors/AppError";
import { CreateUserUseCase } from "../../useCases/createUser/createUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;

describe("Create User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "user@test.com",
      password: "123",
    });

    expect(user).toHaveProperty("id");
    expect(user.id).toBeTruthy();
  });

  it("should not be able to create a user with duplicate email", async () => {
    await createUserUseCase.execute({
      name: "User 1",
      email: "same@test.com",
      password: "123",
    });

    await expect(
      createUserUseCase.execute({
        name: "User 2",
        email: "same@test.com",
        password: "123",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
