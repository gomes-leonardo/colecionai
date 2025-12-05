import { User } from "@prisma/client";
import { randomUUID } from "crypto";
import { IUserCreateDTO, IUserRepository } from "../IUserRepository";

export class UsersRepositoryInMemory implements IUserRepository {
  users: User[] = [];

  async create({ name, email, password }: IUserCreateDTO): Promise<User> {
    const user: User = {
      id: 1,
      name,
      email,
      password,
      created_at: new Date(),
    };

    this.users.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);
    return user || null;
  }
}
