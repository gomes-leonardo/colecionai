import { Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { AuthenticateUserService } from "../services/AuthenticateUserService";

const authenticateUserService = new AuthenticateUserService();

export class SessionController {
  async create(req: Request, res: Response) {
    const { name, email, password } = req.body;

    try {
      const result = await authenticateUserService.create(email, password);
      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      console.error(error);
      return res.status(500).json({ error: "Erro ao criar sessão" });
    }
  }
}
