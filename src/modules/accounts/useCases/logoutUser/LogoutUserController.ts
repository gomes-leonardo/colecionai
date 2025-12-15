import { Request, Response } from "express";
import { container } from "tsyringe";
import { LogoutUserUseCase } from "./LogoutUserUseCase";
import { AppError } from "../../../../shared/errors/AppError";

export class LogoutUserController {
  async handle(req: Request, res: Response) {
    const token = req.cookies?.token;

    if (token) {
      const logoutUserUseCase = container.resolve(LogoutUserUseCase);
      
      try {
        await logoutUserUseCase.execute(token);
      } catch (error) {
        if (!(error instanceof AppError)) {
          console.error("Erro ao invalidar token no logout:", error);
        }
      }
    }

    res.clearCookie("token", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).send();
  }
}