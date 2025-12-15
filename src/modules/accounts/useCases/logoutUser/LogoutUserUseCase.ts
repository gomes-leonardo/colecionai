import { verify } from "jsonwebtoken";
import { AppError } from "../../../../shared/errors/AppError";
import { ICacheProvider } from "../../../../shared/container/providers/CacheProvider/ICacheProvider";
import { inject, injectable } from "tsyringe";

interface IPayload {
  sub: string;
  jti: string;
}

@injectable()
export class LogoutUserUseCase {
  constructor(
    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}

  async execute(token: string): Promise<void> {
    if (!token) {
      throw new AppError("Token missing", 401);
    }

    try {
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined!");
      }

      const decoded = verify(token, process.env.JWT_SECRET as string) as IPayload;

      if (!decoded.jti) {
        throw new AppError("Token inválido: sem JWT ID", 401);
      }

      const tokenExpiration = (decoded as any).exp;
      const currentTime = Math.floor(Date.now() / 1000);
      const timeToExpire = tokenExpiration - currentTime;

      if (timeToExpire > 0) {
        const blacklistKey = `blacklist:token:${decoded.jti}`;
        await this.cacheProvider.saveWithExpiration(
          blacklistKey,
          { invalidated: true },
          timeToExpire
        );
      }
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      }
    }
  }
}
