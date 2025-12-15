import { hash } from "bcryptjs";
import { AppError } from "../../../../shared/errors/AppError";
import { IUserRepository } from "../../repositories/IUserRepository";
import { IUsersTokensRepository } from "../../repositories/IUserTokensRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class ResetPasswordUseCase {
  constructor(
    @inject("UsersTokenRepository")
    private userTokenRepository: IUsersTokensRepository,
    @inject("UsersRepository")
    private userRepository: IUserRepository
  ) {}

  async execute(token: string, password: string): Promise<void> {
    if (!password) {
      throw new AppError("Senha é obrigatória.", 400);
    }

    if (password.length < 8) {
      throw new AppError("A senha deve ter no mínimo 8 caracteres.", 400);
    }

    if (!/[A-Z]/.test(password)) {
      throw new AppError(
        "A senha deve conter pelo menos uma letra maiúscula.",
        400
      );
    }

    if (!/[a-z]/.test(password)) {
      throw new AppError(
        "A senha deve conter pelo menos uma letra minúscula.",
        400
      );
    }

    if (!/[0-9]/.test(password)) {
      throw new AppError("A senha deve conter pelo menos um número.", 400);
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      throw new AppError(
        "A senha deve conter pelo menos um caractere especial.",
        400
      );
    }

    const userToken = await this.userTokenRepository.findByPasswordToken(token);

    if (!userToken) {
      throw new AppError("Token invalid", 400);
    }

    if (new Date() > userToken.expires_at) {
      throw new AppError("Token expired", 400);
    }

    const user = await this.userRepository.findById(userToken.user_id);
    if (!user) {
      throw new AppError("User does not exists", 400);
    }

    const passwordHash = await hash(password, 8);

    user.password = passwordHash;
    await this.userRepository.update(user);

    await this.userTokenRepository.deleteById(userToken.id);
  }
}
