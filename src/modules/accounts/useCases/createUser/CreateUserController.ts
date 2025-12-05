import { Request, Response } from "express";
import { CreateUserUseCase } from "./createUserUseCase";
import { PrismaUsersRepository } from "../../repositories/prisma/PrismaUsersRepository";

export class CreateUserController {
  async handle(req: Request, res: Response) {
    const { name, email, password } = req.body;
    const userRepository = new PrismaUsersRepository();
    const createUserUseCase = new CreateUserUseCase(userRepository);

    const result = await createUserUseCase.execute({
      name,
      email,
      password,
    });

    return res.status(201).json(result);
  }
}
