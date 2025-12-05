import { User } from "@prisma/client";
import { IUserCreateDTO, IUserRepository } from "../IUserRepository";
import prisma from "../../../../shared/infra/prisma";

export class PrismaUsersRepository implements IUserRepository {
  async create({ name, email, password }: IUserCreateDTO): Promise<User> {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    return user;
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  }
}
