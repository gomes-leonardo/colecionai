import { Prisma, User } from "@prisma/client";

export interface IUserCreateDTO {
  name: string;
  email: string;
  password: string;
  isVerified?: boolean;
}

export interface IUserRepository {
  create(data: IUserCreateDTO): Promise<User>;
  update(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
