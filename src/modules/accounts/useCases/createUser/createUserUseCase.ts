import { hash } from "bcryptjs";
import { AppError } from "../../../../shared/errors/AppError";
import {
  IUserCreateDTO,
  IUserRepository,
} from "../../repositories/IUserRepository";

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ name, email, password }: IUserCreateDTO) {
    if (!name || !email || !password) {
      throw new AppError("Nome, e-mail e senha são obrigatórios.", 400);
    }
    const userAlreadyExists = await this.userRepository.findByEmail(email);
    if (userAlreadyExists) {
      throw new AppError("Email já cadastrado.", 409);
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError("Formato de e-mail inválido.", 400);
    }
    const passwordHash = await hash(password, 8);
    const user = await this.userRepository.create({
      name,
      email,
      password: passwordHash,
    });

    return user;
  }
}
