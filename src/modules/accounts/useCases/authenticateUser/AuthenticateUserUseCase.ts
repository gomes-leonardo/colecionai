import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { AppError } from "../../../../shared/errors/AppError";
import { IUserRepository } from "../../repositories/IUserRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private userRepository: IUserRepository
  ) {}
  async execute({ email, password }: { email: string; password: string }) {
    if (!email || !password) {
      throw new AppError("E-mail e senha são obrigatórios.", 400);
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError("Formato de e-mail inválido.", 400);
    }

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Email ou senha incorretos.", 401);
    }

    const passwordMatched = await compare(password, user.password);
    if (!passwordMatched) {
      throw new AppError("Email ou senha incorretos.", 401);
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined!");
    }

    const token = sign({}, process.env.JWT_SECRET as string, {
      subject: String(user.id),
      expiresIn: "30d",
    });

    if (!user.is_verified) {
      throw new AppError(
        "Seu e-mail ainda não foi verificado. Enviamos um novo link de verificação para você agora.",
        401
      );
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  }
}
