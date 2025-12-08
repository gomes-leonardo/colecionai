import { hash } from "bcryptjs";
import { AppError } from "../../../../shared/errors/AppError";
import {
  IUserCreateDTO,
  IUserRepository,
} from "../../repositories/IUserRepository";

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string, password: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError("Usuário não encontrado.", 409);
    }
    const passwordHash = await hash(password, 8);
    const newUser = await this.userRepository.update({
      id: user.id,
      name: user.name,
      email: user.email,
      password: passwordHash,
      created_at: user.created_at,
    });

    return newUser;
  }
}
