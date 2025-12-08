import { hash } from "bcryptjs";
import { AppError } from "../../../../shared/errors/AppError";
import {
  IUserCreateDTO,
  IUserRepository,
} from "../../repositories/IUserRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUserRepository
  ) {}

  async execute({ name, email, password }: IUserCreateDTO) {
    if (!name || !email || !password) {
      throw new AppError("Nome, e-mail e senha são obrigatórios.", 400);
    }

    if (name.length < 3) {
      throw new AppError("Nome deve ter no mínimo 3 caracteres", 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError("Formato de e-mail inválido", 400);
    }

    if (password.length < 8) {
      throw new AppError("Senha deve ter no mínimo 8 caracteres", 400);
    }

    if (!/[A-Z]/.test(password)) {
      throw new AppError("Senha deve conter ao menos 1 letra maiúscula", 400);
    }

    if (!/[a-z]/.test(password)) {
      throw new AppError("Senha deve conter ao menos 1 letra minúscula", 400);
    }

    if (!/[0-9]/.test(password)) {
      throw new AppError("Senha deve conter ao menos 1 número", 400);
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      throw new AppError(
        "Senha deve conter ao menos 1 caractere especial",
        400
      );
    }

    const userAlreadyExists = await this.usersRepository.findByEmail(email);
    if (userAlreadyExists) {
      throw new AppError("Email já cadastrado.", 409);
    }
    const passwordHash = await hash(password, 8);
    const user = await this.usersRepository.create({
      name,
      email,
      password: passwordHash,
    });

    return user;
  }
}
