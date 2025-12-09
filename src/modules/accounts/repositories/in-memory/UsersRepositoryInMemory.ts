import { User } from "@prisma/client";
import { randomUUID } from "crypto";
import { IUserCreateDTO, IUserRepository } from "../IUserRepository";

export class UsersRepositoryInMemory implements IUserRepository {
  users: User[] = [];

  async create({ name, email, password, isVerified }: IUserCreateDTO): Promise<User> {
    const user: User = {
      id: randomUUID(),
      name,
      email,
      password,
      is_verified: isVerified ?? false,
      created_at: new Date(),
    };

    this.users.push(user);
    return user;
  }

  async update(user: User): Promise<User> {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index === -1) {
      throw new Error("User not found");
    }
    this.users[index] = user;
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);
    return user || null;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id);
    return user || null;
  }
}
