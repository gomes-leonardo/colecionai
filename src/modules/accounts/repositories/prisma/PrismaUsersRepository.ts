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
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      return user;
    } catch (error: any) {
      if (error?.code === 'ECONNREFUSED' || error?.message?.includes('ECONNREFUSED')) {
        throw new Error('Banco de dados não está disponível. Verifique se o PostgreSQL está rodando.');
      }
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  }

  async update(user: User): Promise<User> {
    const updatedPassword = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: user.password,
        is_verified: user.is_verified,
      },
    });

    return updatedPassword;
  }
}
