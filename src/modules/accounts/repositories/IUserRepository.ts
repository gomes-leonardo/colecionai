import { User } from "@prisma/client";

export interface IUserCreateDTO {
  name: string;
  email: string;
  password: string;
}

export interface IUserRepository {
  create(data: IUserCreateDTO): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}
